import { useState } from "react";
import type { FormEvent } from "react";
import { configureAuth, signIn, signUp } from "../../firebase/auth";
import { firebaseConfigured } from "../../firebase/config";

export default function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
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
      if (mode === "signin") await signIn(email, password);
      else await signUp(email, password);
    } catch (authError) {
      setError(authErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  if (!firebaseConfigured)
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <section className="ivac-card w-full max-w-sm rounded-2xl p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src="/icons/icon48.png"
                alt="Indian Visa Application Workspace"
                className="h-10 w-10"
              />
            </div>
            <div>
              <p className="text-sm font-bold">
                Indian Visa Application Workspace
              </p>
              <p className="text-[11px] ivac-text-muted">
                Firebase connection required
              </p>
            </div>
          </div>
          <h1 className="text-xl font-bold">Connect your project</h1>
          <p className="mt-2 text-xs leading-5 ivac-text-secondary">
            Copy <strong>.env.example</strong> to <strong>.env</strong> and add
            your Firebase Web app values before signing in.
          </p>
        </section>
      </main>
    );

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="ivac-card w-full max-w-sm rounded-2xl p-6 shadow-sm"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img
              src="/icons/icon48.png"
              alt="Indian Visa Application Workspace"
              className="h-10 w-10"
            />
          </div>
          <div>
            <p className="text-sm font-bold">
              Indian Visa Application Workspace
            </p>
            <p className="text-[11px] ivac-text-muted">
              Secure automation console
            </p>
          </div>
        </div>
        <h1 className="text-xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-xs ivac-text-secondary">
          {mode === "signin"
            ? "Sign in to access your applicants and runs."
            : "Your records stay isolated to your account."}
        </p>
        <label className="mt-6 block text-[11px] font-semibold">
          Email
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
          Password
          <input
            className="ivac-input mt-1"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
          />
        </label>
        {error && (
          <p className="mt-3 rounded-lg ivac-danger-bg p-2 text-[11px] ivac-danger">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {busy
            ? "Please wait..."
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
          className="mt-4 w-full text-center text-[11px] font-semibold text-blue-600"
        >
          {mode === "signin"
            ? "Create a new account"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
