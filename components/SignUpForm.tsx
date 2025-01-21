'use client';
import React, { useState } from 'react';
import { useActionState } from 'react';
import { signupUser } from '@zealthy-app/actions/auth';
import { Input } from '@zealthy-app/components/ui/input';
import { SubmitButton } from '@zealthy-app/components/SubmitButton';
import Link from 'next/link';

export function SignUpForm() {
  const [formState, action, isPending] = useActionState(signupUser, null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
    } else {
      setErrorMessage('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setErrorMessage('Passwords do not match.');
    } else {
      setErrorMessage('');
    }
  };

  const isFormValid = () => {
    return password === confirmPassword && password.length > 0 && confirmPassword.length > 0;
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form action={action}>
        <Input type="email" name="email" placeholder="Email" className="mb-4" required />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="mb-4"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="mb-4"
          required
        />
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <SubmitButton type="submit" className="w-full" isLoading={isPending} disabled={!isFormValid()}>
          Sign Up
        </SubmitButton>
        <div className="mt-4">
          <Link href="/signin" className="text-blue-600 hover:underline">{`Already have an account?`}</Link>
        </div>
        {formState?.message && <p className="mt-4 text-green-500">{formState.message}</p>}
      </form>
    </div>
  );
}
