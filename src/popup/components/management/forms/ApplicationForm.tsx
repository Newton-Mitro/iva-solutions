import { Field } from "../ui/Field";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { text, type RecordItem } from "../management.types";

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
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="mb-2 space-y-2"
    >
      <Card>
        <input type="hidden" name="applicantId" value={applicantId} />
        <Field
          name="mission"
          label="Mission"
          defaultValue={text(initialRecord ?? {}, "mission")}
        />
        <Field
          name="ivacCenter"
          label="Indian Visa Application center"
          defaultValue={text(initialRecord ?? {}, "ivacCenter")}
        />
        <Field
          name="status"
          label="Status"
          defaultValue={text(initialRecord ?? {}, "status")}
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
