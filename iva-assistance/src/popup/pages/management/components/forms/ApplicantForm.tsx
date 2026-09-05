import { RecordItem, text } from "../../../../../types/management.types";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Field } from "../../../../components/ui/Field";

interface ApplicantFormProps {
  busy: boolean;
  error: string;
  initialRecord: RecordItem | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}

/**
 * Form for creating/editing applicants
 */
export function ApplicantForm({
  busy,
  error,
  initialRecord,
  onCancel,
  onSubmit,
}: ApplicantFormProps) {
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
        {/* Personal Information */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Personal information
          </p>

          <div className="mt-1.5 space-y-2">
            <Field
              name="fullName"
              label="Full name"
              required
              defaultValue={text(record, "fullName")}
            />

            <label className="block text-[9px] font-semibold">
              Gender
              <select
                className="ivac-input mt-0.5"
                name="gender"
                defaultValue={text(record, "gender")}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </div>

        {/* Identification */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Identification
          </p>

          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <Field
              name="passportNumber"
              label="Passport number"
              required
              defaultValue={text(record, "passportNumber")}
            />

            <Field
              name="nidNumber"
              label="NID number"
              required
              defaultValue={text(record, "nidNumber")}
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Contact information
          </p>

          <div className="mt-1.5 space-y-2">
            <Field
              name="email"
              label="Email"
              type="email"
              defaultValue={text(record, "email")}
            />

            <Field
              name="mobile"
              label="Mobile"
              defaultValue={text(record, "mobile")}
            />
          </div>
        </div>

        {/* Status */}
        <label className="block text-[9px] font-semibold">
          Status
          <select
            className="ivac-input mt-0.5"
            name="status"
            defaultValue={text(record, "status")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

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
            {busy ? "Saving..." : initialRecord ? "Update" : "Save applicant"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
