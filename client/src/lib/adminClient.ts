import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Wait for Firebase auth to be ready
export function waitForAuth(): Promise<any> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  });
}

export async function makeAdminRequest(endpoint: string, options: RequestInit = {}) {
  try {
    // Wait for auth to be ready
    const user = await waitForAuth();
    
    return fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user.uid,
        ...options.headers,
      },
    });
  } catch (error) {
    console.error('Admin request failed:', error);
    throw error;
  }
}