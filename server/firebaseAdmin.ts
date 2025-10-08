import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "zoonigia-web",
  // For local development, we'll use the default credentials
  // In production, you should use a service account key
};

let adminApp;
if (getApps().length === 0) {
  adminApp = initializeApp(firebaseAdminConfig);
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export default adminApp;
