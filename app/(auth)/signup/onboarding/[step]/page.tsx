'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserContext } from '@zealthy-app/context/UserContext';
import { OnboardingSteps } from '@zealthy-app/components/OnboardingSteps';

export default function OnboardingStepPage() {
  const { userId, currentStep, components, workflowId, totalSteps, completedSteps } = useUserContext(); // Ensure totalSteps is available in context
  console.log('currentStep', currentStep);
  console.log('totalSteps', totalSteps);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract the step from the current pathname
    const match = pathname.match(/\/signup\/onboarding\/(\d+)/);
    const requestedStep = match ? parseInt(match[1], 10) : null;

    // Redirect logic
    if (completedSteps === totalSteps) {
      // If the user has completed all steps, redirect to the complete page
      router.replace(`/signup/complete`);
    } else if (requestedStep !== currentStep) {
      // If the requested step doesn't match the current step, push the correct step to the URL
      router.replace(`/signup/onboarding/${currentStep}`);
    }
  }, [pathname, currentStep, totalSteps, router, completedSteps]);

  // If user has completed all steps, avoid rendering anything here since they'll be redirected
  if (currentStep > totalSteps) {
    return null;
  }

  return (
    <div>
      <OnboardingSteps currentStep={currentStep} userId={userId} components={components} workflowId={workflowId} />
    </div>
  );
}
