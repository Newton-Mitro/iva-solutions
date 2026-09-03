import { FileText } from "lucide-react";
import { type RecordItem, FormMode } from "../management.types";
import { ApplicationItem } from "../items/ApplicationItem";
import { AddButton } from "../ui/Button";
import { AccountSection } from "./AccountSection";
import { AppointmentCard } from "./AppointmentCard";
import { WebfilesSection } from "./WebfilesSection";

interface ApplicationsSectionProps {
  applicantId: string;
  applicantAccount: RecordItem | undefined;
  applications: RecordItem[];
  selectedApplicationId: string;
  webfiles: RecordItem[];
  appointment: RecordItem | undefined;
  onAddApplication: () => void;
  onSelectApplication: (id: string) => void;
  onEditApplication: (app: RecordItem) => void;
  onDeleteApplication: (id: string) => void;
  onEditAccount: () => void;
  onCreateAccount: () => void;
  onDeleteAccount: () => void;
  onAddWebfile: () => void;
  onEditWebfile: (webfile: RecordItem) => void;
  onDeleteWebfile: (id: string) => void;
}

/**
 * Display and manage applications section with nested webfiles
 */
export function ApplicationsSection({
  applicantId,
  applicantAccount,
  applications,
  selectedApplicationId,
  webfiles,
  appointment,
  onAddApplication,
  onSelectApplication,
  onEditApplication,
  onDeleteApplication,
  onEditAccount,
  onCreateAccount,
  onDeleteAccount,
  onAddWebfile,
  onEditWebfile,
  onDeleteWebfile,
}: ApplicationsSectionProps) {
  return (
    <div className="ml-4 space-y-1 border-l border-[var(--app-border)] py-1">
      {/* AUTOMATION ACCOUNT */}
      <AccountSection
        account={applicantAccount}
        onEdit={onEditAccount}
        onCreate={onCreateAccount}
        onDelete={onDeleteAccount}
      />

      {/* APPLICATIONS LIST */}
      <div className="pl-2 pt-2">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={13} />
            <span className="text-[9px] font-bold">Applications</span>
            <span className="text-[8px] ivac-text-muted">
              {applications.length}
            </span>
          </div>
          <AddButton onClick={onAddApplication} size="sm" />
        </div>

        <div className="space-y-1">
          {applications.map((app) => (
            <div key={app.id}>
              <ApplicationItem
                app={app}
                isSelected={selectedApplicationId === app.id}
                onSelect={() => onSelectApplication(app.id)}
                onEdit={(e) => {
                  e.stopPropagation();
                  onEditApplication(app);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDeleteApplication(app.id);
                }}
              />

              {selectedApplicationId === app.id && (
                <div className="ml-4 space-y-1 border-l border-[var(--app-border)] py-1">
                  {/* APPOINTMENT INFO */}
                  <AppointmentCard appointment={appointment} />

                  {/* WEBFILES LIST */}
                  <WebfilesSection
                    webfiles={webfiles}
                    onAdd={onAddWebfile}
                    onEdit={onEditWebfile}
                    onDelete={onDeleteWebfile}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
