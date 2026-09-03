import { UserRound } from "lucide-react";
import { type RecordItem, FormMode } from "./management.types";
import { ApplicantItem } from "./items/ApplicantItem";
import { ApplicationsSection } from "./sections/ApplicationsSection";
import { Card } from "./ui/Card";
import { AddButton } from "./ui/Button";

interface ApplicantsListProps {
  applicants: RecordItem[];
  automationAccounts: RecordItem[];
  applications: RecordItem[];
  webfiles: RecordItem[];
  appointments: RecordItem[];
  selectedApplicantId: string;
  selectedApplicationId: string;
  onSelectApplicant: (id: string) => void;
  onSelectApplication: (id: string) => void;
  onAddApplicant: () => void;
  onEditApplicant: (applicant: RecordItem) => void;
  onDeleteApplicant: (id: string) => void;
  onEditAccount: (account: RecordItem) => void;
  onCreateAccount: () => void;
  onDeleteAccount: (id: string) => void;
  onAddApplication: () => void;
  onEditApplication: (app: RecordItem) => void;
  onDeleteApplication: (id: string) => void;
  onAddWebfile: () => void;
  onEditWebfile: (webfile: RecordItem) => void;
  onDeleteWebfile: (id: string) => void;
}

/**
 * Main applicants list with hierarchical tree structure
 */
export function ApplicantsList({
  applicants,
  automationAccounts,
  applications,
  webfiles,
  appointments,
  selectedApplicantId,
  selectedApplicationId,
  onSelectApplicant,
  onSelectApplication,
  onAddApplicant,
  onEditApplicant,
  onDeleteApplicant,
  onEditAccount,
  onCreateAccount,
  onDeleteAccount,
  onAddApplication,
  onEditApplication,
  onDeleteApplication,
  onAddWebfile,
  onEditWebfile,
  onDeleteWebfile,
}: ApplicantsListProps) {
  const selectedApplicant = applicants.find(
    (a) => a.id === selectedApplicantId,
  );
  const applicantAccount = automationAccounts.find(
    (a) => a.applicantId === selectedApplicantId,
  );
  const applicantApplications = applications.filter(
    (a) => a.applicantId === selectedApplicantId,
  );
  const relatedWebfiles = webfiles.filter(
    (w) => w.ivacApplicationId === selectedApplicationId,
  );
  const relatedAppointment = appointments.find(
    (a) => a.ivacApplicationId === selectedApplicationId,
  );

  return (
    <Card className="rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserRound size={14} />
          <span className="text-xs font-bold">Applicants</span>
          <span className="text-[9px] ivac-text-muted">
            {applicants.length}
          </span>
        </div>
        <AddButton onClick={onAddApplicant} />
      </div>

      <div className="space-y-1">
        {applicants.map((applicant) => (
          <div key={applicant.id}>
            <ApplicantItem
              applicant={applicant}
              isSelected={selectedApplicantId === applicant.id}
              onSelect={() => {
                onSelectApplicant(applicant.id);
                onSelectApplication("");
              }}
              onEdit={() => onEditApplicant(applicant)}
              onDelete={() => onDeleteApplicant(applicant.id)}
            />

            {selectedApplicantId === applicant.id && (
              <ApplicationsSection
                applicantId={applicant.id}
                applicantAccount={applicantAccount}
                applications={applicantApplications}
                selectedApplicationId={selectedApplicationId}
                webfiles={relatedWebfiles}
                appointment={relatedAppointment}
                onAddApplication={onAddApplication}
                onSelectApplication={onSelectApplication}
                onEditApplication={onEditApplication}
                onDeleteApplication={onDeleteApplication}
                onEditAccount={() => onEditAccount(applicantAccount!)}
                onCreateAccount={onCreateAccount}
                onDeleteAccount={() => onDeleteAccount(applicantAccount!.id)}
                onAddWebfile={onAddWebfile}
                onEditWebfile={onEditWebfile}
                onDeleteWebfile={onDeleteWebfile}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
