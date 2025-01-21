import { db } from '@zealthy-app/db/db';
import { workflows, workflowSteps } from '@zealthy-app/db/schema';
import { randomUUID } from 'crypto';

async function seedWorkflow() {
  try {
    // Define the workflow
    const workflowId = randomUUID();
    const workflowName = 'Test Workflow';

    // Insert the workflow
    await db.insert(workflows).values({
      id: workflowId,
      name: workflowName,
    });

    console.log(`Workflow '${workflowName}' inserted with ID: ${workflowId}`);

    // Define two steps for the workflow
    const steps = [
      {
        id: randomUUID(),
        workflowId: workflowId,
        step: 1,
        component: 'about_me' as const, // Explicitly set the component to the allowed type
      },
      {
        id: randomUUID(),
        workflowId: workflowId,
        step: 2,
        component: 'address' as const, // Explicitly set the component to the allowed type
      },
    ];

    // Insert the workflow steps
    await db.insert(workflowSteps).values(steps);

    console.log('Workflow steps inserted:');
    steps.forEach((step) => {
      console.log(`  Step ${step.step}: ${step.component}`);
    });

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding workflow:', error);
  }
}

seedWorkflow();
