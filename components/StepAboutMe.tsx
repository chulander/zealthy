'use client';

import React from 'react';
import { Textarea } from '@zealthy-app/components/ui/textarea';
import { SubmitButton } from '@zealthy-app/components/SubmitButton';

interface StepAboutMeProps {
  onNext: (data: { aboutMe: string }) => void;
  defaultValue?: string;
}

const StepAboutMe: React.FC<StepAboutMeProps> = ({ onNext, defaultValue }) => {
  const [aboutMe, setAboutMe] = React.useState(defaultValue || '');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ aboutMe });
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="text-xl font-bold mb-4">Tell us about yourself</h2>
      <Textarea
        name="aboutMe"
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        placeholder="Write something about yourself..."
        className="w-full border rounded-md p-2"
        rows={5}
        required
      />
      <SubmitButton type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
        Next
      </SubmitButton>
    </form>
  );
};

export default StepAboutMe;
