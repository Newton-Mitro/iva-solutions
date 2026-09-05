import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onIdTokenChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseApp } from "./config";

export const auth = getAuth(firebaseApp);
export const configureAuth = () =>
  setPersistence(auth, browserLocalPersistence);
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);
export const subscribeToAuth = (listener: (user: User | null) => void) =>
  onIdTokenChanged(auth, listener);
