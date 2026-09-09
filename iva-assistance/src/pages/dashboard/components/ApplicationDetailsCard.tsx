import {
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  FileText,
  KeyRound,
  Pencil,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import {
  Application,
  AutomationAccount,
  WebfileDocument,
} from "../../../types/application.type";
import type { Message } from "../../../types/message.type";
import { DetailSection } from "./DetailSection";
import { LatestMessageAlert } from "./LatestMessageBanner";
import { MetaItem } from "./MetaItem";
import { SummaryStat } from "./QuickStat";
import { StatusBadge } from "./Shared";
import { WebfileList } from "./WebfileList";

type Props = {
  application: Application;
  account?: AutomationAccount;
  latestMessage?: Message | null;
  applicationReady: boolean;
  onEditApplication: () => void;
  onEditAccount: () => void;
  onRemoveWebfile: (field: WebfileField, file: WebfileDocument) => void;
};

type WebfileField =
  | "primary_webfile"
  | "other_webfile_one"
  | "other_webfile_two"
  | "other_webfile_three";

export default function ApplicationDetailsCard({
  application,
  account,
  latestMessage,
  applicationReady,
  onEditApplication,
  onEditAccount,
  onRemoveWebfile,
}: Props) {
  const [open, setOpen] = useState(false);

  const webfiles = (
    [
      {
        field: "primary_webfile",
        label: "Primary",
        value: application.primary_webfile,
      },
      {
        field: "other_webfile_one",
        label: "Other 1",
        value: application.other_webfile_one,
      },
      {
        field: "other_webfile_two",
        label: "Other 2",
        value: application.other_webfile_two,
      },
      {
        field: "other_webfile_three",
        label: "Other 3",
        value: application.other_webfile_three,
      },
    ] as Array<{
      field: WebfileField;
      label: string;
      value?: WebfileDocument;
    }>
  ).filter(
    (
      item,
    ): item is {
      field: WebfileField;
      label: string;
      value: WebfileDocument;
    } => Boolean(item.value),
  );

  const webfileCount = webfiles.length;
  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border)">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ivac-hover w-full px-3 py-2 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--app-surface-2)">
            <FileText size={14} className="ivac-primary" />

            <span
              className={`absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full ring-2 ring-(--app-card) ${
                applicationReady ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[12px] font-bold">
                {application.fullName || "Selected application"}
              </span>

              <StatusBadge status={application.status} />
            </div>

            <span className="mt-0.5 block truncate text-[10px] ivac-text-muted">
              {application.passportNumber || "No passport"} ·{" "}
              {application.mission || "No mission"} ·{" "}
              {application.ivacCenter || "No IVAC center"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {applicationReady && (
              <CheckCircle2 size={13} className="text-emerald-500" />
            )}

            <span
              className={`hidden text-[9px] font-bold sm:block ${
                applicationReady ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {applicationReady ? "READY" : "INCOMPLETE"}
            </span>

            <ChevronDown
              size={13}
              className={`ivac-text-muted transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 divide-x divide-(--app-border) rounded-lg bg-(--app-surface-2)">
          <SummaryStat
            icon={<KeyRound size={10} />}
            label="Account"
            value={account ? "Exist" : "Missing"}
            good={Boolean(account)}
          />

          <SummaryStat
            icon={<FileText size={10} />}
            label="Webfiles"
            value={`${webfileCount}/5`}
            good={Boolean(application.primary_webfile)}
          />

          <SummaryStat
            icon={<CalendarDays size={10} />}
            label="Booking"
            value={application.prefer_appointment_dates || "-"}
            good={Boolean(application.prefer_appointment_dates)}
          />
        </div>
      </button>

      {latestMessage && <LatestMessageAlert latestMessage={latestMessage} />}

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-(--app-border)">
          <div className="grid gap-2 p-3 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-(--app-border) bg-(--app-surface-2)/70">
              <div className="flex items-center justify-between border-b border-(--app-border) px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={10} className="ivac-primary" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] ivac-text-muted">
                    Application details
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onEditApplication}
                  aria-label="Edit application"
                  title="Edit application"
                  className="ivac-hover rounded-md p-1 ivac-text-muted"
                >
                  <Pencil size={10} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 px-2.5 py-2">
                <MetaItem
                  label="Name"
                  value={application.fullName || "-"}
                  compact
                />
                <MetaItem
                  label="Passport"
                  value={application.passportNumber || "-"}
                  compact
                />
                <MetaItem
                  label="Mission"
                  value={application.mission || "-"}
                  compact
                />
                <MetaItem
                  label="IVAC"
                  value={application.ivacCenter || "-"}
                  compact
                />
                <div className="col-span-2">
                  <MetaItem
                    label="Preferred date(s)"
                    value={application.prefer_appointment_dates || "-"}
                    compact
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-(--app-border) bg-(--app-surface-2)/70">
              <DetailSection
                icon={<KeyRound size={11} />}
                title="Account"
                accent="text-blue-500"
                action={
                  <button
                    type="button"
                    onClick={onEditAccount}
                    aria-label={
                      account ? "Edit IVAC account" : "Add IVAC account"
                    }
                    title={account ? "Edit IVAC account" : "Add IVAC account"}
                    className="ivac-hover ml-auto rounded-md p-1 ivac-text-muted"
                  >
                    {account ? (
                      <Pencil size={10} />
                    ) : (
                      <UserRoundPlus size={10} />
                    )}
                  </button>
                }
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-semibold">
                      {account?.email || "Account not configured"}
                    </p>

                    <p className="mt-0.5 truncate text-[7px] ivac-text-muted">
                      {account?.mobile || "No mobile number"}
                    </p>
                  </div>

                  {account?.accountStatus && (
                    <StatusBadge status={account.accountStatus} />
                  )}
                </div>
              </DetailSection>
            </div>
          </div>

          <WebfileList webfiles={webfiles} onRemoveWebfile={onRemoveWebfile} />
        </div>
      </div>
    </section>
  );
}
