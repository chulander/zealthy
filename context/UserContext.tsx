'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface UserContextType {
  userId: string;
  email: string;
  workflowId: string;
  currentStep: number;
  updateCurrentStep: (step: number) => void; // Function to update the step
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
  value: Omit<UserContextType, 'updateCurrentStep'>; // The initial value won't include the update function
}) => {
  console.log('context value', value);
  const [currentStep, setCurrentStep] = useState(value.currentStep);

  const updateCurrentStep = useCallback((step: number) => {
    setCurrentStep(step); // Dynamically update the current step
  }, []);

  return <UserContext.Provider value={{ ...value, currentStep, updateCurrentStep }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
