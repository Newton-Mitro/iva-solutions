import { useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import ManagementPanel from "../management/Management";
import DashboardHeader from "./components/DashboardHeader";
import DashboardEmpty from "./components/DashboardEmpty";
import ApplicationSelector from "./components/ApplicationSelector";
import WorkflowCard from "./components/WorkflowCard";
import ActivityLog from "./components/ActivityLog";
import WebfileInfoCard from "./components/WebfileInfoCard";
import { useDashboardData } from "./hooks/useDashboardData";
import { useWorkflow } from "./hooks/useWorkflow";
import SettingsPage from "../settings/SettingsPage";
import { WorkflowPhase } from "../../types/workflow.type";
import ApplicationDetailsCard from "./components/ApplicationDetailsCard";

export function Dashboard({
  user,
  onLicenseDeactivated,
}: {
  user: FirebaseUser;
  onLicenseDeactivated: () => void;
}) {
  const {
    application,
    applications,
    account,
    applicationWebfiles,
    applicationAppointment,
    setSelectedApplicationId,
    dataError,
  } = useDashboardData(user);

  const workflow = useWorkflow(
    {
      application,
      account,
      webfiles: applicationWebfiles,
      appointment: applicationAppointment,
    },
    {
      userId: user.uid,
      applicationId: application?.id,
    },
  );
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

  return (
    <div className="ivac-app">
      <DashboardHeader
        email={user.email}
        onRecords={() => setShowManagement(true)}
        onSettings={() => setShowSettings(true)}
      />

      <main className="mx-auto w-full max-w-2xl space-y-3 px-3 pb-28 pt-3">
        <ApplicationSelector
          application={application}
          applications={applications}
          onSelect={setSelectedApplicationId}
        />

        {application ? (
          <>
            <ApplicationDetailsCard
              application={application}
              account={account}
              appointment={applicationAppointment}
              applicationReady={
                account != null && applicationWebfiles.length > 0
              }
            />
            <WebfileInfoCard webfiles={applicationWebfiles} />
            {account != null && applicationWebfiles.length > 0 && (
              <>
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
                  onHumanAction={workflow.submitHumanAction}
                  onSkip={workflow.skipStep}
                />
                <ActivityLog
                  logs={workflow.logs}
                  onClearLogs={workflow.clearLogs}
                />
              </>
            )}
          </>
        ) : (
          <div className="ivac-card rounded-xl p-4 text-center text-[10px] ivac-text-muted">
            <DashboardEmpty
              error={dataError}
              onClose={() => setShowManagement(true)}
            />
          </div>
        )}
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
