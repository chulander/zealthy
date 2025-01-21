'use client';

import { useState, useEffect } from 'react';
import { AdminCreateWorkFlowForm } from '@zealthy-app/components/AdminCreateWorkFlowForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@zealthy-app/components/ui/card';

interface Workflow {
  id: string;
  name: string;
  steps: { step: number; component: string }[];
}
async function fetchLatestWorkflow() {
  const res = await fetch('/api/admin/latest-workflow'); // Adjust to your actual API route
  const data = await res.json();
  return data;
}

export default function AdminPage() {
  const [latestWorkflow, setLatestWorkflow] = useState<Workflow | null>(null);

  const loadLatestWorkflow = async () => {
    const workflow = await fetchLatestWorkflow();
    setLatestWorkflow(workflow);
  };

  useEffect(() => {
    loadLatestWorkflow();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Latest Workflow Details */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Workflow</CardTitle>
            <CardDescription>Details of the most recently created workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            {latestWorkflow ? (
              <div className="space-y-4">
                <p>
                  <strong>Workflow ID:</strong> {latestWorkflow.id}
                </p>
                <p>
                  <strong>Name:</strong> {latestWorkflow.name}
                </p>
                <div>
                  <h4 className="font-medium">Steps:</h4>
                  <ul className="list-disc pl-5">
                    {latestWorkflow.steps.map((step) => (
                      <li key={step.step}>
                        Step {step.step}: {step.component}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-red-500">Loading...</p>
            )}
          </CardContent>
        </Card>

        {/* Create Workflow Form */}
        <AdminCreateWorkFlowForm onWorkflowCreated={loadLatestWorkflow} />
      </div>
    </div>
  );
}
