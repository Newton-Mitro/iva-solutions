import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  KeyRound,
  LogOut,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Zap,
} from "lucide-react";

import LicenseActivation from "../dashboard/components/LicenseActivation";
import { changePassword, signOutUser } from "../../firebase/auth";

type Settings = {
  confirmBeforePayment: boolean;
  pauseOnVerification: boolean;
};

const defaultSettings: Settings = {
  confirmBeforePayment: true,
  pauseOnVerification: true,
};

function readSettings(): Settings {
  try {
    const stored = localStorage.getItem("ivac-settings");

    return stored
      ? { ...defaultSettings, ...JSON.parse(stored) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

/* -------------------------------------------------------------------------- */
/* Toggle                                                                      */
/* -------------------------------------------------------------------------- */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative flex h-[20px] w-[36px] shrink-0
        items-center rounded-full
        border p-[2px]
        transition-colors duration-200
        focus:outline-none
        focus:ring-2 focus:ring-blue-500/20
        ${
          checked
            ? "border-blue-600 bg-blue-600"
            : "border-(--app-border) bg-(--app-surface-3)"
        }
      `}
    >
      <span
        className={`
          h-[14px] w-[14px]
          rounded-full
          bg-white
          shadow-sm
          transition-transform duration-200
          ${checked ? "translate-x-[16px]" : "translate-x-0"}
        `}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Section Header                                                              */
/* -------------------------------------------------------------------------- */

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-2.5 flex items-start gap-2">
      <div className="ivac-primary-bg ivac-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
        <Icon size={12} />
      </div>

      <div className="min-w-0">
        <h2 className="text-[11px] font-bold leading-tight">{title}</h2>

        {description && (
          <p className="mt-0.5 text-[8px] leading-tight ivac-text-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Setting Row                                                                 */
/* -------------------------------------------------------------------------- */

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className="
        flex items-center gap-3
        border-b border-(--app-border-light)
        py-2.5
        last:border-b-0
      "
    >
      <div
        className={`
          flex h-7 w-7 shrink-0 items-center justify-center
          rounded-md text-[9px] font-bold
          ${
            checked
              ? "bg-blue-500/10 text-blue-500"
              : "ivac-surface-3 ivac-text-muted"
          }
        `}
      >
        {checked ? <Check size={12} /> : <span>—</span>}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold leading-tight">{title}</p>

        <p className="mt-0.5 text-[8px] leading-3.5 ivac-text-muted">
          {description}
        </p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Row                                                                  */
/* -------------------------------------------------------------------------- */

function StatusRow({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[9px] ivac-text-muted">{label}</span>

      <span
        className={`
          flex items-center gap-1
          text-[8px] font-semibold
          ${ready ? "text-emerald-500" : "text-red-500"}
        `}
      >
        <span
          className={`
            h-1.5 w-1.5 rounded-full
            ${ready ? "bg-emerald-500" : "bg-red-500"}
          `}
        />

        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function SettingsPage({
  email,
  userId,
  onBack,
  onLicenseDeactivated,
}: {
  email: string | null;
  userId: string;
  onBack: () => void;
  onLicenseDeactivated: () => void;
}) {
  const [settings, setSettings] = useState<Settings>(readSettings);
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordState, setPasswordState] = useState({
    busy: false,
    message: "",
    error: "",
  });

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSaved(false);

    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("ivac-settings", JSON.stringify(settings));

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const automationConfigured =
    settings.pauseOnVerification && settings.confirmBeforePayment;

  const updatePasswordField = (
    field: keyof typeof passwordForm,
    value: string,
  ) => {
    setPasswordState({ busy: false, message: "", error: "" });
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  const submitPasswordChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const { current, next, confirm } = passwordForm;

    if (next.length < 6) {
      setPasswordState({
        busy: false,
        message: "",
        error: "Password must be at least 6 characters.",
      });
      return;
    }
    if (next !== confirm) {
      setPasswordState({
        busy: false,
        message: "",
        error: "New passwords do not match.",
      });
      return;
    }

    setPasswordState({ busy: true, message: "", error: "" });
    try {
      await changePassword(current, next);
      setPasswordForm({ current: "", next: "", confirm: "" });
      setPasswordState({
        busy: false,
        message: "Password changed successfully.",
        error: "",
      });
    } catch (changeError) {
      const code =
        changeError && typeof changeError === "object" && "code" in changeError
          ? String(changeError.code)
          : "";
      const error =
        code === "auth/wrong-password" || code === "auth/invalid-credential"
          ? "Current password is incorrect."
          : code === "auth/requires-recent-login"
            ? "For security, sign out and sign in again before changing your password."
            : changeError instanceof Error
              ? changeError.message
              : "Unable to change password.";
      setPasswordState({ busy: false, message: "", error });
    }
  };

  return (
    <div className="ivac-app min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header
        className="
          sticky top-0 z-40
          border-b border-(--app-border)
          bg-(--app-surface)/95
          backdrop-blur
        "
      >
        <div className="flex h-13 items-center gap-2.5 px-3.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            className="
              ivac-hover
              flex h-7 w-7
              items-center justify-center
              rounded-lg
              ivac-text-muted
            "
          >
            <ArrowLeft size={15} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-[12px] font-bold leading-tight">Settings</h1>

            <p className="mt-0.5 text-[8px] ivac-text-muted">
              Automation workspace configuration
            </p>
          </div>

          {/* Configuration indicator */}
          <div
            className={`
              flex items-center gap-1.5
              rounded-md px-2 py-1
              text-[7px] font-bold uppercase tracking-wide
              ${
                automationConfigured
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-500"
              }
            `}
          >
            <span
              className={`
                h-1.5 w-1.5 rounded-full
                ${automationConfigured ? "bg-emerald-500" : "bg-amber-500"}
              `}
            />

            {automationConfigured ? "Configured" : "Review"}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main                                                               */}
      {/* ------------------------------------------------------------------ */}

      <main
        className="
          mx-auto w-full max-w-xl
          space-y-5
          px-3.5
          pb-8
          pt-4
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/* Workspace                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <SectionTitle
            icon={UserRound}
            title="Workspace"
            description="Current automation account"
          />

          <div
            className="
              ivac-card
              flex items-center gap-3
              rounded-xl
              border border-(--app-border)
              p-3
            "
          >
            <div
              className="
                ivac-primary-bg ivac-primary
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
              "
            >
              <UserRound size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold">
                {email || "Signed-in account"}
              </p>

              <p className="mt-0.5 truncate text-[8px] ivac-text-muted">
                Indian Visa Assistance automation workspace
              </p>
            </div>

            <ChevronRight size={13} className="shrink-0 ivac-text-muted" />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Account security                                                  */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <SectionTitle
            icon={KeyRound}
            title="Change password"
            description="Update your Firebase sign-in password"
          />

          <form
            onSubmit={(event) => void submitPasswordChange(event)}
            className="ivac-card space-y-2 rounded-xl border border-(--app-border) p-3"
          >
            <input
              className="ivac-input"
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              value={passwordForm.current}
              onChange={(event) =>
                updatePasswordField("current", event.target.value)
              }
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                className="ivac-input"
                type="password"
                autoComplete="new-password"
                placeholder="New password"
                value={passwordForm.next}
                onChange={(event) =>
                  updatePasswordField("next", event.target.value)
                }
                minLength={6}
                required
              />
              <input
                className="ivac-input"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm password"
                value={passwordForm.confirm}
                onChange={(event) =>
                  updatePasswordField("confirm", event.target.value)
                }
                minLength={6}
                required
              />
            </div>

            {(passwordState.error || passwordState.message) && (
              <p
                className={`text-[9px] ${passwordState.error ? "ivac-danger" : "text-emerald-500"}`}
              >
                {passwordState.error || passwordState.message}
              </p>
            )}

            <button
              type="submit"
              disabled={passwordState.busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-[10px] font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              <KeyRound size={12} />
              {passwordState.busy ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* License                                                          */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <SectionTitle
            icon={ShieldCheck}
            title="License"
            description="Manage your automation license"
          />

          <LicenseActivation
            userId={userId}
            onDeactivated={onLicenseDeactivated}
          />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Automation                                                       */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <SectionTitle
            icon={Zap}
            title="Automation"
            description="Control how the IVAC workflow behaves"
          />

          <div
            className="
              ivac-card
              rounded-xl
              border border-(--app-border)
              px-3
            "
          >
            <SettingToggle
              title="Pause on human verification"
              description="Automatically stop when a verification or CAPTCHA step requires manual action."
              checked={settings.pauseOnVerification}
              onChange={(value) => update("pauseOnVerification", value)}
            />

            <SettingToggle
              title="Confirm before payment"
              description="Pause the workflow before submitting an appointment payment."
              checked={settings.confirmBeforePayment}
              onChange={(value) => update("confirmBeforePayment", value)}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Automation Status                                                */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <SectionTitle
            icon={SlidersHorizontal}
            title="Automation status"
            description="Current workflow safeguards"
          />

          <div
            className="
              ivac-surface-2
              rounded-xl
              border border-(--app-border)
              px-3 py-2
            "
          >
            <StatusRow
              label="Human verification protection"
              value={settings.pauseOnVerification ? "Enabled" : "Disabled"}
              ready={settings.pauseOnVerification}
            />

            <StatusRow
              label="Payment confirmation"
              value={settings.confirmBeforePayment ? "Required" : "Automatic"}
              ready={settings.confirmBeforePayment}
            />

            <div className="mt-1 border-t border-(--app-border-light) pt-1">
              <StatusRow
                label="Automation safety"
                value={automationConfigured ? "Protected" : "Review settings"}
                ready={automationConfigured}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Actions                                                          */}
        {/* ---------------------------------------------------------------- */}

        <section className="space-y-2">
          <button
            type="button"
            onClick={saveSettings}
            className={`
              flex w-full
              items-center justify-center gap-2
              rounded-lg
              py-2.5
              text-[10px]
              font-bold
              text-white
              transition-all duration-200
              ${saved ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {saved ? <Check size={13} /> : <Save size={13} />}

            {saved ? "Settings saved" : "Save settings"}
          </button>

          <button
            type="button"
            onClick={() => void signOutUser()}
            className="
              flex w-full
              items-center justify-center gap-2
              rounded-lg
              border border-red-500/20
              bg-red-500/[0.03]
              py-2.5
              text-[10px]
              font-bold
              text-red-500
              transition-colors
              hover:bg-red-500/[0.07]
            "
          >
            <LogOut size={13} />
            Sign out
          </button>
        </section>

        {/* Footer */}
        <p className="pt-1 text-center text-[7px] ivac-text-muted">
          IVAC Automation · Workspace preferences
        </p>
      </main>
    </div>
  );
}
