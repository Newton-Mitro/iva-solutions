import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AccountForm } from "./components/forms/AccountForm";
import { ApplicationForm } from "./components/forms/ApplicationForm";
import { WebfileForm } from "./components/forms/WebfileForm";
import { ApplicationsList } from "./components/ApplicationsList";
import {
  FormMode,
  getCollectionFromMode,
  RecordItem,
} from "../../types/management.type";
import {
  createLocalRecord,
  deleteLocalFile,
  deleteLocalRecord,
  LocalCollection,
  saveLocalFile,
  subscribeToLocalRecords,
  updateLocalRecord,
} from "../../storage/storage";
import { subscribeToRecords } from "../../firebase/data";

export default function ManagementPanel({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  // Editable setup data is local; booking outcomes remain in Firestore.
  const [automationAccounts, setAutomationAccounts] = useState<RecordItem[]>(
    [],
  );
  const [applications, setApplications] = useState<RecordItem[]>([]);
  const [webfiles, setWebfiles] = useState<RecordItem[]>([]);
  const [appointments, setAppointments] = useState<RecordItem[]>([]);
  const [payments, setPayments] = useState<RecordItem[]>([]);

  // UI state
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("application");
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Subscribe to local setup data and remote booking outcomes.
  useEffect(() => {
    const unsubscribers = [
      subscribeToLocalRecords(userId, "automationAccounts", (records) =>
        setAutomationAccounts(records as RecordItem[]),
      ),
      subscribeToLocalRecords(userId, "ivacApplications", (records) =>
        setApplications(records as RecordItem[]),
      ),
      subscribeToLocalRecords(userId, "webfiles", (records) =>
        setWebfiles(records as RecordItem[]),
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

  /**
   * Handle form submission for all record types
   */
  async function handleSave(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const values = new FormData(form);
    try {
      if (formMode === "webfile") {
        const file = values.get("file");
        if (!editing && (!(file instanceof File) || file.size === 0))
          throw new Error("Choose a file first.");
        if (file instanceof File && file.size > 10 * 1024 * 1024)
          throw new Error("Files must be smaller than 10 MB.");
        const record = {
          webfileNumber: values.get("webfileNumber"),
          ...(file instanceof File
            ? {
                filePath: file.webkitRelativePath || file.name,
                originalName: file.name,
              }
            : {}),
          type: values.get("type") || "primary",
          status: values.get("status") || "pending",
        };
        if (editing) {
          await updateLocalRecord(userId, "webfiles", editing.id, record);
          if (file instanceof File) {
            await saveLocalFile(editing.id, file);
          }
        } else {
          const created = await createLocalRecord(userId, "webfiles", {
            ...record,
            ivacApplicationId: selectedApplicationId,
          });
          if (file instanceof File) {
            await saveLocalFile(created.id, file);
          }
        }
      } else {
        const record = Object.fromEntries(values.entries());
        const collection = getCollectionFromMode(formMode);
        if (editing)
          await updateLocalRecord(userId, collection, editing.id, record);
        else await createLocalRecord(userId, collection, record);
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

  /**
   * Handle record deletion with confirmation
   */
  async function handleDelete(collection: LocalCollection, id: string) {
    if (!window.confirm("Delete this record?")) return;
    setError("");
    try {
      await deleteLocalRecord(userId, collection, id);
      if (collection === "webfiles") await deleteLocalFile(id);
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
                Manage applications, webfiles, appointments, payments and
                automation accounts.
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

        {/* Webfile form overlay */}
        {showForm && formMode === "webfile" && selectedApplicationId && (
          <WebfileForm
            applicationId={selectedApplicationId}
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
          webfiles={webfiles}
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
          onAddWebfile={() => openForm("webfile")}
          onEditWebfile={(webfile) => openForm("webfile", webfile)}
          onDeleteWebfile={(id) => void handleDelete("webfiles", id)}
        />
      </main>
    </div>
  );
}
