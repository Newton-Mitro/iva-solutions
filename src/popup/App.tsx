import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Info,
  Pause,
  Play,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Square,
  User,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import {
  configureAuth,
  signIn,
  signOutUser,
  signUp,
  subscribeToAuth,
} from "../firebase/auth";
import { firebaseConfigured } from "../firebase/config";
import { createRecord } from "../firebase/data";
import type { User as FirebaseUser } from "firebase/auth";
import ManagementPanel from "./Management";

type Status = "completed" | "running" | "pending" | "failed" | "paused";

type Step = {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: Status;
  progress?: number;
};

type Applicant = {
  id: number;
  name: string;
  passport: string;
  mobile: string;
  email: string;
  nationality: string;
  status: "active" | "inactive";
};

type Application = {
  id: number;
  applicantId: number;
  visaType: string;
  mission: string;
  ivacCenter: string;
  webFileNumber: string;
  applicationNumber: string;
  status: string;
  paymentStatus: string;
};

type WorkflowPhase =
  | "signup"
  | "signin"
  | "webfile"
  | "mission"
  | "relogin"
  | "appointment"
  | "payment"
  | "signout";

const workflowPhases: Array<{
  id: WorkflowPhase;
  title: string;
  description: string;
  action: string;
}> = [
  {
    id: "signup",
    title: "Create IVAC account",
    description:
      "Email OTP, mobile OTP, applicant details, password and consent",
    action: "Start sign up",
  },
  {
    id: "signin",
    title: "Sign in to IVAC",
    description: "Email, password, human verification and mobile OTP",
    action: "Open sign in",
  },
  {
    id: "webfile",
    title: "Upload Webfiles",
    description:
      "Upload primary and additional Webfiles, then confirm the form",
    action: "Prepare Webfiles",
  },
  {
    id: "mission",
    title: "Confirm mission",
    description: "Choose Dhaka and IVAC, Dhaka (JFP)",
    action: "Confirm mission",
  },
  {
    id: "relogin",
    title: "Re-login at 6:00 PM",
    description:
      "The portal requires a fresh sign-in before appointment booking",
    action: "Mark reminder",
  },
  {
    id: "appointment",
    title: "Book appointment",
    description: "Choose date and time, verify human check, continue booking",
    action: "Find appointment",
  },
  {
    id: "payment",
    title: "Complete payment",
    description: "SSLCommerz card or bKash, then download the invoice",
    action: "Review payment",
  },
  {
    id: "signout",
    title: "Sign out",
    description: "End the IVAC portal session after the workflow",
    action: "Sign out",
  },
];

/* =========================================================
   DEMO DATA
   ========================================================= */

const applicants: Applicant[] = [
  {
    id: 1,
    name: "John Doe",
    passport: "A12345678",
    mobile: "01704687376",
    email: "john@example.com",
    nationality: "Bangladeshi",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    passport: "B98765432",
    mobile: "01812345678",
    email: "sarah@example.com",
    nationality: "Bangladeshi",
    status: "active",
  },
  {
    id: 3,
    name: "Michael Rahman",
    passport: "C45678912",
    mobile: "01912345678",
    email: "michael@example.com",
    nationality: "Bangladeshi",
    status: "inactive",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    passport: "D76543210",
    mobile: "01612345678",
    email: "nusrat@example.com",
    nationality: "Bangladeshi",
    status: "active",
  },
  {
    id: 5,
    name: "David Karim",
    passport: "E65432109",
    mobile: "01512345678",
    email: "david@example.com",
    nationality: "Bangladeshi",
    status: "active",
  },
  {
    id: 6,
    name: "Ayesha Rahman",
    passport: "F54321098",
    mobile: "01312345678",
    email: "ayesha@example.com",
    nationality: "Bangladeshi",
    status: "active",
  },
  {
    id: 7,
    name: "Tanvir Hasan",
    passport: "G43210987",
    mobile: "01412345678",
    email: "tanvir@example.com",
    nationality: "Bangladeshi",
    status: "active",
  },
];

const applications: Application[] = [
  {
    id: 101,
    applicantId: 1,
    visaType: "Tourist Visa",
    mission: "India",
    ivacCenter: "IVAC Dhaka",
    webFileNumber: "WEB-2026-001245",
    applicationNumber: "APP-2026-000981",
    status: "draft",
    paymentStatus: "unpaid",
  },
  {
    id: 102,
    applicantId: 1,
    visaType: "Medical Visa",
    mission: "India",
    ivacCenter: "IVAC Dhaka",
    webFileNumber: "WEB-2026-001422",
    applicationNumber: "APP-2026-001002",
    status: "processing",
    paymentStatus: "pending",
  },
  {
    id: 103,
    applicantId: 2,
    visaType: "Tourist Visa",
    mission: "India",
    ivacCenter: "IVAC Chittagong",
    webFileNumber: "WEB-2026-002100",
    applicationNumber: "APP-2026-001200",
    status: "completed",
    paymentStatus: "paid",
  },
];

/* =========================================================
   AUTOMATION STEPS
   ========================================================= */

const initialSteps: Step[] = [
  {
    id: "applicant",
    title: "Applicant",
    description: "Verify applicant information",
    icon: User,
    status: "completed",
  },
  {
    id: "application",
    title: "Application",
    description: "Prepare visa application",
    icon: FileText,
    status: "completed",
  },
  {
    id: "signin",
    title: "Sign In",
    description: "Sign in to IVAC portal",
    icon: ShieldCheck,
    status: "completed",
  },
  {
    id: "fill",
    title: "Fill Application",
    description: "Fill application form",
    icon: FileCheck2,
    status: "running",
    progress: 72,
  },
  {
    id: "appointment",
    title: "Appointment",
    description: "Find appointment slot",
    icon: CalendarDays,
    status: "pending",
  },
  {
    id: "payment",
    title: "Payment",
    description: "Complete payment",
    icon: CreditCard,
    status: "pending",
  },
];

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "ivac-success-bg ivac-success",
    inactive: "ivac-surface-2 ivac-text-muted",

    draft: "ivac-warning-bg ivac-warning",
    processing: "ivac-primary-bg ivac-primary",
    completed: "ivac-success-bg ivac-success",

    paid: "ivac-success-bg ivac-success",
    unpaid: "ivac-surface-2 ivac-text-muted",

    pending: "ivac-warning-bg ivac-warning",
    failed: "ivac-danger-bg ivac-danger",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
        styles[status] ?? "ivac-surface-2 ivac-text-muted"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   STEP ICON
   ========================================================= */

function StepIcon({ status, icon: Icon }: Step) {
  if (status === "completed") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check size={15} />
      </div>
    );
  }

  if (status === "running") {
    return (
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <Icon size={15} />

        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400 ring-2 ring-[var(--app-surface)]" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
        <X size={15} />
      </div>
    );
  }

  if (status === "paused") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
        <Pause size={14} />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
      <Icon size={14} />
    </div>
  );
}

/* =========================================================
   INFO ROW
   ========================================================= */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[10px] text-[var(--app-text-muted)]">{label}</span>

      <span className="text-right text-[10px] font-medium text-[var(--app-text)]">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */

function Dashboard({ user }: { user: FirebaseUser }) {
  const [selectedApplicantId, setSelectedApplicantId] = useState(1);

  const [selectedApplicationId, setSelectedApplicationId] = useState(101);

  const [steps, setSteps] = useState(initialSteps);

  const [running, setRunning] = useState(true);
  const [paused, setPaused] = useState(false);

  const [showApplicants, setShowApplicants] = useState(false);

  const [showApplications, setShowApplications] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [showManagement, setShowManagement] = useState(false);

  const [workflowPhase, setWorkflowPhase] = useState<WorkflowPhase>("signup");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bkash">("card");

  const [applicantSearch, setApplicantSearch] = useState("");

  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");

  const [logs, setLogs] = useState([
    {
      type: "success",
      message: "Applicant information verified",
      time: "10:21:04",
    },
    {
      type: "success",
      message: "Application data prepared",
      time: "10:21:08",
    },
    {
      type: "success",
      message: "Signed in successfully",
      time: "10:21:14",
    },
    {
      type: "info",
      message: "Filling passport information...",
      time: "10:21:19",
    },
  ]);

  const applicant = applicants.find((item) => item.id === selectedApplicantId)!;

  const application = applications.find(
    (item) => item.id === selectedApplicationId,
  )!;

  const filteredApplicants = applicants.filter((item) => {
    const search = applicantSearch.toLowerCase();

    return (
      item.name.toLowerCase().includes(search) ||
      item.passport.toLowerCase().includes(search) ||
      item.mobile.includes(search)
    );
  });

  const progress = useMemo(() => {
    const completed = steps.filter(
      (step) => step.status === "completed",
    ).length;

    const current = steps.find((step) => step.status === "running");

    return Math.round(
      ((completed + (current?.progress ?? 0) / 100) / steps.length) * 100,
    );
  }, [steps]);

  const currentStep = steps.find((step) => step.status === "running");

  function addLog(
    message: string,
    type: "success" | "info" | "warning" | "error" = "info",
  ) {
    setLogs((previous) => [
      ...previous,
      {
        message,
        type,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    ]);
  }

  function advanceWorkflow() {
    const index = workflowPhases.findIndex(
      (phase) => phase.id === workflowPhase,
    );
    const next = workflowPhases[index + 1];
    {
      workflowPhase === "mission" && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
            Mission
            <input className="ivac-input mt-1" value="Dhaka" readOnly />
          </label>
          <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
            IVAC center
            <input
              className="ivac-input mt-1"
              value="IVAC, Dhaka (JFP)"
              readOnly
            />
          </label>
        </div>
      );
    }
    if (!next) {
      addLog("IVAC workflow completed", "success");
      return;
    }
    setWorkflowPhase(next.id);
    addLog(`Workflow stage: ${next.title}`, "info");
  }

  function runPhaseAction() {
    const phase = workflowPhases.find((item) => item.id === workflowPhase)!;
    if (workflowPhase === "signout") {
      addLog("Signing out of IVAC Workspace", "info");
      void signOutUser();
      return;
    }
    if (workflowPhase === "appointment" && (!selectedDate || !selectedTime)) {
      addLog("Select an appointment date and time first", "warning");
      return;
    }
    if (workflowPhase === "relogin")
      addLog("Reminder set for 6:00 PM", "success");
    else if (workflowPhase === "payment")
      addLog(
        `Payment ready via ${paymentMethod === "card" ? "SSLCommerz card" : "bKash"}`,
        "warning",
      );
    else addLog(`${phase.title} checkpoint opened`, "info");
    advanceWorkflow();
  }

  async function handleWebfileUpload(file: File) {
    setUploadState("uploading");
    try {
      const record = await createRecord(user.uid, "webfiles", {
        ivacApplicationId: String(application.id),
        webfileNumber: application.webFileNumber,
        originalName: file.name,
        filePath: file.webkitRelativePath || file.name,
        status: "pending",
      });
      await createRecord(user.uid, "automationLogs", {
        ivacApplicationId: String(application.id),
        step: "webfile_upload",
        status: "completed",
        message: `Uploaded ${file.name}`,
        filePath: file.webkitRelativePath || file.name,
      });
      setUploadState("done");
      addLog("Webfile uploaded successfully", "success");
    } catch {
      setUploadState("error");
      addLog("Webfile upload failed", "error");
    }
  }

  function continueAutomation() {
    const currentIndex = steps.findIndex((step) => step.status === "running");

    if (currentIndex === -1) {
      addLog("Automation completed", "success");
      return;
    }

    const current = steps[currentIndex];

    if (current.id === "fill") {
      setSteps((previous) =>
        previous.map((step) => {
          if (step.id === "fill") {
            return {
              ...step,
              status: "completed",
              progress: 100,
            };
          }

          if (step.id === "appointment") {
            return {
              ...step,
              status: "running",
              progress: 20,
            };
          }

          return step;
        }),
      );

      addLog("Application form completed", "success");

      addLog("Searching for appointment availability...", "info");

      return;
    }

    if (current.id === "appointment") {
      setSteps((previous) =>
        previous.map((step) => {
          if (step.id === "appointment") {
            return {
              ...step,
              status: "completed",
              progress: 100,
            };
          }

          if (step.id === "payment") {
            return {
              ...step,
              status: "running",
              progress: 0,
            };
          }

          return step;
        }),
      );

      addLog("Appointment slot selected", "success");

      addLog("Payment step is ready", "info");

      return;
    }

    if (current.id === "payment") {
      addLog("Payment requires manual confirmation", "warning");
    }
  }

  function togglePause() {
    if (paused) {
      setPaused(false);
      setRunning(true);

      setSteps((previous) =>
        previous.map((step) =>
          step.status === "paused" ? { ...step, status: "running" } : step,
        ),
      );

      addLog("Automation resumed", "info");
    } else {
      setPaused(true);
      setRunning(false);

      setSteps((previous) =>
        previous.map((step) =>
          step.status === "running" ? { ...step, status: "paused" } : step,
        ),
      );

      addLog("Automation paused", "warning");
    }
  }

  function stopAutomation() {
    setRunning(false);
    setPaused(false);

    setSteps((previous) =>
      previous.map((step) =>
        step.status === "running" || step.status === "paused"
          ? {
              ...step,
              status: "pending",
            }
          : step,
      ),
    );

    addLog("Automation stopped by user", "warning");
  }

  function resetAutomation() {
    setSteps(initialSteps);
    setRunning(true);
    setPaused(false);

    setLogs([
      {
        type: "success",
        message: "Automation reset",
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }

  function selectApplicant(id: number) {
    setSelectedApplicantId(id);

    const firstApplication = applications.find(
      (item) => item.applicantId === id,
    );

    if (firstApplication) {
      setSelectedApplicationId(firstApplication.id);
    }

    setShowApplicants(false);
    setApplicantSearch("");

    const selected = applicants.find((item) => item.id === id);

    addLog(`Selected applicant: ${selected?.name}`, "info");
  }

  function logIcon(type: string) {
    if (type === "success") {
      return <CheckCircle2 size={13} className="text-emerald-500" />;
    }

    if (type === "warning") {
      return <AlertCircle size={13} className="text-amber-500" />;
    }

    if (type === "error") {
      return <AlertCircle size={13} className="text-red-500" />;
    }

    return <Activity size={13} className="text-blue-500" />;
  }

  return (
    <div className="ivac-app">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Zap size={16} />
            </div>

            <div>
              <h1 className="text-sm font-bold text-[var(--app-text)]">
                IVAC Automation
              </h1>

              <p className="text-[9px] text-[var(--app-text-muted)]">
                Application Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="hidden max-w-28 truncate text-[9px] text-[var(--app-text-muted)] sm:block">
              {user.email}
            </span>
            <button
              onClick={() => setShowManagement(true)}
              aria-label="Open records"
              className="ivac-hover rounded-lg px-2 py-1.5 text-[10px] font-semibold ivac-primary"
            >
              Records
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="ivac-hover rounded-lg p-2 text-[var(--app-text-muted)]"
              aria-label="Open settings"
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN FULL PAGE
          ===================================================== */}

      <main className="mx-auto w-full max-w-2xl space-y-3 px-3 pb-28 pt-3">
        {/* ===================================================
            APPLICANT
            =================================================== */}

        <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
          <button
            onClick={() => setShowApplicants(!showApplicants)}
            className="ivac-hover flex w-full items-center justify-between p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/40">
                <User size={18} />
              </div>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-bold">
                    {applicant.name}
                  </h2>

                  <StatusBadge status={applicant.status} />
                </div>

                <p className="mt-0.5 truncate text-[10px] text-[var(--app-text-muted)]">
                  Passport: {applicant.passport}
                </p>
              </div>
            </div>

            <ChevronDown
              size={17}
              className={`shrink-0 text-[var(--app-text-muted)] transition-transform ${
                showApplicants ? "rotate-180" : ""
              }`}
            />
          </button>

          {showApplicants && (
            <div className="border-t border-[var(--app-border)]">
              {/* Search */}
              <div className="p-2">
                <div className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] px-3 py-2">
                  <Search
                    size={14}
                    className="shrink-0 text-[var(--app-text-muted)]"
                  />

                  <input
                    value={applicantSearch}
                    onChange={(e) => setApplicantSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-[var(--app-text)] outline-none placeholder:text-[var(--app-text-muted)]"
                    placeholder="Search applicant..."
                  />
                </div>
              </div>

              {/* FIXED HEIGHT + SCROLL */}
              <div className="h-56 overflow-y-auto px-2 pb-2">
                <div className="space-y-1">
                  {filteredApplicants.length === 0 ? (
                    <div className="py-8 text-center">
                      <User
                        size={22}
                        className="mx-auto text-[var(--app-text-muted)]"
                      />

                      <p className="mt-2 text-[10px] text-[var(--app-text-muted)]">
                        No applicants found
                      </p>
                    </div>
                  ) : (
                    filteredApplicants.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectApplicant(item.id)}
                        className={`ivac-hover flex w-full items-center gap-3 rounded-lg p-2.5 text-left ${
                          item.id === applicant.id
                            ? "bg-blue-50 dark:bg-blue-950/30"
                            : ""
                        }`}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--app-surface-2)] text-[var(--app-text-muted)]">
                          <User size={14} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-semibold">
                              {item.name}
                            </p>

                            <StatusBadge status={item.status} />
                          </div>

                          <p className="mt-0.5 truncate text-[9px] text-[var(--app-text-muted)]">
                            {item.passport} · {item.mobile}
                          </p>
                        </div>

                        {item.id === applicant.id && (
                          <Check size={14} className="shrink-0 text-blue-600" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--app-border)] px-3 py-2">
                <p className="text-[9px] text-[var(--app-text-muted)]">
                  {filteredApplicants.length} applicant
                  {filteredApplicants.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            APPLICATION
            =================================================== */}

        <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
          <button
            onClick={() => setShowApplications(!showApplications)}
            className="ivac-hover flex w-full items-center justify-between p-3"
          >
            <div className="min-w-0 text-left">
              <div className="mb-1 flex items-center gap-2">
                <FileText size={14} className="ivac-primary" />

                <span className="text-[9px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                  Application
                </span>

                <StatusBadge status={application.status} />
              </div>

              <h2 className="truncate text-sm font-bold">
                {application.visaType}
              </h2>

              <p className="truncate text-[10px] text-[var(--app-text-muted)]">
                {application.mission} · {application.ivacCenter}
              </p>
            </div>

            <ChevronDown
              size={17}
              className={`shrink-0 text-[var(--app-text-muted)] transition-transform ${
                showApplications ? "rotate-180" : ""
              }`}
            />
          </button>

          {showApplications && (
            <div className="grid grid-cols-2 gap-x-4 border-t border-[var(--app-border)] px-3 pb-3 pt-2">
              <InfoRow label="Web File" value={application.webFileNumber} />

              <InfoRow
                label="Application"
                value={application.applicationNumber}
              />

              <InfoRow label="IVAC Center" value={application.ivacCenter} />

              <InfoRow label="Payment" value={application.paymentStatus} />
            </div>
          )}
        </section>

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FileCheck2 size={14} className="ivac-primary" />
                <p className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
                  Webfile
                </p>
              </div>
              <p className="mt-1 text-xs font-bold">
                Upload supporting document
              </p>
              <p className="mt-0.5 text-[10px] ivac-text-muted">
                PDF or image path saved in Firestore
              </p>
            </div>
            <label className="shrink-0 cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-blue-700">
              {uploadState === "uploading" ? "Uploading..." : "Choose file"}
              <input
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                disabled={uploadState === "uploading"}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleWebfileUpload(file);
                }}
              />
            </label>
          </div>
          {uploadState === "done" && (
            <p className="mt-2 text-[10px] ivac-success">
              Saved to Webfiles and logged.
            </p>
          )}
          {uploadState === "error" && (
            <p className="mt-2 text-[10px] ivac-danger">
              Upload failed. Check your connection and try again.
            </p>
          )}
        </section>

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
                IVAC process
              </p>
              <h2 className="mt-0.5 text-sm font-bold">
                Guided application flow
              </h2>
            </div>
            <span className="ivac-primary-bg rounded-full px-2 py-1 text-[9px] font-bold ivac-primary">
              {workflowPhases.findIndex((phase) => phase.id === workflowPhase) +
                1}{" "}
              / {workflowPhases.length}
            </span>
          </div>

          <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
            {workflowPhases.map((phase, index) => (
              <button
                key={phase.id}
                onClick={() => setWorkflowPhase(phase.id)}
                aria-label={`Open ${phase.title}`}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${phase.id === workflowPhase ? "bg-blue-600 text-white" : index < workflowPhases.findIndex((item) => item.id === workflowPhase) ? "bg-emerald-100 text-emerald-700" : "ivac-surface-2 ivac-text-muted"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900 dark:bg-blue-950/20">
            <p className="text-[9px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Current stage
            </p>
            <h3 className="mt-1 text-sm font-bold text-blue-950 dark:text-blue-100">
              {
                workflowPhases.find((phase) => phase.id === workflowPhase)
                  ?.title
              }
            </h3>
            <p className="mt-1 text-[10px] leading-4 text-blue-800 dark:text-blue-200">
              {
                workflowPhases.find((phase) => phase.id === workflowPhase)
                  ?.description
              }
            </p>

            {workflowPhase === "signup" && (
              <p className="mt-2 rounded-md bg-white/70 p-2 text-[9px] text-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
                Close both IVAC notices first. Complete email OTP, mobile OTP,
                date of birth, passport, NID, surname, given name, password,
                confirmation, and all three consent checks.
              </p>
            )}
            {workflowPhase === "signin" && (
              <p className="mt-2 rounded-md bg-amber-50 p-2 text-[9px] text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                Human verification and the mobile OTP must be completed manually
                in the portal.
              </p>
            )}
            {workflowPhase === "webfile" && (
              <p className="mt-2 rounded-md bg-white/70 p-2 text-[9px] text-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
                Upload the primary Webfile and any additional Webfiles, confirm
                the information, then choose Save & Continue.
              </p>
            )}
            {workflowPhase === "mission" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
                  Mission
                  <input className="ivac-input mt-1" value="Dhaka" readOnly />
                </label>
                <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
                  IVAC center
                  <input
                    className="ivac-input mt-1"
                    value="IVAC, Dhaka (JFP)"
                    readOnly
                  />
                </label>
              </div>
            )}
            {workflowPhase === "relogin" && (
              <p className="mt-2 rounded-md bg-amber-50 p-2 text-[9px] font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                Please sign in again at 6:00 PM before booking becomes
                available.
              </p>
            )}
            {workflowPhase === "appointment" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
                  Appointment date
                  <select
                    className="ivac-input mt-1"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  >
                    <option value="">Select date</option>
                    <option>10 Sep 2026</option>
                    <option>12 Sep 2026</option>
                    <option>15 Sep 2026</option>
                  </select>
                </label>
                <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
                  Appointment time
                  <select
                    className="ivac-input mt-1"
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                  >
                    <option value="">Select time</option>
                    <option>09:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                  </select>
                </label>
              </div>
            )}
            {workflowPhase === "payment" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 rounded-lg border p-2 text-[10px] font-semibold ${paymentMethod === "card" ? "border-blue-500 bg-white text-blue-700" : "border-blue-200 text-blue-800"}`}
                >
                  SSLCommerz card
                </button>
                <button
                  onClick={() => setPaymentMethod("bkash")}
                  className={`flex-1 rounded-lg border p-2 text-[10px] font-semibold ${paymentMethod === "bkash" ? "border-blue-500 bg-white text-blue-700" : "border-blue-200 text-blue-800"}`}
                >
                  bKash
                </button>
              </div>
            )}
            <button
              onClick={runPhaseAction}
              className="mt-3 w-full rounded-lg bg-blue-600 py-2.5 text-[10px] font-bold text-white hover:bg-blue-700"
            >
              {
                workflowPhases.find((phase) => phase.id === workflowPhase)
                  ?.action
              }
              <ArrowRight size={12} className="ml-1 inline" />
            </button>
          </div>
        </section>

        {/* ===================================================
            PROGRESS
            =================================================== */}

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                Automation Progress
              </p>

              <h2 className="mt-0.5 text-sm font-bold">
                {currentStep ? currentStep.title : "Automation Complete"}
              </h2>
            </div>

            <span className="text-lg font-bold ivac-primary">{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[9px] text-[var(--app-text-muted)]">
            <span>
              {currentStep
                ? `Step ${
                    steps.findIndex((step) => step.status === "running") + 1
                  } of ${steps.length}`
                : "All steps completed"}
            </span>

            <span>{paused ? "Paused" : running ? "Running" : "Stopped"}</span>
          </div>
        </section>

        {/* ===================================================
            STEPS
            =================================================== */}

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold">Automation Steps</h2>

              <p className="text-[9px] text-[var(--app-text-muted)]">
                Application workflow
              </p>
            </div>

            <button
              onClick={resetAutomation}
              className="ivac-hover flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-medium text-[var(--app-text-muted)]"
            >
              <RefreshCw size={11} />
              Reset
            </button>
          </div>

          <div>
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex gap-3">
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                      step.status === "completed"
                        ? "bg-emerald-400"
                        : "bg-[var(--app-border)]"
                    }`}
                  />
                )}

                <div className="relative z-10">
                  <StepIcon {...step} />
                </div>

                <div
                  className={`mb-3 flex-1 rounded-lg border p-2.5 ${
                    step.status === "running"
                      ? "border-blue-300 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20"
                      : "border-[var(--app-border)] bg-[var(--app-surface)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{step.title}</p>

                      <p className="mt-0.5 text-[9px] text-[var(--app-text-muted)]">
                        {step.description}
                      </p>
                    </div>

                    {step.status === "completed" && (
                      <span className="shrink-0 text-[8px] font-bold text-emerald-500">
                        DONE
                      </span>
                    )}

                    {step.status === "running" && (
                      <span className="shrink-0 animate-pulse text-[8px] font-bold text-blue-500">
                        RUNNING
                      </span>
                    )}

                    {step.status === "pending" && (
                      <span className="shrink-0 text-[8px] font-bold text-[var(--app-text-muted)]">
                        WAITING
                      </span>
                    )}

                    {step.status === "paused" && (
                      <span className="shrink-0 text-[8px] font-bold text-amber-500">
                        PAUSED
                      </span>
                    )}
                  </div>

                  {step.status === "running" && (
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-[8px] text-[var(--app-text-muted)]">
                        <span>Processing...</span>

                        <span>{step.progress}%</span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${step.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            CURRENT ACTION
            =================================================== */}

        {currentStep && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Activity size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Current Action
                </p>

                <h3 className="mt-0.5 text-xs font-bold text-blue-950 dark:text-blue-100">
                  {currentStep.title}
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-blue-800 dark:text-blue-200">
                  {currentStep.id === "fill"
                    ? "Filling passport and personal information on the IVAC portal."
                    : currentStep.id === "appointment"
                      ? "Searching for available appointment slots."
                      : "Processing the next automation step."}
                </p>

                {currentStep.id === "fill" && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[9px] text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                    <Info size={12} className="mt-0.5 shrink-0" />

                    <span>
                      The extension will pause if human verification is
                      detected.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            ACTIVITY
            =================================================== */}

        <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--app-border)] p-3">
            <div>
              <h2 className="text-xs font-bold">Activity Log</h2>

              <p className="text-[9px] text-[var(--app-text-muted)]">
                Live automation events
              </p>
            </div>

            <Clock3 size={14} className="text-[var(--app-text-muted)]" />
          </div>

          <div className="max-h-48 overflow-y-auto p-3">
            <div className="space-y-3">
              {logs
                .slice()
                .reverse()
                .map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="mt-0.5">{logIcon(log.type)}</div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] leading-4 text-[var(--app-text-secondary)]">
                        {log.message}
                      </p>

                      <p className="mt-0.5 text-[8px] text-[var(--app-text-muted)]">
                        {log.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            APPOINTMENT
            =================================================== */}

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="ivac-purple-bg flex h-8 w-8 items-center justify-center rounded-lg">
                <CalendarDays size={15} className="ivac-purple" />
              </div>

              <div>
                <h2 className="text-xs font-bold">Appointment</h2>

                <p className="text-[9px] text-[var(--app-text-muted)]">
                  Appointment availability
                </p>
              </div>
            </div>

            <span className="ivac-success-bg ivac-success rounded-full px-2 py-1 text-[8px] font-bold">
              3 SLOTS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {["10 Sep", "12 Sep", "15 Sep"].map((date) => (
              <button
                key={date}
                onClick={() =>
                  addLog(`Appointment date selected: ${date}`, "success")
                }
                className="ivac-hover rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-2 text-center"
              >
                <p className="text-[8px] text-[var(--app-text-muted)]">
                  Available
                </p>

                <p className="mt-1 text-[11px] font-bold">{date}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ===================================================
            DOCUMENTS
            =================================================== */}

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-[var(--app-text-muted)]" />

              <h2 className="text-xs font-bold">Documents</h2>
            </div>

            <span className="text-[9px] font-medium text-[var(--app-text-muted)]">
              2 / 2
            </span>
          </div>

          <div className="space-y-1.5">
            {["Passport", "Applicant Photo"].map((document) => (
              <div
                key={document}
                className="flex items-center gap-2 rounded-lg bg-[var(--app-surface-2)] p-2"
              >
                <CheckCircle2 size={14} className="text-emerald-500" />

                <span className="flex-1 text-[10px]">{document}</span>

                <span className="text-[8px] font-bold text-emerald-500">
                  READY
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            PAYMENT
            =================================================== */}

        <section className="ivac-card rounded-xl p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="ivac-success-bg flex h-8 w-8 items-center justify-center rounded-lg">
                <WalletCards size={15} className="ivac-success" />
              </div>

              <div>
                <h2 className="text-xs font-bold">Payment</h2>

                <p className="text-[9px] text-[var(--app-text-muted)]">
                  Payment summary
                </p>
              </div>
            </div>

            <StatusBadge status={application.paymentStatus} />
          </div>

          <div className="rounded-lg border border-[var(--app-border)] px-3">
            <InfoRow label="Application Fee" value="৳ 800.00" />

            <div className="border-t border-[var(--app-border)]" />

            <InfoRow label="Convenience Fee" value="৳ 100.00" />

            <div className="border-t border-[var(--app-border)]" />

            <InfoRow label="Total" value="৳ 900.00" />
          </div>

          <div className="ivac-warning-bg ivac-warning mt-2 flex items-start gap-2 rounded-lg p-2 text-[9px]">
            <Info size={12} className="mt-0.5 shrink-0" />

            <span>
              Payment requires explicit user confirmation before proceeding.
            </span>
          </div>
        </section>
      </main>

      {/* =====================================================
          BOTTOM ACTION BAR
          ===================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--app-border)] bg-[var(--app-surface)] p-3 shadow-[0_-4px_15px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex w-full max-w-2xl gap-2">
          <button
            onClick={togglePause}
            disabled={!running && !paused}
            className="ivac-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--app-border)] text-[var(--app-text-secondary)] disabled:opacity-40"
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>

          <button
            onClick={stopAutomation}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20"
          >
            <Square size={14} />
          </button>

          <button
            onClick={continueAutomation}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            {currentStep ? (
              <>
                Continue {currentStep.title}
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                Automation Complete
                <Check size={14} />
              </>
            )}
          </button>
        </div>

        <p className="mx-auto mt-1.5 max-w-2xl text-center text-[8px] text-[var(--app-text-muted)]">
          Human verification and payment require manual confirmation.
        </p>
      </div>

      {/* =====================================================
          SETTINGS MODAL
          ===================================================== */}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end bg-[var(--app-overlay)]">
          <div className="w-full rounded-t-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">Automation Settings</h2>

                <p className="mt-0.5 text-[9px] text-[var(--app-text-muted)]">
                  Configure automation behavior
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="ivac-hover rounded-lg p-1.5 text-[var(--app-text-muted)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  title: "Demo Mode",
                  description: "Use sample data and simulated actions",
                },
                {
                  title: "Confirm Before Payment",
                  description: "Require manual confirmation",
                },
                {
                  title: "Pause On Human Verification",
                  description: "Stop automation when verification appears",
                },
              ].map((setting) => (
                <label
                  key={setting.title}
                  className="flex items-center justify-between rounded-lg bg-[var(--app-surface-2)] p-3"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold">{setting.title}</p>

                    <p className="mt-0.5 text-[9px] text-[var(--app-text-muted)]">
                      {setting.description}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 shrink-0 accent-blue-600"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              Save Settings
            </button>

            <button
              onClick={() => void signOutUser()}
              className="mt-2 w-full rounded-lg border border-red-200 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {showManagement && (
        <ManagementPanel
          userId={user.uid}
          onClose={() => setShowManagement(false)}
        />
      )}
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function authErrorMessage(authError: unknown) {
    if (authError && typeof authError === "object" && "code" in authError) {
      const code = String(authError.code);
      if (code === "auth/network-request-failed") {
        return "Firebase cannot be reached. Check your internet connection, extension Firebase host permissions, and API key restrictions.";
      }
      if (code === "auth/operation-not-allowed") {
        return "Email/password sign-in is disabled. Enable it in Firebase Console > Authentication > Sign-in method.";
      }
      if (
        code === "auth/invalid-api-key" ||
        code === "auth/invalid-credential"
      ) {
        return "Firebase credentials are invalid. Check the VITE_FIREBASE_* values in .env.";
      }
    }
    return authError instanceof Error
      ? authError.message
      : "Unable to authenticate.";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await configureAuth();
      if (mode === "signin") await signIn(email, password);
      else await signUp(email, password);
    } catch (authError) {
      setError(authErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  if (!firebaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <section className="ivac-card w-full max-w-sm rounded-2xl p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">IVAC Workspace</p>
              <p className="text-[11px] ivac-text-muted">
                Firebase connection required
              </p>
            </div>
          </div>
          <h1 className="text-xl font-bold">Connect your project</h1>
          <p className="mt-2 text-xs leading-5 ivac-text-secondary">
            Copy <strong>.env.example</strong> to <strong>.env</strong> and add
            your Firebase Web app values before signing in.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="ivac-card w-full max-w-sm rounded-2xl p-6 shadow-sm"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">IVAC Workspace</p>
            <p className="text-[11px] ivac-text-muted">
              Secure automation console
            </p>
          </div>
        </div>
        <h1 className="text-xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-xs ivac-text-secondary">
          {mode === "signin"
            ? "Sign in to access your applicants and runs."
            : "Your records stay isolated to your account."}
        </p>
        <label className="mt-6 block text-[11px] font-semibold">
          Email
          <input
            className="ivac-input mt-1"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="mt-3 block text-[11px] font-semibold">
          Password
          <input
            className="ivac-input mt-1"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
          />
        </label>
        {error && (
          <p className="mt-3 rounded-lg ivac-danger-bg p-2 text-[11px] ivac-danger">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {busy
            ? "Please wait..."
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
          className="mt-4 w-full text-center text-[11px] font-semibold text-blue-600"
        >
          {mode === "signin"
            ? "Create a new account"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);

  useEffect(() => subscribeToAuth(setUser), []);

  if (user === undefined)
    return (
      <main className="flex min-h-screen items-center justify-center text-xs ivac-text-muted">
        Loading workspace...
      </main>
    );
  return user ? <Dashboard user={user} /> : <AuthScreen />;
}
