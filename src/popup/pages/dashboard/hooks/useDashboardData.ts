import { useEffect, useMemo, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import {
  Applicant,
  Application,
  Appointment,
  AutomationAccount,
  Payment,
  Webfile,
} from "../../../../types/models";
import { subscribeToRecords } from "../../../../firebase/data";

export function useDashboardData(user: FirebaseUser) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [accounts, setAccounts] = useState<AutomationAccount[]>([]);
  const [webfiles, setWebfiles] = useState<Webfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [selectedApplicantId, setSelectedApplicantId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const unsubscribeApplicants = subscribeToRecords<Applicant>(
      user.uid,
      "applicants",
      (items) => {
        setApplicants(items);

        setSelectedApplicantId((current) => {
          if (current && items.some((item) => item.id === current)) {
            return current;
          }

          return items[0]?.id || "";
        });
      },
      (error) => setDataError(error.message),
    );

    const unsubscribeApplications = subscribeToRecords<Application>(
      user.uid,
      "ivacApplications",
      (items) => {
        setApplications(items);

        setSelectedApplicationId((current) => {
          if (current && items.some((item) => item.id === current)) {
            return current;
          }

          return items[0]?.id || "";
        });
      },
      (error) => setDataError(error.message),
    );
    const unsubscribeAccounts = subscribeToRecords<AutomationAccount>(
      user.uid,
      "automationAccounts",
      setAccounts,
      (error) => setDataError(error.message),
    );
    const unsubscribeWebfiles = subscribeToRecords<Webfile>(
      user.uid,
      "webfiles",
      setWebfiles,
      (error) => setDataError(error.message),
    );
    const unsubscribeAppointments = subscribeToRecords<Appointment>(
      user.uid,
      "appointments",
      setAppointments,
      (error) => setDataError(error.message),
    );
    const unsubscribePayments = subscribeToRecords<Payment>(
      user.uid,
      "payments",
      setPayments,
      (error) => setDataError(error.message),
    );

    return () => {
      unsubscribeApplicants?.();
      unsubscribeApplications?.();
      unsubscribeAccounts?.();
      unsubscribeWebfiles?.();
      unsubscribeAppointments?.();
      unsubscribePayments?.();
    };
  }, [user.uid]);

  const applicant = useMemo(
    () => applicants.find((item) => item.id === selectedApplicantId),
    [applicants, selectedApplicantId],
  );

  const applicantApplications = useMemo(
    () => applications.filter((item) => item.applicantId === applicant?.id),
    [applications, applicant?.id],
  );

  const application = useMemo(
    () =>
      applications.find((item) => item.id === selectedApplicationId) ||
      applicantApplications[0],
    [applications, selectedApplicationId, applicantApplications],
  );

  const account = useMemo(
    () => accounts.find((item) => item.applicantId === applicant?.id),
    [accounts, applicant?.id],
  );

  const applicationWebfiles = useMemo(
    () => webfiles.filter((item) => item.ivacApplicationId === application?.id),
    [webfiles, application?.id],
  );

  const applicationAppointments = useMemo(
    () =>
      appointments.filter((item) => item.ivacApplicationId === application?.id),
    [appointments, application?.id],
  );

  const applicationPayments = useMemo(
    () => payments.filter((item) => item.ivacApplicationId === application?.id),
    [payments, application?.id],
  );

  function selectApplicant(id: string) {
    setSelectedApplicantId(id);

    const firstApplication = applications.find(
      (item) => item.applicantId === id,
    );

    setSelectedApplicationId(firstApplication?.id || "");
  }

  return {
    applicants,
    applications,
    applicant,
    application,
    applicantApplications,
    account,
    applicationWebfiles,
    applicationAppointments,
    applicationPayments,
    selectedApplicantId,
    selectedApplicationId,
    setSelectedApplicationId,
    selectApplicant,
    dataError,
  };
}
