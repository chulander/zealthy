'use server';
import { db } from '@zealthy-app/db/db';
import { userWorkflows, workflowSteps } from '@zealthy-app/db/schema';
import { eq, count } from 'drizzle-orm';

export async function getWorkflowStepDetails(userId: string): Promise<{
  workflowId: string;
  workflowName: string;
  completedSteps: number;
  totalSteps: number;
  currentStep: number;
  isWorkflowComplete: boolean;
  components: string; // Comma-delimited string of components
} | null> {
  // Fetch the user's workflow progress
  const userWorkflow = await db.query.userWorkflows.findFirst({
    where: eq(userWorkflows.userId, userId),
    columns: {
      workflowId: true,
      completedSteps: true,
    },
    with: {
      workflow: {
        columns: {
          name: true, // Workflow name
        },
      },
    },
  });

  if (!userWorkflow) return null;

  // Fetch the total steps in the workflow
  const totalStepsResult = await db
    .select({
      count: count(),
    })
    .from(workflowSteps)
    .where(eq(workflowSteps.workflowId, userWorkflow.workflowId))
    .execute();

  const totalSteps = totalStepsResult[0]?.count || 0;

  // Determine the current step
  const currentStep =
    userWorkflow.completedSteps >= totalSteps
      ? totalSteps // If all steps are completed, return the total steps
      : userWorkflow.completedSteps + 1; // Otherwise, return the next step

  // Fetch the components for the workflow steps
  const workflowStepsResult = await db
    .select({
      component: workflowSteps.component,
    })
    .from(workflowSteps)
    .where(eq(workflowSteps.workflowId, userWorkflow.workflowId))
    .orderBy(workflowSteps.step) // Ensure steps are ordered
    .execute();

  // Map the components to a comma-delimited string
  const components = workflowStepsResult.map((step) => step.component).join(',');

  return {
    workflowId: userWorkflow.workflowId,
    workflowName: userWorkflow.workflow.name,
    completedSteps: userWorkflow.completedSteps,
    totalSteps,
    currentStep,
    isWorkflowComplete: userWorkflow.completedSteps >= totalSteps,
    components,
  };
}
