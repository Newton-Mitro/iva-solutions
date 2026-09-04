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
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="mb-2 space-y-2"
    >
      <Card>
        <Field
          name="surname"
          label="Surname"
          required
          defaultValue={text(initialRecord ?? {}, "surname")}
        />
        <Field
          name="givenName"
          label="Given name"
          required
          defaultValue={text(initialRecord ?? {}, "givenName")}
        />
        <Field
          name="fullName"
          label="Full name"
          required
          defaultValue={text(initialRecord ?? {}, "fullName")}
        />
        <Field
          name="passportNumber"
          label="Passport number"
          required
          defaultValue={text(initialRecord ?? {}, "passportNumber")}
        />
        <Field
          name="nidNumber"
          label="NID number"
          required
          defaultValue={text(initialRecord ?? {}, "nidNumber")}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          defaultValue={text(initialRecord ?? {}, "email")}
        />
        <Field
          name="mobile"
          label="Mobile"
          defaultValue={text(initialRecord ?? {}, "mobile")}
        />
        <Field
          name="dateOfBirth"
          label="Date of birth"
          type="date"
          defaultValue={text(initialRecord ?? {}, "dateOfBirth")}
        />
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-[9px] font-semibold">
            Nationality
            <select
              className="ivac-input mt-0.5"
              name="nationality"
              defaultValue={text(initialRecord ?? {}, "nationality")}
            >
              <option value="">Select nationality</option>
              <option value="Bangladeshi">Bangladeshi</option>
              <option value="Indian">Indian</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="block text-[9px] font-semibold">
            Gender
            <select
              className="ivac-input mt-0.5"
              name="gender"
              defaultValue={text(initialRecord ?? {}, "gender")}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field
            name="passportIssueDate"
            label="Passport issue date"
            type="date"
            defaultValue={text(initialRecord ?? {}, "passportIssueDate")}
          />
          <Field
            name="passportExpiryDate"
            label="Passport expiry date"
            type="date"
            defaultValue={text(initialRecord ?? {}, "passportExpiryDate")}
          />
        </div>
        <label className="block text-[9px] font-semibold">
          Status
          <select
            className="ivac-input mt-0.5"
            name="status"
            defaultValue={text(initialRecord ?? {}, "status")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>
        {error && <p className="rounded text-[9px] ivac-danger">{error}</p>}
        <div className="flex gap-1 pt-1">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={busy} className="flex-1">
            {busy ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
