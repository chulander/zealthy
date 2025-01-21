import { Button, ButtonProps } from '@zealthy-app/components/ui/button'; // Import the ShadCN Button
import { Loader2 } from 'lucide-react'; // ShadCN uses Lucide icons
import React from 'react';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean; // Add loading state support
}

export const SubmitButton: React.FC<LoadingButtonProps> = ({ isLoading, children, className, ...props }) => {
  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled} // Disable button while loading
      className={`relative ${className}`} // Allow passing custom classes
    >
      {isLoading && <Loader2 className="absolute left-4 h-4 w-4 animate-spin" aria-hidden="true" />}
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'}`}>{children}</span>
    </Button>
  );
};
