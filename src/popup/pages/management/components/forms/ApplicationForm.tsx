import { RecordItem, text } from "../../../../../types/management.types";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Field } from "../../../../components/ui/Field";

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
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-[9px] font-semibold">
            Visa type
            <select
              className="ivac-input mt-0.5"
              name="visaType"
              defaultValue={text(initialRecord ?? {}, "visaType")}
            >
              <option value="">Select visa type</option>
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
              defaultValue={text(initialRecord ?? {}, "mission")}
            >
              <option value="India">India</option>
              <option value="Bangladesh">Bangladesh</option>
            </select>
          </label>
        </div>
        <label className="block text-[9px] font-semibold">
          Indian Visa Application center
          <select
            className="ivac-input mt-0.5"
            name="ivacCenter"
            defaultValue={text(initialRecord ?? {}, "ivacCenter")}
          >
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Rajshahi">Rajshahi</option>
          </select>
        </label>

        <label className="block text-[9px] font-semibold">
          Status
          <select
            className="ivac-input mt-0.5"
            name="status"
            defaultValue={text(initialRecord ?? {}, "status")}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="webfile">Webfile</option>
            <option value="mission">Mission</option>
            <option value="appointment">Appointment</option>
            <option value="payment">Payment</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed</option>
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
