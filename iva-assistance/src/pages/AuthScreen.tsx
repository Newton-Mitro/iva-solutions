import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { configureAuth, signIn, signUp } from "../firebase/auth";
import { firebaseConfigured } from "../firebase/config";

type AuthScreenProps = {
  initialMode?: "signin" | "signup";
  onBack?: () => void;
  onModeChange?: (mode: "signin" | "signup") => void;
};

export default function AuthScreen({
  initialMode = "signin",
  onBack,
  onModeChange,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function authErrorMessage(authError: unknown) {
    if (authError && typeof authError === "object" && "code" in authError) {
      const code = String(authError.code);
      if (code === "auth/network-request-failed")
        return "Firebase cannot be reached. Check your internet connection and API key restrictions.";
      if (code === "auth/operation-not-allowed")
        return "Email/password sign-in is disabled in Firebase Console.";
      if (code === "auth/invalid-api-key" || code === "auth/invalid-credential")
        return "Firebase credentials are invalid. Check the VITE_FIREBASE_* values.";
    }
    return authError instanceof Error
      ? authError.message
      : "Unable to authenticate.";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await configureAuth();
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp({
          email,
          password,
          user_name: userName,
          phone,
          role: "Client",
        });
      }
    } catch (authError) {
      setError(authErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  if (!firebaseConfigured)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6">
        <section className="w-full max-w-sm rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src="/icons/icon48.png"
                alt="Indian Visa Assistance"
                className="h-10 w-10"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--app-text)]">
                ইন্ডিয়ান ভিসা অ্যাসিস্ট্যান্স
              </p>
              <p className="text-[11px] text-[var(--app-text-muted)]">
                Firebase সংযোগ প্রয়োজন
              </p>
            </div>
          </div>
          <h1 className="text-xl font-bold text-[var(--app-text)]">
            আপনার project সংযুক্ত করুন
          </h1>
          <p className="mt-2 text-xs leading-5 text-[var(--app-text-secondary)]">
            সাইন ইন করার আগে <strong>.env.example</strong> কপি করে
            <strong>.env</strong> ফাইলে Firebase Web app-এর তথ্য দিন।
          </p>
        </section>
      </main>
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img
              src="/icons/icon48.png"
              alt="Indian Visa Assistance"
              className="h-10 w-10"
            />
          </div>
          <div>
            <p className="text-sm font-bold">ইন্ডিয়ান ভিসা অ্যাসিস্ট্যান্স</p>
            <p className="text-[11px] ivac-text-muted">
              নিরাপদ automation console
            </p>
          </div>
        </div>
        <h1 className="text-xl font-bold">
          {mode === "signin" ? "আবার স্বাগতম" : "আপনার account খুলুন"}
        </h1>
        <p className="mt-1 text-xs ivac-text-secondary">
          {mode === "signin"
            ? "আপনার আবেদন ও workflow দেখতে সাইন ইন করুন।"
            : "আপনার records আপনার account-এই আলাদা থাকবে।"}
        </p>
        {mode === "signup" && (
          <>
            <label className="mt-6 block text-[11px] font-semibold">
              নাম
              <input
                className="ivac-input mt-1"
                type="text"
                required
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="আপনার পুরো নাম"
              />
            </label>
            <label className="mt-3 block text-[11px] font-semibold">
              ফোন
              <input
                className="ivac-input mt-1"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+৮৮০..."
              />
            </label>
          </>
        )}
        <label
          className={
            mode === "signup"
              ? "mt-3 block text-[11px] font-semibold"
              : "mt-6 block text-[11px] font-semibold"
          }
        >
          ইমেইল
          <input
            className="ivac-input mt-1"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="mt-3 block text-[11px] font-semibold">
          পাসওয়ার্ড
          <input
            className="ivac-input mt-1"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="কমপক্ষে ৬টি অক্ষর"
          />
        </label>
        {error && (
          <p className="mt-3 rounded-lg ivac-danger-bg p-2 text-[11px] ivac-danger">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-(--app-primary) px-3 py-2.5 text-xs font-bold text-white hover:bg-(--app-primary-hover) disabled:opacity-60"
        >
          {busy
            ? "Please wait..."
            : mode === "signin"
              ? "সাইন ইন"
              : "account খুলুন"}
        </button>
        <button
          type="button"
          onClick={() => {
            const nextMode = mode === "signin" ? "signup" : "signin";
            setMode(nextMode);
            onModeChange?.(nextMode);
            setError("");
          }}
          className="mt-4 w-full text-center text-[11px] font-semibold text-(--app-primary)"
        >
          {mode === "signin"
            ? "নতুন account খুলুন"
            : "আগেই account আছে? সাইন ইন করুন"}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-3 w-full text-center text-[11px] font-semibold ivac-text-muted"
          >
            overview-এ ফিরুন
          </button>
        )}
      </form>
    </main>
  );
}
