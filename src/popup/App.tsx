import { useEffect, useState } from "react";
import { subscribeToAuth } from "../firebase/auth";
import AuthScreen from "./pages/AuthScreen";
import type { User as FirebaseUser } from "firebase/auth";
import { Dashboard } from "./pages/dashboard/Dashboard";

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
