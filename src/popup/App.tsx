import { useEffect, useState } from "react";
import { subscribeToAuth } from "../firebase/auth";
import { Dashboard } from "./components/dashboard/Dashboard";
import AuthScreen from "./components/AuthScreen";
import type { User as FirebaseUser } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);

  useEffect(() => subscribeToAuth(setUser), []);

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center text-xs ivac-text-muted">
        Loading workspace...
      </main>
    );
  }

  return user ? <Dashboard user={user} /> : <AuthScreen />;
}
