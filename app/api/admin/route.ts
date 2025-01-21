import { NextResponse } from 'next/server';
import { db } from '@zealthy-app/db/db';
import { workflows, workflowSteps } from '@zealthy-app/db/schema';
import { z } from 'zod';

const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  steps: z
    .array(
      z.object({
        step: z.number().min(1).max(2, 'Step must be 1 or 2'),
        component: z.enum(['about_me', 'address', 'birthdate']),
      }),
    )
    .length(2, 'A workflow must have exactly 2 steps.'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createWorkflowSchema.parse(body);

    const [newWorkflow] = await db.insert(workflows).values({ name: data.name }).returning();

    if (!newWorkflow) {
      throw new Error('Failed to create workflow.');
    }

    await db.insert(workflowSteps).values(
      data.steps.map((step) => ({
        workflowId: newWorkflow.id,
        step: step.step,
        component: step.component,
      })),
    );

    return NextResponse.json({ success: true, workflowId: newWorkflow.id });
  } catch (error) {
    console.error('Error creating workflow:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
