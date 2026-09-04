import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CreditCard,
  Globe2,
  LogOut,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  UserRound,
} from "lucide-react";

import { signOutUser } from "../../../firebase/auth";

type Settings = {
  demoMode: boolean;
  confirmBeforePayment: boolean;
  pauseOnVerification: boolean;
  autoStartWorkflow: boolean;

  mission: string;
  center: string;

  gateway: string;
  currency: string;
  paymentMethod: string;

  // Non-sensitive payment information only.
  cardHolderName: string;
  cardLast4: string;

  bkashAccountName: string;
  bkashLast4: string;

  paymentNotifications: boolean;
  appointmentNotifications: boolean;
};

const defaultSettings: Settings = {
  demoMode: false,
  confirmBeforePayment: true,
  pauseOnVerification: true,
  autoStartWorkflow: false,

  mission: "Bangladesh",
  center: "Dhaka",

  gateway: "IVAC Payment Gateway",
  currency: "BDT",
  paymentMethod: "Card",

  cardHolderName: "",
  cardLast4: "",

  bkashAccountName: "",
  bkashLast4: "",

  paymentNotifications: true,
  appointmentNotifications: true,
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
      aria-label="Toggle setting"
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex
        h-5 w-9 shrink-0
        items-center
        rounded-full
        p-0
        transition-colors duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500/30
        ${checked ? "bg-blue-600" : "bg-(--app-surface-3)"}
      `}
    >
      <span
        className={`
          absolute
          left-0
          top-1/2
          h-4 w-4
          -translate-y-1/2
          rounded-full
          bg-white
          shadow-sm
          transition-transform duration-200
          ${checked ? "translate-x-4" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

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
        flex min-h-14
        items-center
        justify-between
        gap-4
        border-b
        border-(--app-border-light)
        py-2.5
        last:border-b-0
      "
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold">{title}</p>

        <p className="mt-0.5 text-[9px] leading-4 ivac-text-muted">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-center">
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof CreditCard;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <Icon size={14} className="ivac-primary" />
      <h2 className="text-xs font-bold">{children}</h2>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="text-[10px] font-semibold">
      {label}

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="ivac-input mt-1"
      />
    </label>
  );
}

export default function SettingsPage({
  email,
  onBack,
}: {
  email: string | null;
  onBack: () => void;
}) {
  const [settings, setSettings] = useState<Settings>(readSettings);

  const [saved, setSaved] = useState(false);

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
  };

  return (
    <div className="ivac-app">
      {/* Header */}
      <header
        className="
          sticky top-0 z-40
          border-b
          border-(--app-border)
          bg-(--app-surface)
        "
      >
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            className="
              ivac-hover
              rounded-lg
              p-2
              ivac-text-muted
            "
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h1 className="text-sm font-bold">Settings</h1>

            <p className="text-[9px] ivac-text-muted">Workspace preferences</p>
          </div>
        </div>
      </header>

      <main
        className="
          mx-auto
          w-full
          max-w-2xl
          space-y-4
          px-4
          pb-8
          pt-5
        "
      >
        {/* Account */}
        <div className="border-b border-(--app-border) pb-4">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              ivac-primary
            "
          >
            Account
          </p>

          <div className="mt-2 flex items-center gap-3">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                ivac-primary-bg
                ivac-primary
              "
            >
              <UserRound size={17} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">
                {email || "Signed-in account"}
              </p>

              <p className="text-[9px] ivac-text-muted">
                Indian Visa Assistance workspace
              </p>
            </div>
          </div>
        </div>

        {/* General */}
        <section>
          <SectionTitle icon={SlidersHorizontal}>
            General configuration
          </SectionTitle>

          <div className="ivac-card rounded-lg px-3">
            <SettingToggle
              title="Demo mode"
              description="Use sample data and simulated actions"
              checked={settings.demoMode}
              onChange={(value) => update("demoMode", value)}
            />

            <SettingToggle
              title="Pause on human verification"
              description="Stop automation when verification appears"
              checked={settings.pauseOnVerification}
              onChange={(value) => update("pauseOnVerification", value)}
            />

            <SettingToggle
              title="Auto-start workflow"
              description="Start the selected workflow when the dashboard opens"
              checked={settings.autoStartWorkflow}
              onChange={(value) => update("autoStartWorkflow", value)}
            />
          </div>
        </section>

        {/* Appointment */}
        <section>
          <SectionTitle icon={Globe2}>Appointment defaults</SectionTitle>

          <div
            className="
              ivac-card
              grid grid-cols-2
              gap-3
              rounded-lg
              p-3
            "
          >
            <label className="text-[10px] font-semibold">
              Mission
              <select
                className="ivac-input mt-1"
                value={settings.mission}
                onChange={(event) => update("mission", event.target.value)}
              >
                <option>Bangladesh</option>
                <option>India</option>
              </select>
            </label>

            <label className="text-[10px] font-semibold">
              Preferred center
              <select
                className="ivac-input mt-1"
                value={settings.center}
                onChange={(event) => update("center", event.target.value)}
              >
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Rajshahi</option>
              </select>
            </label>
          </div>
        </section>

        {/* Payment Configuration */}
        <section>
          <SectionTitle icon={CreditCard}>Payment configuration</SectionTitle>

          <div className="ivac-card rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[10px] font-semibold">
                Payment gateway
                <select
                  className="ivac-input mt-1"
                  value={settings.gateway}
                  onChange={(event) => update("gateway", event.target.value)}
                >
                  <option>IVAC Payment Gateway</option>
                  <option>Manual payment</option>
                </select>
              </label>

              <label className="text-[10px] font-semibold">
                Currency
                <select
                  className="ivac-input mt-1"
                  value={settings.currency}
                  onChange={(event) => update("currency", event.target.value)}
                >
                  <option>BDT</option>
                  <option>USD</option>
                </select>
              </label>

              <label className="text-[10px] font-semibold">
                Default method
                <select
                  className="ivac-input mt-1"
                  value={settings.paymentMethod}
                  onChange={(event) =>
                    update("paymentMethod", event.target.value)
                  }
                >
                  <option>Card</option>
                  <option>Mobile banking</option>
                  <option>Bank transfer</option>
                </select>
              </label>
            </div>

            {/* Confirm Payment */}
            <div className="mt-3 border-t border-(--app-border-light) pt-1">
              <SettingToggle
                title="Confirm before payment"
                description="Require manual confirmation before opening the payment step"
                checked={settings.confirmBeforePayment}
                onChange={(value) => update("confirmBeforePayment", value)}
              />
            </div>

            {/* Payment Card Info */}
            <div className="mt-4 border-t border-(--app-border-light) pt-3">
              <div className="mb-2 flex items-center gap-2">
                <CreditCard size={13} className="ivac-primary" />

                <div>
                  <p className="text-[10px] font-bold">Payment Card Info</p>

                  <p className="text-[8px] ivac-text-muted">
                    Store display information only
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Card holder name"
                  value={settings.cardHolderName}
                  placeholder="e.g. JOHN DOE"
                  onChange={(value) => update("cardHolderName", value)}
                />

                <Field
                  label="Last 4 digits"
                  value={settings.cardLast4}
                  placeholder="1234"
                  maxLength={4}
                  onChange={(value) =>
                    update("cardLast4", value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>

            {/* bKash Info */}
            <div className="mt-4 border-t border-(--app-border-light) pt-3">
              <div className="mb-2 flex items-center gap-2">
                <Smartphone size={13} className="ivac-primary" />

                <div>
                  <p className="text-[10px] font-bold">bKash Info</p>

                  <p className="text-[8px] ivac-text-muted">
                    Store only non-sensitive account reference
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Account name"
                  value={settings.bkashAccountName}
                  placeholder="e.g. Personal bKash"
                  onChange={(value) => update("bkashAccountName", value)}
                />

                <Field
                  label="Last 4 digits"
                  value={settings.bkashLast4}
                  placeholder="5678"
                  maxLength={4}
                  onChange={(value) =>
                    update("bkashLast4", value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>

            {/* Security Notice */}
            <div
              className="
                mt-4
                flex gap-2
                rounded-md
                ivac-warning-bg
                p-2
                text-[9px]
                ivac-warning
              "
            >
              <ShieldCheck size={13} className="mt-0.5 shrink-0" />

              <span className="leading-4">
                For security, the extension never stores full card numbers,
                expiry dates, CVV, PINs, passwords, or OTPs.
              </span>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <SectionTitle icon={Bell}>Notifications</SectionTitle>

          <div className="ivac-card rounded-lg px-3">
            <SettingToggle
              title="Payment updates"
              description="Show payment status changes in the activity log"
              checked={settings.paymentNotifications}
              onChange={(value) => update("paymentNotifications", value)}
            />

            <SettingToggle
              title="Appointment updates"
              description="Show appointment availability and booking updates"
              checked={settings.appointmentNotifications}
              onChange={(value) => update("appointmentNotifications", value)}
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={saveSettings}
            className="
              flex flex-1
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-blue-600
              py-2.5
              text-[11px]
              font-bold
              text-white
              hover:bg-blue-700
            "
          >
            {saved ? <Check size={14} /> : <Save size={14} />}

            {saved ? "Saved" : "Save settings"}
          </button>

          <button
            type="button"
            onClick={() => void signOutUser()}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-red-200
              px-3
              py-2.5
              text-[11px]
              font-bold
              text-red-500
              dark:border-red-900
            "
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
