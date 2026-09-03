import { Field } from "../ui/Field";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { text, type RecordItem } from "../management.types";

interface WebfileFormProps {
  applicationId: string;
  busy: boolean;
  error: string;
  initialRecord: RecordItem | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}

/**
 * Form for creating/editing webfiles
 */
export function WebfileForm({
  applicationId,
  busy,
  error,
  initialRecord,
  onCancel,
  onSubmit,
}: WebfileFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="mb-2 space-y-2"
    >
      <Card>
        <input type="hidden" name="ivacApplicationId" value={applicationId} />
        <Field
          name="webfileNumber"
          label="Webfile number"
          required
          defaultValue={text(initialRecord ?? {}, "webfileNumber")}
        />
        <label className="block text-[9px] font-semibold">
          Document
          <input
            className="ivac-input mt-1"
            name="file"
            type="file"
            accept="application/pdf,image/*"
            required={!initialRecord}
          />
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
