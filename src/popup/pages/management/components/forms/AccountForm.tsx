import { RecordItem, text } from "../../../../../types/management.types";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Field } from "../../../../components/ui/Field";

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

        {/* Account Information */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
            Account information
          </p>

          <div className="mt-1.5 space-y-2">
            <Field
              name="email"
              label="Indian Visa Application email"
              type="email"
              required
              defaultValue={text(record, "email")}
            />

            <Field
              name="mobile"
              label="Mobile"
              required
              defaultValue={text(record, "mobile")}
            />

            <Field
              name="ivacPassword"
              label="IVAC password"
              type="password"
              defaultValue={
                initialRecord?.ivacPassword
                  ? String(initialRecord.ivacPassword)
                  : ""
              }
            />
          </div>
        </div>

        {/* Account Status */}
        <label className="block text-[9px] font-semibold">
          Status
          <select
            className="ivac-input mt-0.5"
            name="accountStatus"
            defaultValue={text(record, "accountStatus") || "pending"}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
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
            {busy ? "Saving..." : initialRecord ? "Update" : "Save account"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
