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
          label="Indian Visa Application email"
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
          name="ivacPassword"
          label="IVAC password"
          type="password"
          defaultValue={
            initialRecord?.ivacPassword
              ? String(initialRecord.ivacPassword)
              : ""
          }
        />
        <label className="block text-[9px] font-semibold">
          Status
          <select
            className="ivac-input mt-0.5"
            name="accountStatus"
            defaultValue={text(initialRecord ?? {}, "accountStatus")}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
            <option value="logged_out">Logged out</option>
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
