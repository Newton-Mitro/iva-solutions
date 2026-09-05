import { useEffect, useState } from "react";
import { subscribeToAuth } from "./firebase/auth";
import { getLicense, type LicenseRecord } from "./firebase/license";
import AuthScreen from "./pages/AuthScreen";
import type { User as FirebaseUser } from "firebase/auth";
import { Dashboard } from "./pages/dashboard/Dashboard";
import ActivationPage from "./pages/ActivationPage";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);
  const [license, setLicense] = useState<LicenseRecord | null | undefined>(
    undefined,
  );

  useEffect(() => subscribeToAuth(setUser), []);

  useEffect(() => {
    if (!user) {
      setLicense(null);
      return;
    }

    setLicense(undefined);
    void getLicense(user.uid)
      .then(setLicense)
      .catch(() => setLicense(null));
  }, [user]);

  if (user === undefined || (user && license === undefined)) {
    return (
      <main className="flex min-h-screen items-center justify-center text-xs ivac-text-muted">
        Loading workspace...
      </main>
    );
  }

  return user ? (
    license ? (
      <Dashboard user={user} onLicenseDeactivated={() => setLicense(null)} />
    ) : (
      <ActivationPage user={user} onActivated={setLicense} />
    )
  ) : (
    <AuthScreen />
  );
}
