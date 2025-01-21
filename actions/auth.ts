'use server';
import { cookies } from 'next/headers';
import { signup, signin } from '@zealthy-app/utils/authTools';
import { z } from 'zod';
import { redirect } from 'next/navigation';
const accessTokenName = 'access_token';
const idTokenName = 'id_token';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signupUser = async (prevState: any, formData: FormData) => {
  const cookieStore = await cookies();
  const data = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  try {
    const { access_token, id_token } = await signup(data);
    cookieStore.set(accessTokenName, access_token);
    cookieStore.set(idTokenName, id_token);
  } catch (e) {
    console.error(e);

    if (e instanceof Error && 'code' in e && e.code === 'SQLITE_CONSTRAINT') {
      return { message: 'email already exists' };
    }
    return { message: 'Failed to sign you up' };
  }
  redirect(`/signup/onboarding/1`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signinUser = async (prevState: any, formData: FormData) => {
  let onboardingStep: number = 1;
  let isOnboardingComplete: boolean = false;
  const cookieStore = await cookies();
  const data = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  try {
    const { access_token, id_token, currentStep, isComplete } = await signin(data);
    onboardingStep = currentStep;
    isOnboardingComplete = isComplete;
    cookieStore.set(accessTokenName, access_token);
    cookieStore.set(idTokenName, id_token);
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return { message: e.message };
    }
    return { message: 'Failed to sign you in' };
  }
  if (isOnboardingComplete) {
    redirect('/signup/complete');
  } else {
    redirect(`/signup/onboarding/${onboardingStep}`);
  }
};
