import { useEffect, useState } from "react";
import { BadgeCheck, KeyRound, LockKeyhole, XCircle } from "lucide-react";
import {
  activateLicense,
  deactivateLicense,
  getLicense,
  LicenseRecord,
} from "../../../firebase/license";

type Props = {
  userId: string;
  onActivated?: (license: LicenseRecord) => void;
  onDeactivated?: () => void;
};

const keyPattern =
  /^IVAC-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}$/;

export default function LicenseActivation({
  userId,
  onActivated,
  onDeactivated,
}: Props) {
  const [license, setLicense] = useState<LicenseRecord | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    setBusy(true);
    getLicense(userId)
      .then(setLicense)
      .catch(() => setError("Unable to check the license right now."))
      .finally(() => setBusy(false));
  }, [userId]);

  function activate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = value.trim().toUpperCase();

    if (!keyPattern.test(normalized)) {
      setError("Use the format IVAC-XXXXX-XXXXX-XXXXX-XXXXX.");
      return;
    }

    setBusy(true);
    void activateLicense(userId, normalized)
      .then((activated) => {
        setLicense(activated);
        onActivated?.(activated);
        setValue("");
        setError("");
      })
      .catch((activationError: unknown) =>
        setError(
          activationError instanceof Error
            ? activationError.message
            : "Unable to activate this license right now.",
        ),
      )
      .finally(() => setBusy(false));
  }

  function deactivate() {
    setBusy(true);
    void deactivateLicense(userId)
      .then(() => {
        setLicense(null);
        onDeactivated?.();
        setError("");
      })
      .catch(() => setError("Unable to deactivate this license right now."))
      .finally(() => setBusy(false));
  }

  return (
    <section className="ivac-card rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="ivac-primary-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <KeyRound size={17} className="ivac-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold">License activation</h2>
          <p className="mt-0.5 text-[10px] leading-4 ivac-text-muted">
            Activate this workspace with your IVAC license key.
          </p>
        </div>
      </div>

      {busy ? (
        <p className="mt-4 text-xs ivac-text-muted">Checking license...</p>
      ) : license ? (
        <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-500/10 p-3 dark:border-emerald-800">
          <div className="flex items-start gap-2">
            <BadgeCheck
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                License active
              </p>
              <p className="mt-1 truncate font-mono text-[10px] ivac-text-secondary">
                {license.key}
              </p>
              <p className="mt-1 text-[9px] ivac-text-muted">
                Activated {new Date(license.activatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={deactivate}
            disabled={busy}
            className="ivac-hover mt-3 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-red-500"
          >
            <XCircle size={13} />
            Deactivate license
          </button>
        </div>
      ) : (
        <form onSubmit={activate} className="mt-4">
          <label className="text-[10px] font-semibold">
            License key
            <input
              value={value}
              onChange={(event) => {
                setValue(event.target.value.toUpperCase());
                setError("");
              }}
              placeholder="IVAC-AB234-CDEF5-GH678-JKLMN"
              autoComplete="off"
              spellCheck={false}
              className="ivac-input mt-1 font-mono uppercase"
              aria-invalid={Boolean(error)}
            />
          </label>

          {error && (
            <p className="mt-1 flex items-center gap-1 text-[9px] text-red-500">
              <LockKeyhole size={11} />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-[10px] font-bold text-white transition-colors hover:bg-blue-700"
          >
            <BadgeCheck size={14} />
            Activate license
          </button>
          <p className="mt-2 text-center text-[9px] ivac-text-muted">
            Activation is stored for this signed-in workspace.
          </p>
        </form>
      )}
    </section>
  );
}
