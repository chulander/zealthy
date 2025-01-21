'use client';

import React from 'react';
import { Input } from '@zealthy-app/components/ui/input';
import { SubmitButton } from '@zealthy-app/components/SubmitButton';

interface StepBirthdateProps {
  onNext: (data: { birthdate: string }) => void;
  defaultValue?: string;
}

const StepBirthdate: React.FC<StepBirthdateProps> = ({ onNext, defaultValue }) => {
  const [birthdate, setBirthdate] = React.useState(defaultValue || '');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ birthdate });
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="text-xl font-bold mb-4">Enter your birthdate</h2>
      <Input type="date" name="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
      <SubmitButton type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
        Next
      </SubmitButton>
    </form>
  );
};

export default StepBirthdate;
