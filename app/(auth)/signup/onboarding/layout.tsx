// app/(auth)/signup/onboarding/layout.tsx
import { getUserFromToken } from '@zealthy-app/utils/authTools';
import { getWorkflowStepDetails } from '@zealthy-app/utils/userWorkFlowTools';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { UserProvider } from '@zealthy-app/context/UserContext';
import DynamicStepTracker from '@zealthy-app/components/DynamicStepTracker'; // New client component

interface LayoutProps {
  children: ReactNode;
}

export default async function OnboardingLayout({ children }: LayoutProps) {
  const user = await getUserFromToken();
  if (!user) {
    redirect('/signin');
  }

  const workflowDetails = await getWorkflowStepDetails(user.id);
  if (!workflowDetails) {
    redirect('/signup');
  }

  const { currentStep, totalSteps, components, workflowId, completedSteps } = workflowDetails;

  return (
    <UserProvider
      value={{ userId: user.id, email: user.email, currentStep, components, workflowId, totalSteps, completedSteps }}
    >
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-md">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Onboarding Process</h1>
            {/* Dynamic step tracker */}
            <DynamicStepTracker currentStep={currentStep} totalSteps={totalSteps} />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          {children}
        </div>
      </div>
    </UserProvider>
  );
}
