import { useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { useDashboardData } from "./hooks/useDashboardData";
import { useWorkflow } from "./hooks/useWorkflow";
import ManagementPanel from "./Management";
import { WorkflowPhase } from "./types";
import DashboardHeader from "./components/dashboard/DashboardHeader";
import DashboardEmpty from "./components/dashboard/DashboardEmpty";
import SettingsModal from "./components/dashboard/SettingsModal";
import ApplicantSelector from "./components/dashboard/ApplicantSelector";
import ApplicationSelector from "./components/dashboard/ApplicationSelector";
import DocumentsCard from "./components/dashboard/DocumentsCard";
import WorkflowCard from "./components/dashboard/WorkflowCard";
import ProgressCard from "./components/dashboard/ProgressCard";
import AppointmentCard from "./components/dashboard/AppointmentCard";
import PaymentCard from "./components/dashboard/PaymentCard";
import ActivityLog from "./components/dashboard/ActivityLog";

export function Dashboard({ user }: { user: FirebaseUser }) {
  const {
    applicants,
    applicant,
    application,
    applicantApplications,
    selectApplicant,
    selectedApplicationId,
    setSelectedApplicationId,
    dataError,
  } = useDashboardData(user);

  const workflow = useWorkflow();

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedTime, setSelectedTime] = useState("");

  const [showManagement, setShowManagement] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  if (!applicant || !application) {
    return (
      <div className="ivac-app">
        <DashboardHeader
          email={user.email}
          onRecords={() => setShowManagement(true)}
          onSettings={() => setShowSettings(true)}
        />

        <DashboardEmpty
          userId={user.uid}
          error={dataError}
          onClose={() => setShowManagement(true)}
        />

        {showManagement && (
          <ManagementPanel
            userId={user.uid}
            onClose={() => setShowManagement(false)}
          />
        )}

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="ivac-app">
      <DashboardHeader
        email={user.email}
        onRecords={() => setShowManagement(true)}
        onSettings={() => setShowSettings(true)}
      />

      <main className="mx-auto w-full max-w-2xl space-y-3 px-3 pb-28 pt-3">
        {/* Applicant */}
        <ApplicantSelector
          applicant={applicant}
          applicants={applicants}
          onSelect={(id) => {
            selectApplicant(id);

            const selected = applicants.find((item) => item.id === id);

            workflow.addLog(
              `Selected applicant: ${selected?.fullName}`,
              "info",
            );
          }}
        />

        {/* Application */}
        <ApplicationSelector
          application={application}
          applications={applicantApplications}
          onSelect={setSelectedApplicationId}
        />

        {/* Documents */}
        <DocumentsCard />

        {/* Workflow */}
        <WorkflowCard
          phase={workflow.workflowPhase}
          steps={workflow.steps}
          started={
            workflow.workflowPhase === "signup"
              ? workflow.steps.some((step) => step.status === "running")
              : true
          }
          onPhaseChange={(phase: WorkflowPhase) =>
            workflow.setWorkflowPhase(phase)
          }
          onStart={workflow.startFlow}
          onReset={workflow.reset}
        />

        {/* Progress */}
        <ProgressCard
          progress={workflow.progress}
          currentStep={workflow.currentStep}
          steps={workflow.steps}
          running={workflow.running}
          paused={workflow.paused}
        />

        {/* Appointment */}
        <AppointmentCard
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          onLog={(message) => workflow.addLog(message, "success")}
        />

        {/* Payment */}
        <PaymentCard application={application} />

        {/* Activity */}
        <ActivityLog logs={workflow.logs} />
      </main>

      {/* Management */}
      {showManagement && (
        <ManagementPanel
          userId={user.uid}
          onClose={() => setShowManagement(false)}
        />
      )}

      {/* Settings */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
