'use client';

import React from 'react';
import { useUserContext } from '@zealthy-app/context/UserContext';

export default function DynamicProgressBar() {
  const { currentStep, totalSteps } = useUserContext();

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
}
