import { useEffect, useMemo, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import {
  Application,
  Appointment,
  AutomationAccount,
  Webfile,
} from "../../../types/application.type";
import { subscribeToLocalRecords } from "../../../storage/storage";
import { subscribeToRecords } from "../../../firebase/data";

export function useDashboardData(user: FirebaseUser) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [accounts, setAccounts] = useState<AutomationAccount[]>([]);
  const [webfiles, setWebfiles] = useState<Webfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const unsubscribeApplications = subscribeToLocalRecords(
      user.uid,
      "ivacApplications",
      (records) => {
        const items = records as Application[];
        setApplications(items);

        setSelectedApplicationId((current) => {
          if (current && items.some((item) => item.id === current)) {
            return current;
          }

          return items[0]?.id || "";
        });
      },
    );

    const unsubscribeAccounts = subscribeToLocalRecords(
      user.uid,
      "automationAccounts",
      (records) => setAccounts(records as AutomationAccount[]),
    );

    const unsubscribeWebfiles = subscribeToLocalRecords(
      user.uid,
      "webfiles",
      (records) => setWebfiles(records as Webfile[]),
    );

    const unsubscribeAppointments = subscribeToRecords<Appointment>(
      user.uid,
      "appointments",
      setAppointments,
      (error) => setDataError(error.message),
    );

    return () => {
      unsubscribeApplications?.();
      unsubscribeAccounts?.();
      unsubscribeWebfiles?.();
      unsubscribeAppointments?.();
    };
  }, [user.uid]);

  // Selected application
  const application = useMemo(
    () =>
      applications.find((item) => item.id === selectedApplicationId) ||
      applications[0],
    [applications, selectedApplicationId],
  );

  // One automation account per application
  const account = useMemo(
    () => accounts.find((item) => item.applicationId === application?.id),
    [accounts, application?.id],
  );

  // Webfiles belonging to application
  const applicationWebfiles = useMemo(
    () => webfiles.filter((item) => item.ivacApplicationId === application?.id),
    [webfiles, application?.id],
  );

  // One appointment per application
  const applicationAppointment = useMemo(
    () =>
      appointments.find((item) => item.ivacApplicationId === application?.id),
    [appointments, application?.id],
  );

  return {
    applications,
    application,
    account,
    applicationWebfiles,
    applicationAppointment,
    selectedApplicationId,
    setSelectedApplicationId,
    dataError,
  };
}
