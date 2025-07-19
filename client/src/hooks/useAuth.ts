import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@shared/schema';
import { onAuthChanged } from '@/lib/googleAuth';

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChanged(async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          // Sync user to database
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          });

          // Try to fetch user by email first (for existing users)
          let response = await fetch(`/api/auth/user-by-email/${encodeURIComponent(user.email!)}`);
          if (response.ok) {
            const dbUserData = await response.json();
            setDbUser(dbUserData);
          } else {
            // Fallback to Firebase UID
            response = await fetch(`/api/auth/user/${user.uid}`);
            if (response.ok) {
              const dbUserData = await response.json();
              setDbUser(dbUserData);
            }
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      } else {
        setDbUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user: dbUser,
    firebaseUser,
    isLoading,
    isAuthenticated: !!firebaseUser,
  };
}