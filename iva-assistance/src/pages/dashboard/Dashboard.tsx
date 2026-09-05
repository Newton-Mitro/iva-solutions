import { useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import ManagementPanel from "../management/Management";
import DashboardHeader from "./components/DashboardHeader";
import DashboardEmpty from "./components/DashboardEmpty";
import ApplicantSelector from "./components/ApplicantSelector";
import ApplicationSelector from "./components/ApplicationSelector";
import WorkflowCard from "./components/WorkflowCard";
import ActivityLog from "./components/ActivityLog";
import AccountInfoCard from "./components/AccountInfoCard";
import WebfileInfoCard from "./components/WebfileInfoCard";
import { useDashboardData } from "./hooks/useDashboardData";
import { useWorkflow } from "./hooks/useWorkflow";
import SettingsPage from "../settings/SettingsPage";
import { WorkflowPhase } from "../../types/dashboard.types";

export function Dashboard({
  user,
  onLicenseDeactivated,
}: {
  user: FirebaseUser;
  onLicenseDeactivated: () => void;
}) {
  const {
    applicants,
    applicant,
    application,
    applicantApplications,
    account,
    applicationWebfiles,
    applicationAppointment,
    applicationPayment,
    selectApplicant,
    setSelectedApplicationId,
    dataError,
  } = useDashboardData(user);

  const workflow = useWorkflow();
  const [showManagement, setShowManagement] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return (
      <SettingsPage
        email={user.email}
        userId={user.uid}
        onBack={() => setShowSettings(false)}
        onLicenseDeactivated={onLicenseDeactivated}
      />
    );
  }

  if (!applicant) {
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

        <AccountInfoCard account={account} />

        <ApplicationSelector
          application={application}
          applications={applicantApplications}
          onSelect={setSelectedApplicationId}
        />

        {application ? (
          <>
            <WebfileInfoCard webfiles={applicationWebfiles} />
            <WorkflowCard
              phase={workflow.workflowPhase}
              steps={workflow.steps}
              started={workflow.running}
              onPhaseChange={(phase: WorkflowPhase) =>
                workflow.setWorkflowPhase(phase)
              }
              onStart={workflow.startFlow}
              onStop={workflow.stopFlow}
              onReset={workflow.reset}
            />
          </>
        ) : (
          <div className="ivac-card rounded-xl p-4 text-center text-[10px] ivac-text-muted">
            Select an application to view webfiles, appointment, and payment
            information.
          </div>
        )}

        <ActivityLog logs={workflow.logs} />
      </main>

      {/* Management */}
      {showManagement && (
        <ManagementPanel
          userId={user.uid}
          onClose={() => setShowManagement(false)}
        />
      )}
    </div>
  );
}
