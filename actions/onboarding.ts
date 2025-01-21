'use server';

import { db } from '@zealthy-app/db/db';
import { userWorkflows, workflowSteps, aboutMe, addresses, birthdates } from '@zealthy-app/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function completeStep(
  userId: string,
  completedStep: number,
  workflowId: string,
  componentType: string,
  componentData: Record<string, any>, // Data to update the component
) {
  console.log('Component Data Received:', componentData);

  // Step 1: Fetch the user's workflow
  const userWorkflow = await db.query.userWorkflows.findFirst({
    where: and(eq(userWorkflows.userId, userId), eq(userWorkflows.workflowId, workflowId)),
    columns: {
      userId: true,
      workflowId: true,
      completedSteps: true,
    },
  });

  if (!userWorkflow) {
    throw new Error('User workflow not found.');
  }

  const { workflowId: userWorkflowId, completedSteps } = userWorkflow;

  // Step 2: Validate the step being marked as complete
  if (completedStep <= completedSteps) {
    throw new Error('Step already completed or invalid step.');
  }

  // Step 3: Fetch the workflow step details
  const step = await db.query.workflowSteps.findFirst({
    where: and(eq(workflowSteps.workflowId, workflowId), eq(workflowSteps.step, completedStep)),
    columns: {
      id: true,
      component: true,
    },
  });

  if (!step) {
    throw new Error(`Step ${completedStep} not found for the workflow.`);
  }

  if (step.component !== componentType) {
    throw new Error(
      `Component type mismatch for step ${completedStep}. Expected: ${step.component}, Received: ${componentType}`,
    );
  }

  // Step 4: Handle updating the component data
  try {
    switch (componentType) {
      case 'about_me':
        await db
          .insert(aboutMe)
          .values({
            userId,
            workflowId,
            stepId: step.id, // Use the correct `stepId`
            content: componentData.aboutMe, // Correct property access
          })
          .onConflictDoUpdate({
            target: [aboutMe.userId, aboutMe.workflowId, aboutMe.stepId], // Composite unique constraint
            set: { content: componentData.aboutMe }, // Update existing record
          });
        break;

      case 'address':
        await db
          .insert(addresses)
          .values({
            userId,
            workflowId,
            stepId: step.id,
            street: componentData.street,
            city: componentData.city,
            state: componentData.state,
            zip: componentData.zip,
          })
          .onConflictDoUpdate({
            target: [addresses.userId, addresses.workflowId, addresses.stepId],
            set: {
              street: componentData.street,
              city: componentData.city,
              state: componentData.state,
              zip: componentData.zip,
            },
          });
        break;

      case 'birthdate':
        await db
          .insert(birthdates)
          .values({
            userId,
            workflowId,
            stepId: step.id,
            birthdate: componentData.birthdate,
          })
          .onConflictDoUpdate({
            target: [birthdates.userId, birthdates.workflowId, birthdates.stepId],
            set: { birthdate: componentData.birthdate },
          });
        break;

      default:
        throw new Error(`Unsupported component type: ${componentType}`);
    }
  } catch (error) {
    console.error('Error updating component data:', error);
    throw new Error(`Failed to update component data for step ${completedStep}.`);
  }

  // Step 5: Update the completed steps in the `userWorkflows` table
  try {
    await db
      .update(userWorkflows)
      .set({
        completedSteps: completedStep, // Update completed steps to the current step
        editedAt: sql`CURRENT_TIMESTAMP`, // Update timestamp
      })
      .where(eq(userWorkflows.workflowId, userWorkflowId));
  } catch (error) {
    console.error('Error updating completed steps:', error);
    throw new Error('Failed to update completed steps.');
  }

  return { success: true, message: `Step ${completedStep} marked as complete.` };
}
