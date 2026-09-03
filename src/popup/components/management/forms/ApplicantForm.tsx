import { Field } from "../ui/Field";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { text, type RecordItem } from "../management.types";

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
