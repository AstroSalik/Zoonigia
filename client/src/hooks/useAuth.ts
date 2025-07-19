import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChanged, handleRedirectResult } from '@/lib/googleAuth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result from Google OAuth
    handleRedirectResult()
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Auth redirect error:', error);
      });

    // Listen for auth state changes
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}