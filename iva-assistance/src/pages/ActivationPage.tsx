import type { User as FirebaseUser } from "firebase/auth";
import { LogOut } from "lucide-react";
import LicenseActivation from "./dashboard/components/LicenseActivation";
import { LicenseRecord } from "../firebase/license";
import { signOutUser } from "../firebase/auth";

export default function ActivationPage({
  user,
  onActivated,
}: {
  user: FirebaseUser;
  onActivated: (license: LicenseRecord) => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6 text-[var(--app-text)]">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <img
            src="/icons/icon48.png"
            alt="Indian Visa Assistance"
            className="mx-auto h-12 w-12"
          />
          <h1 className="mt-3 text-xl font-bold text-[var(--app-text)]">
            Activate your workspace
          </h1>
          <p className="mt-1 text-xs text-[var(--app-text-secondary)]">
            A valid license is required before you can manage applications.
          </p>
        </div>
        <LicenseActivation userId={user.uid} onActivated={onActivated} />
        <button
          type="button"
          onClick={() => void signOutUser()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2.5 text-xs font-semibold text-[var(--app-text-secondary)] transition hover:bg-[var(--app-surface-2)] dark:border-slate-700"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </main>
  );
}
