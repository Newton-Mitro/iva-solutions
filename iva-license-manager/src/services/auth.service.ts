import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { app, auth, db } from "../config/firebase";

export type UserRole = "Admin" | "Client";

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function login(email: string, password: string) {
  return (await signInWithEmailAndPassword(auth, email, password)).user;
}

export async function createAccount({
  email,
  password,
  user_name,
  phone,
  role,
}: {
  email: string;
  password: string;
  user_name: string;
  phone: string;
  role: UserRole;
}) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

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
}

export async function logout() {
  await signOut(auth);
}
