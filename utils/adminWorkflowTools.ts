import { db } from '@zealthy-app/db/db';
import { workflows } from '@zealthy-app/db/schema';
import { desc } from 'drizzle-orm';

export async function getLatestWorkflowId(): Promise<string | null> {
  const latestWorkflow = await db.query.workflows.findFirst({
    orderBy: [desc(workflows.createdAt)], // Use `desc` for descending order
  });

  return latestWorkflow ? latestWorkflow.id : null;
}
