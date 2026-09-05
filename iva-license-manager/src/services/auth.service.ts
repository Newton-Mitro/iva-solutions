import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import { auth } from "../config/firebase";

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function login(email: string, password: string) {
  return (await signInWithEmailAndPassword(auth, email, password)).user;
}

export async function createAccount(email: string, password: string) {
  return (await createUserWithEmailAndPassword(auth, email, password)).user;
}

export async function logout() {
  await signOut(auth);
}