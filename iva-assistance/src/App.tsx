import { useEffect, useState } from "react";
import { subscribeToAuth } from "./firebase/auth";
import {
  getLicense,
  isLicenseCheckRequired,
  type LicenseRecord,
} from "./firebase/license";
import AuthScreen from "./pages/AuthScreen";
import type { User as FirebaseUser } from "firebase/auth";
import { Dashboard } from "./pages/dashboard/Dashboard";
import ActivationPage from "./pages/ActivationPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);
  const [license, setLicense] = useState<LicenseRecord | null | undefined>(
    undefined,
  );
  const [licenseCheckRequired, setLicenseCheckRequired] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => subscribeToAuth(setUser), []);

  useEffect(() => {
    if (!user) {
      setLicense(null);
      setLicenseCheckRequired(false);
      return;
    }

    setLicense(undefined);
    setLicenseCheckRequired(undefined);
    void isLicenseCheckRequired()
      .catch(() => true)
      .then((required) => {
        setLicenseCheckRequired(required);
        if (!required) {
          setLicense(null);
          return;
        }
        void getLicense(user.uid)
          .then(setLicense)
          .catch(() => setLicense(null));
      });
  }, [user]);

  if (
    user === undefined ||
    (user &&
      (licenseCheckRequired === undefined ||
        (licenseCheckRequired && license === undefined)))
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] text-xs text-[var(--app-text-muted)]">
        Loading workspace...
      </main>
    );
  }

  return user ? (
    !licenseCheckRequired || license ? (
      <Dashboard user={user} onLicenseDeactivated={() => setLicense(null)} />
    ) : (
      <ActivationPage user={user} onActivated={setLicense} />
    )
  ) : (
    <LandingPage />
  );
}
