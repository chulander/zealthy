import 'server-only';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from '@zealthy-app/db/db';
import { eq, count } from 'drizzle-orm';
import { users, userWorkflows, workflowSteps } from '@zealthy-app/db/schema';
import bcrypt from 'bcrypt';
import { getLatestWorkflowId } from '@zealthy-app/utils/adminWorkflowTools';

const SECRET = process.env.JWT_SECRET!;

// Hash password
const hashPW = (password: string) => {
  return bcrypt.hash(password, 10);
};

// Compare passwords
const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW);
};
const createAccessToken = (userId: string) => {
  const token = jwt.sign({ sub: userId }, SECRET);
  return token;
};

const createIdToken = (userId: string, email: string) => {
  const token = jwt.sign({ sub: userId, email }, SECRET);
  return token;
};

export async function getUserFromToken(): Promise<{ id: string; email: string } | null> {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('id_token')?.value;

  if (!idToken) {
    return null;
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(idToken, SECRET) as { sub: string; email: string };
    const { sub: id, email } = decoded;
    return { id, email }; // Assuming the userId is stored in the `id` field
  } catch (error) {
    console.error('Error decoding id_token:', error);
    return null;
  }
}

export const signin = async ({ email, password }: { email: string; password: string }) => {
  // Step 1: Check if the user exists
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Step 2: Verify the password
  const isPasswordCorrect = await comparePW(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password.');
  }

  // Step 3: Fetch the user's workflow progress
  const userWorkflow = await db.query.userWorkflows.findFirst({
    where: eq(userWorkflows.userId, user.id),
    columns: {
      workflowId: true,
      completedSteps: true,
    },
  });

  if (!userWorkflow) {
    throw new Error('User workflow not found.');
  }

  // Step 4: Calculate the current step and check if the workflow is complete
  const totalStepsResult = await db
    .select({
      count: count(),
    })
    .from(workflowSteps)
    .where(eq(workflowSteps.workflowId, userWorkflow.workflowId))
    .execute();

  const totalSteps = totalStepsResult[0]?.count || 0;

  const currentStep = userWorkflow.completedSteps >= totalSteps ? totalSteps : userWorkflow.completedSteps + 1;
  const isComplete = userWorkflow.completedSteps >= totalSteps;

  // Step 5: Generate tokens
  const access_token = createAccessToken(user.id);
  const id_token = createIdToken(user.id, user.email);

  return { user, access_token, id_token, currentStep, isComplete };
};

// Signup action
export const signup = async ({ email, password }: { email: string; password: string }) => {
  const hashedPW = await hashPW(password);

  // Fetch the latest workflow
  const latestWorkflow = await getLatestWorkflowId();

  if (!latestWorkflow) {
    throw new Error('No workflows available.');
  }

  // Create the user
  const rows = await db.insert(users).values({ email, password: hashedPW }).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
  });

  const user = rows[0];

  // Create an entry in the userWorkflows table for the newly created user
  await db.insert(userWorkflows).values({
    userId: user.id,
    workflowId: latestWorkflow,
    completedSteps: 0, // No steps completed initially
  });

  const access_token = createAccessToken(user.id);
  const id_token = createIdToken(user.id, user.email);

  return { user, access_token, id_token, currentStep: 0, isComplete: false };
};
