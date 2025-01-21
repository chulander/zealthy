'use client';
import { useActionState } from 'react';
import { signinUser } from '@zealthy-app/actions/auth';
import { Input } from '@zealthy-app//components/ui/input';
import { SubmitButton } from '@zealthy-app/components/SubmitButton';
import Link from 'next/link';

export function SignInForm() {
  const [formState, action, isPending] = useActionState(signinUser, null);

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form action={action}>
        <Input autoComplete="username" type="email" name="email" placeholder="Email" className="mb-4" required />
        <Input
          autoComplete="current-password"
          type="password"
          name="password"
          placeholder="Password"
          className="mb-4"
          required
        />
        <SubmitButton type="submit" className="w-full" isLoading={isPending}>
          Sign In
        </SubmitButton>
        <div className="mt-4">
          <Link href="/signup" className="text-blue-600 hover:underline">{`Don't have an account?`}</Link>
        </div>
        {formState?.message && <p className="mt-4 text-red-500">{formState.message}</p>}
      </form>
    </div>
  );
}
