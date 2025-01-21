import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getUserFromToken } from '@zealthy-app/utils/authTools';
import './globals.css';
import Link from 'next/link';
import { SignOutButton } from '@zealthy-app/components/SignOutButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromToken();
  const userEmail = !user ? '' : user.email;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navigation Bar */}
        <header className="bg-blue-600 text-white p-4">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Replace "My App" with your SVG */}
            <Link href="/" aria-label="Zealthy Logo" className="flex items-center">
              <svg
                width="117"
                height="15"
                viewBox="0 0 117 15"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white" // Ensures the logo matches your navbar style
                fill="currentColor"
              >
                <path d="M1.10352 0.683594H13.623V3.54492L5.5957 11.9238H13.916V15H0.332031V12.0312L8.27148 3.74023H1.10352V0.683594ZM17.9082 0.683594H29.7637V3.74023H22.3418V6.01562H29.2266V8.93555H22.3418V11.7578H29.9785V15H17.9082V0.683594ZM43.1797 12.6367H38.1406L37.4473 15H32.9258L38.3066 0.683594H43.1309L48.5117 15H43.8828L43.1797 12.6367ZM42.252 9.54102L40.6699 4.39453L39.0977 9.54102H42.252ZM51.9375 0.683594H56.3613V11.4746H63.2656V15H51.9375V0.683594ZM66.2715 0.683594H79.7188V4.21875H75.207V15H70.7832V4.21875H66.2715V0.683594ZM83.75 0.683594H88.1738V5.69336H93.0078V0.683594H97.4512V15H93.0078V9.20898H88.1738V15H83.75V0.683594ZM100.945 0.683594H105.857L108.748 5.51758L111.639 0.683594H116.521L110.955 9.00391V15H106.521V9.00391L100.945 0.683594Z" />
              </svg>
            </Link>
            <div>
              {/* Navigation links */}
              {userEmail ? (
                <>
                  <span className="mr-4">{userEmail}</span>
                  <SignOutButton className="bg-red-500 text-white px-4 py-2 rounded-md">Sign Out</SignOutButton>
                </>
              ) : (
                <Link href="/signin" className="bg-white text-blue-600 px-4 py-2 rounded-md">
                  Sign In
                </Link>
              )}
              <Link href="/admin" className="bg-green-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-green-600">
                Admin
              </Link>
              <Link href="/data" className="bg-purple-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-purple-600">
                Data
              </Link>
            </div>
          </nav>
        </header>
        <main className="min-h-screen bg-gray-100">{children}</main>
      </body>
    </html>
  );
}
