'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useState } from 'react';

interface LoginButtonProps {
  provider?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LoginButton({
  provider = 'credentials',
  children,
  className
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogin} disabled={isLoading} className={className}>
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children || 'Sign in'}
    </Button>
  );
}
