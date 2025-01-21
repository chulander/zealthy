'use server';

import { db } from '@zealthy-app/db/db';
import { workflows, workflowSteps } from '@zealthy-app/db/schema';
import { z } from 'zod';
import { desc } from 'drizzle-orm';

export const fetchLatestWorkflow = async () => {
  try {
    const workflow = await db.query.workflows.findFirst({
      orderBy: desc(workflows.createdAt),
      with: {
        steps: true,
      },
    });

    console.log('Fetched Workflow:', workflow); // Debugging log

    if (!workflow) {
      return {
        success: false,
        message: 'No workflows found.',
      };
    }

    return {
      success: true,
      id: workflow.id,
      name: workflow.name,
      steps: workflow.steps.map((step) => ({
        step: step.step,
        component: step.component,
      })),
    };
  } catch (error) {
    console.error('Error fetching the latest workflow:', error);
    return {
      success: false,
      message: 'Failed to fetch the latest workflow.',
    };
  }
};

// Zod schema for validation
const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  steps: z
    .array(
      z.object({
        step: z.number().int().min(1).max(2, 'Step must be either 1 or 2'),
        component: z.enum(['about_me', 'address', 'birthdate']),
      }),
    )
    .length(2, 'A workflow must have exactly 2 steps.'), // Ensure exactly 2 steps
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createWorkflow = async (formData: any) => {
  try {
    // Handle formData passed as an object, FormData instance, or array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formDataObject: Record<string, any>;

    if (Array.isArray(formData)) {
      // Convert array of key-value pairs to an object
      formDataObject = Object.fromEntries(formData);
    } else if (formData instanceof FormData) {
      // Convert FormData to an object
      formDataObject = Object.fromEntries(formData.entries());
    } else if (typeof formData === 'object' && formData !== null) {
      // Assume it's already an object
      formDataObject = formData;
    } else {
      throw new Error('Invalid formData format');
    }

    // Parse and validate the form data
    const data = createWorkflowSchema.parse({
      name: formDataObject.name,
      steps: JSON.parse(formDataObject.steps),
    });

    // Insert the new workflow into the database
    const [newWorkflow] = await db.insert(workflows).values({ name: data.name }).returning();

    if (!newWorkflow) {
      throw new Error('Failed to create workflow.');
    }

    // Insert the workflow steps
    await db.insert(workflowSteps).values(
      data.steps.map((step) => ({
        workflowId: newWorkflow.id,
        step: step.step,
        component: step.component,
      })),
    );

    return { success: true, workflowId: newWorkflow.id };
  } catch (error) {
    console.error('Error creating workflow:', error);

    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create workflow.',
    };
  }
};
