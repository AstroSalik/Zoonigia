import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxqk59Tv-0CdmMhiUeN_qHDNB_5vpWJOA",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "zoonigia-web"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zoonigia-web",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "zoonigia-web"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:729979576138:web:0305b8f640b4469512abb3",
};

if (import.meta.env.DEV) {
  console.log('Firebase config loaded:', {
    hasApiKey: !!firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId
  });
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);