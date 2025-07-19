import { auth } from './firebase';

export async function makeAdminRequest(endpoint: string, options: RequestInit = {}) {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  return fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': user.uid,
      ...options.headers,
    },
  });
}