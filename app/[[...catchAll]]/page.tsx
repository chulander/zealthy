import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface CatchAllParams {
  params: Promise<{ catchAll?: string[] }>;
}

export default async function CatchAllPage({ params }: CatchAllParams) {
  const { catchAll } = await params;

  // Access cookies to check for the `id_token`
  const cookieStore = await cookies();
  const idToken = cookieStore.get('id_token')?.value;

  // Attempted path reconstruction
  const attemptedPath = catchAll ? catchAll.join('/') : null;
  if (attemptedPath) {
    console.log(`User tried to access: /${attemptedPath}`);
  }

  if (idToken) {
    // Redirect to onboarding if the user is logged in (has id_token)
    console.log('User is authenticated. Redirecting to onboarding...');
    // there is logic on the onboarding page to redirect to the correct step
    redirect('/signup/onboarding/1');
  } else {
    // Redirect to signup if no id_token is found
    console.log('No id_token found. Redirecting to signup...');
    redirect('/signup');
  }

  return null; // This will never be reached due to `redirect`, but is required for TypeScript.
}
