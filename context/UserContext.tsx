'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface UserContextType {
  userId: string;
  email: string;
  workflowId: string;
  currentStep: number;
  updateCurrentStep: (step: number) => void; // Function to update the step
  updateCompletedSteps: (step: number) => void; // Function to update the step
  components: string;
  completedSteps: number;
  totalSteps: number;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Omit<UserContextType, 'updateCurrentStep' | 'updateCompletedSteps'>; // The initial value won't include the update functions
}) => {
  console.log('context value', value);
  const [currentStep, setCurrentStep] = useState(value.currentStep);
  const [completedSteps, setCompletedSteps] = useState(value.completedSteps);

  const updateCurrentStep = useCallback((step: number) => {
    setCurrentStep(step); // Dynamically update the current step
  }, []);

  const updateCompletedSteps = useCallback((step: number) => {
    setCompletedSteps(step); // Dynamically update the completed steps
  }, []);

  return (
    <UserContext.Provider value={{ ...value, currentStep, updateCurrentStep, completedSteps, updateCompletedSteps }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
