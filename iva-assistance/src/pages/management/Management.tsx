import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AccountForm } from "./components/forms/AccountForm";
import { ApplicationForm } from "./components/forms/ApplicationForm";
import { ApplicationsList } from "./components/ApplicationsList";
import {
  FormMode,
  getCollectionFromMode,
  RecordItem,
} from "../../types/management.type";
import {
  createLocalRecord,
  deleteLocalRecord,
  saveLocalFile,
  LocalCollection,
  subscribeToLocalRecords,
  updateLocalRecord,
} from "../../storage/storage";
import { subscribeToRecords } from "../../firebase/data";
import { WebfileDocument } from "../../types/application.type";

export default function ManagementPanel({
  userId,
  initialRequest,
  onClose,
}: {
  userId: string;
  initialRequest?: { mode: FormMode; applicationId: string } | null;
  onClose: () => void;
}) {
  // Editable setup data is local; booking outcomes remain in Firestore.
  const [automationAccounts, setAutomationAccounts] = useState<RecordItem[]>(
    [],
  );
  const [applications, setApplications] = useState<RecordItem[]>([]);
  const [appointments, setAppointments] = useState<RecordItem[]>([]);
  const [payments, setPayments] = useState<RecordItem[]>([]);

  // UI state
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("application");
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const handledInitialRequest = useRef(false);

  // Subscribe to local setup data and remote booking outcomes.
  useEffect(() => {
    const unsubscribers = [
      subscribeToLocalRecords(userId, "automationAccounts", (records) =>
        setAutomationAccounts(records as RecordItem[]),
      ),
      subscribeToLocalRecords(userId, "ivacApplications", (records) =>
        setApplications(records as RecordItem[]),
      ),
      subscribeToRecords(userId, "appointments", setAppointments, (err) =>
        console.error("Appointments subscription error:", err),
      ),
      subscribeToRecords(userId, "payments", setPayments, (err) =>
        console.error("Payments subscription error:", err),
      ),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [userId]);

  useEffect(() => {
    if (
      handledInitialRequest.current ||
      !initialRequest ||
      !applications.some(
        (application) => application.id === initialRequest.applicationId,
      )
    ) {
      return;
    }

    const record =
      initialRequest.mode === "application"
        ? applications.find(
            (application) => application.id === initialRequest.applicationId,
          )
        : automationAccounts.find(
            (account) => account.applicationId === initialRequest.applicationId,
          );

    setSelectedApplicationId(initialRequest.applicationId);
    setFormMode(initialRequest.mode);
    setEditing(record ?? null);
    setShowForm(true);
    handledInitialRequest.current = true;
  }, [applications, automationAccounts, initialRequest]);

  /**
   * Handle form submission for all record types
   */
  async function handleSave(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const values = new FormData(form);
    try {
      const collection = getCollectionFromMode(formMode);
      const record: Record<string, unknown> = Object.fromEntries(
        values.entries(),
      );
      if (formMode === "application") {
        const webfileFields = [
          "primary_webfile",
          "other_webfile_one",
          "other_webfile_two",
          "other_webfile_three",
          "other_webfile_four",
        ];
        for (const field of webfileFields) {
          const file = values.get(field);
          if (!(file instanceof File) || file.size === 0) {
            delete record[field];
            continue;
          }
          if (file.size > 10 * 1024 * 1024) {
            throw new Error("Files must be smaller than 10 MB.");
          }
          const fileId = crypto.randomUUID();
          const document: WebfileDocument = {
            id: fileId,
            originalName: file.name,
            filePath: file.webkitRelativePath || file.name,
          };
          record[field] = document;
          await saveLocalFile(fileId, file);
        }
        const existingPrimary = editing?.primary_webfile as
          | WebfileDocument
          | undefined;
        if (!record.primary_webfile && !existingPrimary) {
          throw new Error("Choose a primary webfile.");
        }
        if (!record.primary_webfile && existingPrimary) {
          record.primary_webfile = existingPrimary;
        }
      }
      if (editing)
        await updateLocalRecord(userId, collection, editing.id, record);
      else await createLocalRecord(userId, collection, record);
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

  /**
   * Handle record deletion with confirmation
   */
  async function handleDelete(collection: LocalCollection, id: string) {
    if (!window.confirm("Delete this record?")) return;
    setError("");
    try {
      await deleteLocalRecord(userId, collection, id);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete record.",
      );
    }
  }

  /**
   * Open form for creating/editing a record
   */
  function openForm(mode: FormMode, record: RecordItem | null = null) {
    setFormMode(mode);
    setEditing(record);
    setShowForm(true);
    setError("");
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-(--app-bg)">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-(--app-border) bg-(--app-surface)">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center">
              <img
                src="/icons/icon32.png"
                alt="Indian Visa Assistance"
                className="h-8 w-8"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-(--app-text)">
                Management Panel
              </h1>
              <p className="text-[9px] ivac-text-muted">
                Manage applications, appointments, payments and automation
                accounts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close records"
            className="ivac-hover rounded-lg p-2 ivac-text-muted"
          >
            <X size={17} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-2xl space-y-3 p-3">
        {/* Account form overlay */}
        {showForm && formMode === "account" && selectedApplicationId && (
          <AccountForm
            applicationId={selectedApplicationId}
            busy={busy}
            error={error}
            initialRecord={editing}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        )}

        {/* Application form overlay */}
        {showForm && formMode === "application" && (
          <ApplicationForm
            busy={busy}
            error={error}
            initialRecord={editing}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        )}

        {/* Application workspace */}
        <ApplicationsList
          automationAccounts={automationAccounts}
          applications={applications}
          appointments={appointments}
          payments={payments}
          selectedApplicationId={selectedApplicationId}
          onSelectApplication={setSelectedApplicationId}
          onEditAccount={(account) => openForm("account", account)}
          onCreateAccount={() => openForm("account")}
          onDeleteAccount={(id) => void handleDelete("automationAccounts", id)}
          onAddApplication={() => openForm("application")}
          onEditApplication={(app) => openForm("application", app)}
          onDeleteApplication={(id) =>
            void handleDelete("ivacApplications", id)
          }
        />
      </main>
    </div>
  );
}
