import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
// IMPORTANT: Firebase project is "zoonigia-web" (not "zoonigia-platform")
const firebaseAdminConfig: any = {
  projectId: "zoonigia-web", // Always use zoonigia-web
  // For local development, we'll use the default credentials (Application Default Credentials)
  // In production, you should use a service account key from zoonigia-web project
};

// Only use service account credentials if they're properly provided
// Otherwise, use Application Default Credentials (ADC) which works for local development
try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  // Only use service account if both are provided and private key looks valid
  if (privateKey && clientEmail && privateKey.includes('-----BEGIN')) {
    firebaseAdminConfig.credential = cert({
      projectId: "zoonigia-web",
      privateKey: privateKey.replace(/\\n/g, '\n'),
      clientEmail: clientEmail,
    });
    console.log('✅ Using service account credentials for Firebase Admin');
  } else {
    console.log('ℹ️  Using Application Default Credentials (ADC) for Firebase Admin');
  }
} catch (error) {
  console.warn('⚠️  Could not initialize service account credentials, using ADC:', error);
  // Continue with default credentials
}

let adminApp;
if (getApps().length === 0) {
  adminApp = initializeApp(firebaseAdminConfig);
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export default adminApp;
