import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CatchAllPage({ params }: { params: { catchAll: string[] } }) {
  const parameters = await params;
  console.log('CatchAllPage parameters:', parameters);

  // Access cookies to check for the `id_token`
  const cookieStore = await cookies();
  const idToken = cookieStore.get('id_token')?.value;

  const attemptedPath = parameters && parameters.catchAll ? parameters.catchAll.join('/') : null;
  if (attemptedPath) {
    console.log(`User tried to access: /${attemptedPath}`);
  }

  if (idToken) {
    // Redirect to onboarding if the user is logged in (has id_token)
    console.log('User is authenticated. Redirecting to onboarding...');
    redirect('/signup/onboarding/1');
  } else {
    // Redirect to signup if no id_token is found
    console.log('No id_token found. Redirecting to signup...');
    redirect('/signup');
  }

  return null; // This is required for TypeScript, but the `redirect` will prevent rendering
}
