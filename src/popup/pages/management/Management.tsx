import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  CollectionName,
  createRecord,
  deleteRecordWithCascade,
  saveRecord,
  subscribeToRecords,
} from "../../../firebase/data";
import { ApplicantForm } from "./components/forms/ApplicantForm";
import { AccountForm } from "./components/forms/AccountForm";
import { ApplicationForm } from "./components/forms/ApplicationForm";
import { WebfileForm } from "./components/forms/WebfileForm";
import { ApplicantsList } from "./components/ApplicantsList";
import {
  FormMode,
  getCollectionFromMode,
  RecordItem,
} from "../../../types/management.types";

export default function ManagementPanel({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  // Firestore data state
  const [applicants, setApplicants] = useState<RecordItem[]>([]);
  const [automationAccounts, setAutomationAccounts] = useState<RecordItem[]>(
    [],
  );
  const [applications, setApplications] = useState<RecordItem[]>([]);
  const [webfiles, setWebfiles] = useState<RecordItem[]>([]);
  const [appointments, setAppointments] = useState<RecordItem[]>([]);

  // UI state
  const [selectedApplicantId, setSelectedApplicantId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("applicant");
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Subscribe to Firestore collections
  useEffect(() => {
    const unsubscribers = [
      subscribeToRecords(userId, "applicants", setApplicants, (err) =>
        console.error("Applicants subscription error:", err),
      ),
      subscribeToRecords(
        userId,
        "automationAccounts",
        setAutomationAccounts,
        (err) => console.error("Automation accounts subscription error:", err),
      ),
      subscribeToRecords(userId, "ivacApplications", setApplications, (err) =>
        console.error("Applications subscription error:", err),
      ),
      subscribeToRecords(userId, "webfiles", setWebfiles, (err) =>
        console.error("Webfiles subscription error:", err),
      ),
      subscribeToRecords(userId, "appointments", setAppointments, (err) =>
        console.error("Appointments subscription error:", err),
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
            ivacApplicationId: selectedApplicationId,
            status: "pending",
          });
      } else {
        const record = Object.fromEntries(values.entries());
        const collection = getCollectionFromMode(formMode);
        if (editing) await saveRecord(userId, collection, editing.id, record);
        else await createRecord(userId, collection, record);
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
  async function handleDelete(collection: CollectionName, id: string) {
    if (!window.confirm("Delete this record?")) return;
    setError("");
    try {
      await deleteRecordWithCascade(userId, collection, id);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--app-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center">
              <img
                src="/icons/icon32.png"
                alt="Indian Visa Assistant"
                className="h-8 w-8"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--app-text)]">
                Management Panel
              </h1>
              <p className="text-[9px] ivac-text-muted">
                Manage applicants, ivac accounts, applications and webfiles.
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
        {/* Applicant form overlay */}
        {showForm && formMode === "applicant" && (
          <ApplicantForm
            busy={busy}
            error={error}
            initialRecord={editing}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        )}

        {/* Account form overlay */}
        {showForm && formMode === "account" && selectedApplicantId && (
          <AccountForm
            applicantId={selectedApplicantId}
            busy={busy}
            error={error}
            initialRecord={editing}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        )}

        {/* Application form overlay */}
        {showForm && formMode === "application" && selectedApplicantId && (
          <ApplicationForm
            applicantId={selectedApplicantId}
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

        {/* Applicants tree */}
        <ApplicantsList
          applicants={applicants}
          automationAccounts={automationAccounts}
          applications={applications}
          webfiles={webfiles}
          appointments={appointments}
          selectedApplicantId={selectedApplicantId}
          selectedApplicationId={selectedApplicationId}
          onSelectApplicant={setSelectedApplicantId}
          onSelectApplication={setSelectedApplicationId}
          onAddApplicant={() => openForm("applicant")}
          onEditApplicant={(applicant) => openForm("applicant", applicant)}
          onDeleteApplicant={(id) => void handleDelete("applicants", id)}
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
