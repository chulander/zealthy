'use server';

import { db } from '@zealthy-app/db/db';
import { users, userWorkflows, workflows, workflowSteps, addresses, aboutMe, birthdates } from '@zealthy-app/db/schema';
import { eq } from 'drizzle-orm';

export const fetchWorkflowData = async () => {
  try {
    const data = await db
      .select({
        userId: users.id,
        email: users.email,
        workflowName: workflows.name,
        workflowId: workflows.id,
        step: workflowSteps.step,
        component: workflowSteps.component,
        aboutMeContent: aboutMe.content,
        addressStreet: addresses.street,
        addressCity: addresses.city,
        addressState: addresses.state,
        addressZip: addresses.zip,
        birthdate: birthdates.birthdate,
      })
      .from(users)
      .leftJoin(userWorkflows, eq(users.id, userWorkflows.userId))
      .leftJoin(workflows, eq(userWorkflows.workflowId, workflows.id))
      .leftJoin(workflowSteps, eq(workflows.id, workflowSteps.workflowId))
      .leftJoin(aboutMe, eq(workflowSteps.id, aboutMe.stepId))
      .leftJoin(addresses, eq(workflowSteps.id, addresses.stepId))
      .leftJoin(birthdates, eq(workflowSteps.id, birthdates.stepId));

    const formattedData = data.map((row) => {
      let data = null;
      if (row.component === 'about_me') {
        data = row.aboutMeContent;
      } else if (row.component === 'address') {
        data = {
          street: row.addressStreet,
          city: row.addressCity,
          state: row.addressState,
          zip: row.addressZip,
        };
      } else if (row.component === 'birthdate') {
        data = row.birthdate;
      }

      return {
        userId: row.userId,
        email: row.email,
        workflowName: row.workflowName,
        workflowId: row.workflowId,
        step: row.step,
        component: row.component,
        data,
      };
    });

    return formattedData;
  } catch (error) {
    console.error('Error fetching workflow data:', error);
    throw new Error('Failed to fetch workflow data.');
  }
};
