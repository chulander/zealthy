'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import StepAboutMe from './StepAboutMe';
import StepAddress from './StepAddress';
import StepBirthdate from './StepBirthDate';
import { completeStep } from '@zealthy-app/actions/onboarding';
import { useUserContext } from '@zealthy-app/context/UserContext';
import { getWorkflowStepDetails } from '@zealthy-app/utils/userWorkFlowTools';

// interface OnboardingStepsProps {
//   currentStep: number;
//   userId: string;
//   components: string; // Comma-separated string of component names
//   workflowId: string; // Workflow ID associated with the user
// }

export function OnboardingSteps() {
  const { userId, currentStep, components, workflowId, updateCompletedSteps, updateCurrentStep } = useUserContext();
  const router = useRouter();
  const [step, setStep] = useState(currentStep); // Start at the current step
  const [formData, setFormData] = useState({
    aboutMe: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    birthdate: '',
  });
  const [error, setError] = useState<string | null>(null); // Track errors
  const [steps, setSteps] = useState<React.JSX.Element[]>([]); // Track steps dynamically

  const handleNext = useCallback(
    async (data: Partial<typeof formData>, componentType: string) => {
      try {
        // Update formData and proceed to the next step
        setFormData((prev) => ({ ...prev, ...data }));

        // Prepare component-specific data for the server action
        const componentData = data;

        console.log('Submitting data:', {
          userId,
          step,
          workflowId,
          componentType,
          componentData,
        });
        // Mark the step as completed using a server action
        await completeStep(userId, step, workflowId, componentType, componentData);

        const workflowDetails = await getWorkflowStepDetails(userId);
        if (workflowDetails) {
          const { currentStep: newCurrentStep, completedSteps: newCompletedStep } = workflowDetails;
          updateCurrentStep(newCurrentStep);
          updateCompletedSteps(newCompletedStep);
        }
        if (step === steps.length) {
          // Redirect to the complete page if all steps are finished
          router.push('/signup/complete');
        } else {
          setStep((prev) => prev + 1);
        }

        setError(null); // Clear any errors
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error completing step:', err.message);
        } else {
          console.error('Error completing step:', err);
        }
        setError('Failed to complete the step. Please try again.');
      }
    },
    [userId, step, steps.length, router, workflowId, updateCurrentStep, updateCompletedSteps],
  );

  // Map components to React elements
  const componentMap: Record<string, React.JSX.Element> = useMemo(
    () => ({
      about_me: (
        <StepAboutMe
          key="step_about_me"
          onNext={(data) => handleNext(data, 'about_me')}
          defaultValue={formData.aboutMe}
        />
      ),
      address: (
        <StepAddress
          key="step_address"
          onNext={(data) => handleNext(data, 'address')}
          defaultValue={{
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          }}
        />
      ),
      birthdate: (
        <StepBirthdate
          key="step_birthdate"
          onNext={(data) => handleNext(data, 'birthdate')}
          defaultValue={formData.birthdate}
        />
      ),
    }),
    [formData.aboutMe, formData.street, formData.city, formData.state, formData.zip, formData.birthdate, handleNext],
  );

  useEffect(() => {
    // Dynamically build steps based on the `components` prop
    if (!components) return;
    const parsedSteps = components
      .split(',')
      .map((component) => componentMap[component])
      .filter(Boolean); // Ensure valid components
    setSteps(parsedSteps);
  }, [components, componentMap]);

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 border rounded-md shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error messages */}
      {steps[step - 1]} {/* Render the current step based on the index */}
    </div>
  );
}
