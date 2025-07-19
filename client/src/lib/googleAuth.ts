import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  if (!auth) {
    alert('Firebase configuration is required for authentication. Please configure Firebase first.');
    return Promise.resolve();
  }
  return signInWithRedirect(auth, provider);
}

export function signOutUser() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export function handleRedirectResult() {
  if (!auth) return Promise.resolve(null);
  return getRedirectResult(auth);
}

export function onAuthChanged(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}