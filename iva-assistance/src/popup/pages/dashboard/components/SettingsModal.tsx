import { X } from "lucide-react";
import { signOutUser } from "../../../../firebase/auth";

type Props = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: Props) {
  const settings = [
    {
      title: "Demo Mode",
      description: "Use sample data and simulated actions",
    },
    {
      title: "Confirm Before Payment",
      description: "Require manual confirmation",
    },
    {
      title: "Pause On Human Verification",
      description: "Stop automation when verification appears",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-[var(--app-overlay)]">
      <div className="w-full rounded-t-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Automation Settings</h2>

            <p className="mt-0.5 text-[9px] ivac-text-muted">
              Configure automation behavior
            </p>
          </div>

          <button
            onClick={onClose}
            className="ivac-hover rounded-lg p-1.5 ivac-text-muted"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {settings.map((setting) => (
            <label
              key={setting.title}
              className="flex items-center justify-between rounded-lg bg-[var(--app-surface-2)] p-3"
            >
              <div>
                <p className="text-xs font-semibold">{setting.title}</p>

                <p className="mt-0.5 text-[9px] ivac-text-muted">
                  {setting.description}
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-blue-600"
              />
            </label>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white"
        >
          Save Settings
        </button>

        <button
          onClick={() => void signOutUser()}
          className="mt-2 w-full rounded-lg border border-red-200 py-2.5 text-xs font-bold text-red-500 dark:border-red-900"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
