import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Field } from "../../../../components/ui/Field";
import { RecordItem, text } from "../../../../types/management.types";

interface ApplicationFormProps {
  applicantId: string;
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
  applicantId,
  busy,
  error,
  initialRecord,
  onCancel,
  onSubmit,
}: ApplicationFormProps) {
  const record = initialRecord ?? {};

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="mb-2"
    >
      <Card className="space-y-2.5">
        <input type="hidden" name="applicantId" value={applicantId} />

        {/* Application Information */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Application information
          </p>

          <div className="mt-1.5 space-y-2">
            {/* Visa Type + Mission */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[9px] font-semibold">
                Visa type
                <select
                  className="ivac-input mt-0.5"
                  name="visaType"
                  defaultValue={text(record, "visaType")}
                >
                  <option value="">Select</option>
                  <option value="tourist">Tourist</option>
                  <option value="medical">Medical</option>
                  <option value="business">Business</option>
                  <option value="student">Student</option>
                  <option value="employment">Employment</option>
                  <option value="entry">Entry</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block text-[9px] font-semibold">
                Mission
                <select
                  className="ivac-input mt-0.5"
                  name="mission"
                  defaultValue={text(record, "mission") || "India"}
                >
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </label>
            </div>

            {/* IVAC Center */}
            <label className="block text-[9px] font-semibold">
              IVAC center
              <select
                className="ivac-input mt-0.5"
                name="ivacCenter"
                defaultValue={text(record, "ivacCenter")}
              >
                <option value="">Select center</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Rajshahi">Rajshahi</option>
              </select>
            </label>
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
