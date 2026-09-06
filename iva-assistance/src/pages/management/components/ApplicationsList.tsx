import { FileText } from "lucide-react";
import { ApplicationItem } from "./items/ApplicationItem";
import { AccountSection } from "./sections/AccountSection";
import { AppointmentCard } from "./sections/AppointmentCard";
import { WebfilesSection } from "./sections/WebfilesSection";
import { Card } from "../../../components/ui/Card";
import { AddButton } from "../../../components/ui/Button";
import { RecordItem } from "../../../types/management.types";

interface ApplicationsListProps {
  automationAccounts: RecordItem[];
  applications: RecordItem[];
  webfiles: RecordItem[];
  appointments: RecordItem[];
  payments: RecordItem[];
  selectedApplicationId: string;
  onSelectApplication: (id: string) => void;
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

export function ApplicationsList({
  automationAccounts,
  applications,
  webfiles,
  appointments,
  payments,
  selectedApplicationId,
  onSelectApplication,
  onEditAccount,
  onCreateAccount,
  onDeleteAccount,
  onAddApplication,
  onEditApplication,
  onDeleteApplication,
  onAddWebfile,
  onEditWebfile,
  onDeleteWebfile,
}: ApplicationsListProps) {
  const applicationAccount = automationAccounts.find(
    (account) => account.applicationId === selectedApplicationId,
  );
  const relatedWebfiles = webfiles.filter(
    (webfile) => webfile.ivacApplicationId === selectedApplicationId,
  );
  const relatedAppointment = appointments.find(
    (appointment) => appointment.ivacApplicationId === selectedApplicationId,
  );
  const relatedPayment = payments.find(
    (payment) => payment.ivacApplicationId === selectedApplicationId,
  );

  return (
    <Card className="rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={14} />
          <span className="text-xs font-bold">Applications</span>
          <span className="text-[9px] ivac-text-muted">
            {applications.length}
          </span>
        </div>
        <AddButton onClick={onAddApplication} />
      </div>

      <div className="space-y-1">
        {applications.map((application) => (
          <div key={application.id}>
            <ApplicationItem
              app={application}
              isSelected={selectedApplicationId === application.id}
              onSelect={() => onSelectApplication(application.id)}
              onEdit={(event) => {
                event.stopPropagation();
                onEditApplication(application);
              }}
              onDelete={(event) => {
                event.stopPropagation();
                onDeleteApplication(application.id);
              }}
            />

            {selectedApplicationId === application.id && (
              <div className="ml-4 space-y-1 border-l border-[var(--app-border)] py-1">
                <AccountSection
                  account={applicationAccount}
                  onEdit={() => onEditAccount(applicationAccount!)}
                  onCreate={onCreateAccount}
                  onDelete={() => onDeleteAccount(applicationAccount!.id)}
                />
                <AppointmentCard appointment={relatedAppointment} />
                <WebfilesSection
                  webfiles={relatedWebfiles}
                  onAdd={onAddWebfile}
                  onEdit={onEditWebfile}
                  onDelete={onDeleteWebfile}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
