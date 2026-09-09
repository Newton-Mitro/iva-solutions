import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Field } from "../../../../components/ui/Field";
import { RecordItem, text } from "../../../../types/management.type";
import { WebfileDocument } from "../../../../types/application.type";

interface ApplicationFormProps {
  busy: boolean;
  error: string;
  initialRecord: RecordItem | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}

/**
 * Form for creating/editing applications
 */
export function ApplicationForm({
  busy,
  error,
  initialRecord,
  onCancel,
  onSubmit,
}: ApplicationFormProps) {
  const record = initialRecord ?? {};
  const value = (key: string) =>
    initialRecord?.[key] === undefined ? "" : text(record, key);
  const fileName = (key: string) => {
    const document = initialRecord?.[key] as WebfileDocument | undefined;
    return document?.originalName;
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="mb-2"
    >
      <Card className="space-y-2.5">
        {/* Application Information */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Application information
          </p>

          <div className="mt-1.5 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field
                name="fullName"
                label="Full name"
                required
                defaultValue={value("fullName")}
              />
              <Field
                name="passportNumber"
                label="Passport number"
                required
                defaultValue={value("passportNumber")}
              />
            </div>

            <label className="block text-[9px] font-semibold">
              Gender
              <select
                className="ivac-input mt-0.5"
                name="gender"
                defaultValue={value("gender")}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            {/* Visa Type + Mission */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[9px] font-semibold">
                Mission
                <select
                  className="ivac-input mt-0.5"
                  name="mission"
                  defaultValue={text(record, "mission") || "India"}
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Khulna">Khulna</option>
                </select>
              </label>

              {/* IVAC Center */}
              <label className="block text-[9px] font-semibold">
                IVAC center
                <select
                  className="ivac-input mt-0.5"
                  name="ivacCenter"
                  defaultValue={text(record, "ivacCenter")}
                >
                  <option value="IVAC, Dhaka (JFP)">IVAC, Dhaka (JFP)</option>
                  <option value="IVAC, Chittagong (JFP)">
                    IVAC, Chittagong (JFP)
                  </option>
                  <option value="IVAC, Rajshahi (JFP)">
                    IVAC, Rajshahi (JFP)
                  </option>
                  <option value="IVAC, Sylhet (JFP)">IVAC, Sylhet (JFP)</option>
                  <option value="IVAC, Khulna (JFP)">IVAC, Khulna (JFP)</option>
                </select>
              </label>
            </div>

            <Field
              name="prefer_appointment_dates"
              label="Preferred appointment dates"
              defaultValue={value("prefer_appointment_dates")}
              placeholder="2026-09-09, 2026-09-10"
            />
            <p className="-mt-1 text-[7px] ivac-text-muted">
              Enter dates in order, separated by commas. The first available
              date is tried first.
            </p>

            <div className="border-t border-(--app-border) pt-2">
              <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
                Webfiles
              </p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <Field
                  name="primary_webfile"
                  label="Primary webfile"
                  type="file"
                  accept="application/pdf,image/*"
                  required={!fileName("primary_webfile")}
                />
                <Field
                  name="other_webfile_one"
                  label="Other webfile 1"
                  type="file"
                  accept="application/pdf,image/*"
                />
                <Field
                  name="other_webfile_two"
                  label="Other webfile 2"
                  type="file"
                  accept="application/pdf,image/*"
                />
                <Field
                  name="other_webfile_three"
                  label="Other webfile 3"
                  type="file"
                  accept="application/pdf,image/*"
                />
              </div>
              {[
                ["primary_webfile", fileName("primary_webfile")],
                ["other_webfile_one", fileName("other_webfile_one")],
                ["other_webfile_two", fileName("other_webfile_two")],
                ["other_webfile_three", fileName("other_webfile_three")],
              ].some(([, name]) => name) && (
                <p className="mt-1 text-[7px] ivac-text-muted">
                  Existing files are kept when no replacement is selected.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="ivac-danger-bg rounded-lg px-2.5 py-2">
            <p className="text-[9px] font-medium ivac-danger">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t border-(--app-border) pt-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="h-8 flex-1 text-[9px]"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={busy}
            className="h-8 flex-1 text-[9px]"
          >
            {busy ? "Saving..." : initialRecord ? "Update" : "Save application"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
