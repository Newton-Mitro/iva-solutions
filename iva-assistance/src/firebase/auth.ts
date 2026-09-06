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
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseApp } from "./config";
import { db } from "./firestore";

export type UserRole = "Admin" | "Client";

export type CreateUserProfileInput = {
  email: string;
  password: string;
  user_name: string;
  phone: string;
  role?: UserRole;
};

export const auth = getAuth(firebaseApp);
export const configureAuth = () =>
  setPersistence(auth, browserLocalPersistence);
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const signUp = async ({
  email,
  password,
  user_name,
  phone,
  role = "Client",
}: CreateUserProfileInput) => {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const { user } = credentials;

  await updateProfile(user, { displayName: user_name });
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      user_name,
      email,
      phone,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return user;
};
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
