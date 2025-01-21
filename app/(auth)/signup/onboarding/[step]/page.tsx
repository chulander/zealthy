'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserContext } from '@zealthy-app/context/UserContext';
import { OnboardingSteps } from '@zealthy-app/components/OnboardingSteps';

export default function OnboardingStepPage() {
  const { currentStep, totalSteps, completedSteps, userId, components, workflowId } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract the step from the current pathname
    const match = pathname.match(/\/signup\/onboarding\/(\d+)/);
    const requestedStep = match ? parseInt(match[1], 10) : null;

    // Redirect logic
    if (completedSteps >= totalSteps) {
      // If the user has completed all steps, redirect to the complete page
      console.log('User has completed all steps. Redirecting to /signup/complete.');
      router.replace(`/signup/complete`);
    } else if (requestedStep !== currentStep) {
      // If the requested step doesn't match the current step, redirect to the correct step
      console.log(`Redirecting to the correct step: ${currentStep}`);
      router.replace(`/signup/onboarding/${currentStep}`);
    }
  }, [pathname, currentStep, totalSteps, completedSteps, router]);

  // Prevent rendering anything if the user is being redirected
  if (completedSteps >= totalSteps) {
    return null;
  }

  return (
    <div>
      <OnboardingSteps userId={userId} components={components} workflowId={workflowId} currentStep={currentStep} />
    </div>
  );
}
