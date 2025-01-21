'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DynamicStepTrackerProps {
  currentStep: number;
  totalSteps: number;
}

export default function DynamicStepTracker({ currentStep, totalSteps }: DynamicStepTrackerProps) {
  const [dynamicStep, setDynamicStep] = useState(currentStep); // Start with the initial step from server
  const pathname = usePathname();

  useEffect(() => {
    const stepFromUrl = parseInt(pathname.split('/').pop() || '0', 10); // Extract step from URL
    if (stepFromUrl && stepFromUrl !== dynamicStep) {
      setDynamicStep(stepFromUrl); // Update the step dynamically
    }
  }, [pathname, dynamicStep]);

  return (
    <p className="text-gray-500">
      Step {dynamicStep} of {totalSteps}
    </p>
  );
}
