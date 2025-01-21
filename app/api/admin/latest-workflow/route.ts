import { NextResponse } from 'next/server';
import { fetchLatestWorkflow } from '@zealthy-app/actions/admin';

export async function GET() {
  const workflow = await fetchLatestWorkflow();
  return NextResponse.json(workflow);
}
