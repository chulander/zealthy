'use client';
import { Button, ButtonProps } from '@zealthy-app/components/ui/button'; // Import the ShadCN Button
import { Loader2 } from 'lucide-react'; // ShadCN uses Lucide icons
import React from 'react';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean; // Add loading state support
}

export const SignOutButton: React.FC<LoadingButtonProps> = ({ isLoading, children, className, ...props }) => {
  const handleSignOut = () => {
    // Clear cookies by setting their expiration date to the past
    document.cookie = 'id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/signin'; // Redirect to sign-in page
  };
  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled} // Disable button while loading
      className={`relative ${className}`} // Allow passing custom classes
      onClick={handleSignOut}
    >
      {isLoading && <Loader2 className="absolute left-4 h-4 w-4 animate-spin" aria-hidden="true" />}
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'}`}>{children}</span>
    </Button>
  );
};
