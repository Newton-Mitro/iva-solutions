import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import type { LicenseSettings } from "../types/license";
import { getSettings, saveSettings } from "../services/settings.service";

export default function SettingsPage() {
  const [s, setS] = useState<LicenseSettings | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    getSettings().then(setS);
  }, []);
  if (!s) return <div className="empty">Loading...</div>;
  const currentSettings = s;
  async function save() {
    const n: LicenseSettings = {
      id: currentSettings.id,
      trialDays: currentSettings.trialDays,
      validationIntervalHours: currentSettings.validationIntervalHours,
      offlineGracePeriodHours: currentSettings.offlineGracePeriodHours,
      updatedAt: new Date().toISOString(),
    };
    await saveSettings(n);
    setS(n);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Settings</h1>
          <p>Global license settings stored in Firestore.</p>
        </div>
      </div>
      <section className="panel settings-panel">
        <label>
          Trial Days
          <input
            type="number"
            min={1}
            value={s.trialDays}
            onChange={(e) => setS({ ...s, trialDays: Number(e.target.value) })}
          />
        </label>
        <label>
          Validation Interval (hours)
          <input
            type="number"
            min={1}
            value={s.validationIntervalHours}
            onChange={(e) =>
              setS({ ...s, validationIntervalHours: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Offline Grace Period (hours)
          <input
            type="number"
            min={0}
            value={s.offlineGracePeriodHours}
            onChange={(e) =>
              setS({ ...s, offlineGracePeriodHours: Number(e.target.value) })
            }
          />
        </label>
        <div className="settings-note">
          These values are stored in Firestore under settings/license.
        </div>
        <div className="modal-actions">
          <span className="saved">{saved ? "Saved" : ""}</span>
          <button className="primary-button" onClick={save}>
            <Save size={15} /> Save Settings
          </button>
        </div>
      </section>
    </>
  );
}
