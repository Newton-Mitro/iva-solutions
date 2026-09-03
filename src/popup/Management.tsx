import { useEffect, useState } from "react";
import {
  FileText,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  createRecord,
  deleteRecordWithCascade,
  saveRecord,
  subscribeToRecords,
  type FirestoreRecord,
} from "../firebase/data";

type Section =
  | "applicants"
  | "automationAccounts"
  | "ivacApplications"
  | "webfiles";
type RecordItem = FirestoreRecord & { id: string };

const sections: Array<{ id: Section; label: string; icon: typeof UserRound }> =
  [
    { id: "applicants", label: "Applicants", icon: UserRound },
    { id: "automationAccounts", label: "IVAC accounts", icon: KeyRound },
    { id: "ivacApplications", label: "Applications", icon: FileText },
    { id: "webfiles", label: "Webfiles", icon: FileText },
  ];

const text = (record: FirestoreRecord, key: string) =>
  String(record[key] ?? "-");

export default function ManagementPanel({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [section, setSection] = useState<Section>("applicants");
  const [records, setRecords] = useState<Record<Section, RecordItem[]>>({
    applicants: [],
    automationAccounts: [],
    ivacApplications: [],
    webfiles: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribers = sections.map(({ id }) =>
      subscribeToRecords(
        userId,
        id,
        (items) => setRecords((current) => ({ ...current, [id]: items })),
        (subscriptionError) => {
          setError(
            subscriptionError.message.includes("permission-denied")
              ? "Permission denied. Publish firestore.rules and sign in again."
              : subscriptionError.message,
          );
        },
      ),
    );
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [userId]);

  const current = records[section];
  const title = sections.find((item) => item.id === section)?.label;

  async function save(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const values = new FormData(form);
    try {
      if (section === "webfiles") {
        const file = values.get("file");
        if (!editing && (!(file instanceof File) || file.size === 0))
          throw new Error("Choose a file first.");
        if (file instanceof File && file.size > 10 * 1024 * 1024)
          throw new Error("Files must be smaller than 10 MB.");
        const record = {
          webfileNumber: values.get("webfileNumber"),
          ...(file instanceof File
            ? {
                originalName: file.name,
                filePath: file.webkitRelativePath || file.name,
                status: "pending",
              }
            : {}),
        };
        if (editing) await saveRecord(userId, "webfiles", editing.id, record);
        else
          await createRecord(userId, "webfiles", {
            ...record,
            status: "pending",
          });
      } else {
        const record = Object.fromEntries(values.entries());
        if (editing) await saveRecord(userId, section, editing.id, record);
        else await createRecord(userId, section, record);
      }
      setShowForm(false);
      setEditing(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save record.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(record: RecordItem) {
    if (
      !window.confirm(
        `Delete this ${title?.toLowerCase().replace(/s$/, "")} record?`,
      )
    )
      return;
    setError("");
    try {
      await deleteRecordWithCascade(userId, section, record.id);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete record.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--app-bg)]">
      <header className="sticky top-0 z-10 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="flex h-14 items-center justify-between px-4">
          <div>
            <p className="text-sm font-bold">Records</p>
            <p className="text-[9px] ivac-text-muted">Firestore database</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close records"
            className="ivac-hover rounded-lg p-2 ivac-text-muted"
          >
            <X size={17} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSection(id);
                setShowForm(false);
                setEditing(null);
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold ${section === id ? "bg-blue-600 text-white" : "ivac-hover ivac-text-secondary"}`}
            >
              <Icon size={13} />
              {label}
              <span className="opacity-70">{records[id].length}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-2xl space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">{title}</h1>
            <p className="text-[10px] ivac-text-muted">
              Records are stored in your signed-in Firebase account.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setError("");
            }}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-blue-700"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        {showForm && (
          <RecordForm
            section={section}
            applicants={records.applicants}
            applications={records.ivacApplications}
            busy={busy}
            error={error}
            onCancel={() => setShowForm(false)}
            initialRecord={editing}
            onSubmit={save}
          />
        )}
        {current.length === 0 && !showForm ? (
          <div className="ivac-card rounded-xl p-8 text-center text-xs ivac-text-muted">
            No {title?.toLowerCase()} yet.
          </div>
        ) : (
          <div className="space-y-2">
            {current.map((record) => (
              <RecordCard
                key={record.id}
                section={section}
                record={record}
                onEdit={() => {
                  setEditing(record);
                  setShowForm(true);
                  setError("");
                }}
                onDelete={() => void remove(record)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function RecordForm({
  section,
  applicants,
  applications,
  busy,
  error,
  initialRecord,
  onCancel,
  onSubmit,
}: {
  section: Section;
  applicants: RecordItem[];
  applications: RecordItem[];
  busy: boolean;
  error: string;
  initialRecord: RecordItem | null;
  onCancel: () => void;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(event.currentTarget);
      }}
      className="ivac-card space-y-3 rounded-xl p-3"
    >
      {section === "applicants" && (
        <>
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
        </>
      )}
      {section === "automationAccounts" && (
        <>
          <RecordSelect
            name="applicantId"
            label="Applicant"
            required
            value={text(initialRecord ?? {}, "applicantId")}
            options={applicants.map((item) => ({
              value: item.id,
              label: `${text(item, "fullName")} · ${text(item, "passportNumber")}`,
            }))}
          />
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
            label="Account status"
            defaultValue={text(initialRecord ?? {}, "accountStatus")}
          />
        </>
      )}
      {section === "ivacApplications" && (
        <>
          <RecordSelect
            name="applicantId"
            label="Applicant"
            required
            value={text(initialRecord ?? {}, "applicantId")}
            options={applicants.map((item) => ({
              value: item.id,
              label: `${text(item, "fullName")} · ${text(item, "passportNumber")}`,
            }))}
          />
          <Field
            name="mission"
            label="Mission"
            defaultValue={
              text(initialRecord ?? {}, "mission") === "-"
                ? "India"
                : text(initialRecord ?? {}, "mission")
            }
          />
          <Field
            name="ivacCenter"
            label="IVAC center"
            defaultValue={text(initialRecord ?? {}, "ivacCenter")}
          />
          <Field
            name="status"
            label="Status"
            defaultValue={
              text(initialRecord ?? {}, "status") === "-"
                ? "draft"
                : text(initialRecord ?? {}, "status")
            }
          />
        </>
      )}
      {section === "webfiles" && (
        <>
          <RecordSelect
            name="ivacApplicationId"
            label="IVAC application"
            required
            value={text(initialRecord ?? {}, "ivacApplicationId")}
            options={applications.map((item) => ({
              value: item.id,
              label: `${text(item, "mission")} · ${text(item, "ivacCenter")}`,
            }))}
          />
          <Field
            name="webfileNumber"
            label="Webfile number"
            required
            defaultValue={text(initialRecord ?? {}, "webfileNumber")}
          />
          <label className="block text-[10px] font-semibold">
            Document
            <input
              className="ivac-input mt-1"
              name="file"
              type="file"
              accept="application/pdf,image/*"
              required={!initialRecord}
            />
          </label>
        </>
      )}
      {error && (
        <p className="rounded-lg ivac-danger-bg p-2 text-[10px] ivac-danger">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="ivac-hover flex-1 rounded-lg border border-[var(--app-border)] py-2 text-[10px] font-semibold"
        >
          Cancel
        </button>
        <button
          disabled={busy}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-[10px] font-bold text-white disabled:opacity-60"
        >
          {busy ? "Saving..." : initialRecord ? "Update record" : "Save record"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block text-[10px] font-semibold">
      {label}
      <input
        className="ivac-input mt-1"
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
      />
    </label>
  );
}

function RecordSelect({
  name,
  label,
  required,
  value,
  options,
}: {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block text-[10px] font-semibold">
      {label}
      <select
        className="ivac-input mt-1"
        name={name}
        required={required}
        defaultValue={value === "-" ? "" : value}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {options.length === 0 && (
        <span className="mt-1 block font-normal ivac-warning">
          Add a related record first.
        </span>
      )}
    </label>
  );
}

function RecordCard({
  section,
  record,
  onEdit,
  onDelete,
}: {
  section: Section;
  record: RecordItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const primary =
    section === "applicants"
      ? text(record, "fullName")
      : section === "automationAccounts"
        ? text(record, "email")
        : section === "ivacApplications"
          ? text(record, "mission")
          : text(record, "webfileNumber");
  const secondary =
    section === "applicants"
      ? text(record, "passportNumber")
      : section === "automationAccounts"
        ? text(record, "accountStatus")
        : section === "ivacApplications"
          ? text(record, "ivacCenter")
          : text(record, "originalName");
  return (
    <article className="ivac-card flex items-center justify-between gap-3 rounded-xl p-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-bold">{primary}</p>
        <p className="mt-1 truncate text-[10px] ivac-text-muted">{secondary}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span className="rounded-full ivac-primary-bg px-2 py-1 text-[9px] font-semibold ivac-primary">
          {text(record, "status")}
        </span>
        <button
          onClick={onEdit}
          aria-label={`Edit ${primary}`}
          className="ivac-hover rounded-md p-1.5 ivac-text-muted"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${primary}`}
          className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </article>
  );
}
