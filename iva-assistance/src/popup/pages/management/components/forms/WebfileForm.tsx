import { RecordItem, text } from "../../../../../types/management.types";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

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
        <input type="hidden" name="ivacApplicationId" value={applicationId} />

        {/* Webfile Information */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Webfile information
          </p>

          <label className="mt-1.5 block text-[9px] font-semibold">
            Type
            <select
              className="ivac-input mt-0.5"
              name="type"
              defaultValue={text(record, "type") || "primary"}
            >
              <option value="primary">Primary</option>
              <option value="additional">Additional</option>
            </select>
          </label>
        </div>

        {/* Document */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Document
          </p>

          <label className="mt-1.5 block text-[9px] font-semibold">
            Webfile document
            <input
              className="ivac-input mt-0.5"
              name="file"
              type="file"
              accept="application/pdf,image/*"
              required={!initialRecord}
            />
          </label>

          {initialRecord && (
            <p className="mt-1 text-[7px] ivac-text-muted">
              Leave empty to keep the existing document.
            </p>
          )}
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
            {busy ? "Saving..." : initialRecord ? "Update" : "Save webfile"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
