import { useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import ManagementPanel from "../management/Management";
import DashboardHeader from "./components/DashboardHeader";
import DashboardEmpty from "./components/DashboardEmpty";
import ApplicationSelector from "./components/ApplicationSelector";
import WorkflowCard from "./components/WorkflowCard";
import ActivityLog from "./components/ActivityLog";
import { useDashboardData } from "./hooks/useDashboardData";
import { useWorkflow } from "./hooks/useWorkflow";
import SettingsPage from "../settings/SettingsPage";
import AboutPage from "../AboutPage";
import { WorkflowPhase } from "../../types/workflow.type";
import ApplicationDetailsCard from "./components/ApplicationDetailsCard";
import type { FormMode } from "../../types/management.type";

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
    latestMessage,
    setSelectedApplicationId,
    dataError,
  } = useDashboardData(user);

  const workflow = useWorkflow(
    {
      application,
      account,
    },
    {
      userId: user.uid,
      applicationId: application?.id,
    },
  );
  const [showManagement, setShowManagement] = useState(false);
  const [managementRequest, setManagementRequest] = useState<{
    mode: FormMode;
    applicationId: string;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

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

  if (showAbout) {
    return <AboutPage onBack={() => setShowAbout(false)} />;
  }

  return (
    <div className="ivac-app">
      <DashboardHeader
        email={user.email}
        onRecords={() => setShowManagement(true)}
        onSettings={() => setShowSettings(true)}
        onAbout={() => setShowAbout(true)}
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
              latestMessage={latestMessage}
              applicationReady={
                account != null && application.primary_webfile != null
              }
              onEditApplication={() => {
                setManagementRequest({
                  mode: "application",
                  applicationId: application.id,
                });
                setShowManagement(true);
              }}
              onEditAccount={() => {
                setManagementRequest({
                  mode: "account",
                  applicationId: application.id,
                });
                setShowManagement(true);
              }}
            />
            {account != null && application.primary_webfile && (
              <>
                <WorkflowCard
                  phase={workflow.workflowPhase}
                  steps={workflow.steps}
                  started={workflow.running}
                  onPhaseChange={(phase: WorkflowPhase) =>
                    workflow.setWorkflowPhase(phase)
                  }
                  onStart={workflow.startFlow}
                  onStartFromStep={workflow.startFromStep}
                  onRunOnlyStep={workflow.runOnlyStep}
                  onStop={workflow.stopFlow}
                  onReset={workflow.reset}
                  onHumanAction={workflow.submitHumanAction}
                  onSkip={workflow.skipStep}
                  onRetry={workflow.retryStep}
                  onContinue={workflow.continueStep}
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
          initialRequest={managementRequest}
          onClose={() => setShowManagement(false)}
        />
      )}
    </div>
  );
}
