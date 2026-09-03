import { Field } from "../ui/Field";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { text, type RecordItem } from "../management.types";

interface AccountFormProps {
  applicantId: string;
  busy: boolean;
  error: string;
  initialRecord: RecordItem | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}

/**
 * Form for creating/editing automation accounts
 */
export function AccountForm({
  applicantId,
  busy,
  error,
  initialRecord,
  onCancel,
  onSubmit,
}: AccountFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="mt-1 space-y-2"
    >
      <Card>
        <input type="hidden" name="applicantId" value={applicantId} />
        <Field
          name="email"
          label="IVAC email"
          type="email"
          required
          defaultValue={text(initialRecord ?? {}, "email")}
        />
        <Field
          name="mobile"
          label="Mobile"
          required
          defaultValue={text(initialRecord ?? {}, "mobile")}
        />
        <Field
          name="accountStatus"
          label="Status"
          defaultValue={text(initialRecord ?? {}, "accountStatus")}
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
