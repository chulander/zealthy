'use client';

import React, { useState } from 'react';
import { Input } from '@zealthy-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@zealthy-app/components/ui/select';
import { Button } from '@zealthy-app/components/ui/button';

export function AdminCreateWorkFlowForm({ onWorkflowCreated }: { onWorkflowCreated: () => void }) {
  const [name, setName] = useState('');
  const [step1, setStep1] = useState('about_me');
  const [step2, setStep2] = useState('address');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      steps: [
        { step: 1, component: step1 },
        { step: 2, component: step2 },
      ],
    };

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Workflow created:', data);

        // Trigger the callback to refresh the latest workflow
        onWorkflowCreated();
      } else {
        console.error('Failed to create workflow:', await res.json());
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="Workflow Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
        required
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Step 1 Component</label>
        <Select value={step1} onValueChange={setStep1}>
          <SelectTrigger>
            <SelectValue placeholder="Select a component" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="about_me">About Me</SelectItem>
            <SelectItem value="address">Address</SelectItem>
            <SelectItem value="birthdate">Birthdate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Step 2 Component</label>
        <Select value={step2} onValueChange={setStep2}>
          <SelectTrigger>
            <SelectValue placeholder="Select a component" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="about_me">About Me</SelectItem>
            <SelectItem value="address">Address</SelectItem>
            <SelectItem value="birthdate">Birthdate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Workflow'}
      </Button>
    </form>
  );
}
