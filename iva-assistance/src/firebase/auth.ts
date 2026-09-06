import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  onIdTokenChanged,
  reauthenticateWithCredential,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const user = auth.currentUser;
  if (!user?.email) throw new Error("No signed-in email/password account.");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
export const signOutUser = () => signOut(auth);
export const subscribeToAuth = (listener: (user: User | null) => void) =>
  onIdTokenChanged(auth, listener);
