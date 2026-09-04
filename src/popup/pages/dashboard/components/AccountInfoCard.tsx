import {
  CheckCircle2,
  ChevronDown,
  KeyRound,
  Mail,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

import type { AutomationAccount } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

export default function AccountInfoCard({
  account,
}: {
  account: AutomationAccount | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="
        ivac-card
        overflow-hidden
        rounded-xl
        border border-(--app-border)
        shadow-sm
      "
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="
          ivac-hover
          flex w-full
          items-center justify-between
          px-3.5 py-3
          text-left
          transition-colors
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              ivac-primary-bg
              ivac-primary
            "
          >
            <KeyRound size={15} />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold">IVAC account</h2>

              {account && (
                <span
                  className="
                    flex items-center gap-1
                    rounded-full
                    bg-emerald-50
                    px-1.5 py-0.5
                    text-[8px]
                    font-semibold
                    text-emerald-600
                    dark:bg-emerald-950/30
                    dark:text-emerald-400
                  "
                >
                  <CheckCircle2 size={9} />
                  Added
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-[9px] ivac-text-muted">
              Applicant login information
            </p>
          </div>
        </div>

        {/* Chevron */}
        <div
          className="
            ml-3 flex h-7 w-7 shrink-0
            items-center justify-center
            rounded-full
            ivac-surface-2
            ivac-text-muted
          "
        >
          <ChevronDown
            size={15}
            className={`
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* Content */}
      <div
        className={`
          grid transition-[grid-template-rows,opacity]
          duration-200 ease-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              border-t
              border-(--app-border)
              px-3.5
              pb-3.5
              pt-3
            "
          >
            {account ? (
              <>
                {/* Account identity */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="
                      rounded-lg
                      bg-(--app-surface-2)
                      p-2.5
                    "
                  >
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Mail size={11} className="ivac-primary" />
                      <span
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-wide
                          ivac-text-muted
                        "
                      >
                        Email
                      </span>
                    </div>

                    <p
                      className="
                        truncate
                        text-[10px]
                        font-semibold
                      "
                      title={account.email}
                    >
                      {account.email}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-lg
                      bg-(--app-surface-2)
                      p-2.5
                    "
                  >
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Smartphone size={11} className="ivac-primary" />
                      <span
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-wide
                          ivac-text-muted
                        "
                      >
                        Mobile
                      </span>
                    </div>

                    <p className="text-[10px] font-semibold">
                      {account.mobile}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div
                  className="
                    mt-2
                    flex items-center
                    justify-between
                    rounded-lg
                    border
                    border-(--app-border-light)
                    px-2.5 py-2
                  "
                >
                  <div>
                    <p className="text-[9px] font-semibold">Account status</p>

                    <p className="mt-0.5 text-[8px] ivac-text-muted">
                      Current IVAC account state
                    </p>
                  </div>

                  <StatusBadge status={account.accountStatus} />
                </div>

                {/* Verification */}
                <div
                  className="
                    mt-2
                    grid grid-cols-2
                    gap-2
                  "
                >
                  <VerificationItem
                    label="Email verification"
                    verified={Boolean(account.emailVerifiedAt)}
                  />

                  <VerificationItem
                    label="Mobile verification"
                    verified={Boolean(account.mobileVerifiedAt)}
                  />
                </div>

                {/* Login information */}
                {(account.lastLoginAt || account.lastLogoutAt) && (
                  <div className="mt-2">
                    <div
                      className="
                        border-t
                        border-(--app-border-light)
                        pt-2
                      "
                    >
                      <p
                        className="
                          mb-1
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-wide
                          ivac-text-muted
                        "
                      >
                        Activity
                      </p>

                      <div className="grid grid-cols-2 gap-x-4">
                        {account.lastLoginAt && (
                          <InfoRow
                            label="Last login"
                            value={formatDate(account.lastLoginAt)}
                          />
                        )}

                        {account.lastLogoutAt && (
                          <InfoRow
                            label="Last logout"
                            value={formatDate(account.lastLogoutAt)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className="
                  flex flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-dashed
                  border-(--app-border)
                  px-4 py-6
                  text-center
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    ivac-surface-2
                    ivac-text-muted
                  "
                >
                  <KeyRound size={16} />
                </div>

                <p className="mt-2 text-[10px] font-semibold">
                  No IVAC account
                </p>

                <p
                  className="
                    mt-1
                    max-w-xs
                    text-[9px]
                    leading-4
                    ivac-text-muted
                  "
                >
                  No IVAC account has been added for this applicant.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VerificationItem({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div
      className="
        flex items-center
        justify-between
        gap-2
        rounded-lg
        bg-(--app-surface-2)
        px-2.5 py-2
      "
    >
      <span className="text-[8px] font-medium ivac-text-muted">{label}</span>

      <span
        className={`
          flex items-center gap-1
          text-[8px] font-semibold
          ${
            verified
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }
        `}
      >
        <span
          className={`
            h-1.5 w-1.5 rounded-full
            ${verified ? "bg-emerald-500" : "bg-amber-500"}
          `}
        />

        {verified ? "Verified" : "Pending"}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
