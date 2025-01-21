'use client';

import React from 'react';
import { Input } from '@zealthy-app/components/ui/input';
import { SubmitButton } from '@zealthy-app/components/SubmitButton';

interface StepAddressProps {
  onNext: (data: { street: string; city: string; state: string; zip: string }) => void;
  defaultValue?: { street: string; city: string; state: string; zip: string };
}

const StepAddress: React.FC<StepAddressProps> = ({ onNext, defaultValue }) => {
  const [address, setAddress] = React.useState(defaultValue || { street: '', city: '', state: '', zip: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(address);
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="text-xl font-bold mb-4">Enter your address</h2>
      <Input
        name="street"
        value={address.street}
        onChange={handleChange}
        placeholder="Street"
        className="mb-2"
        required
      />
      <Input name="city" value={address.city} onChange={handleChange} placeholder="City" className="mb-2" required />
      <Input name="state" value={address.state} onChange={handleChange} placeholder="State" className="mb-2" required />
      <Input name="zip" value={address.zip} onChange={handleChange} placeholder="ZIP Code" className="mb-2" required />
      <SubmitButton type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
        Next
      </SubmitButton>
    </form>
  );
};

export default StepAddress;
