import { useEffect, useMemo, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import {
  Application,
  AutomationAccount,
} from "../../../types/application.type";
import { subscribeToLocalRecords } from "../../../storage/storage";
import { subscribeToRecords } from "../../../firebase/data";
import { getUserData, subscribeToAuth } from "../../../firebase/auth";
import { subscribeToLatestMessage } from "../../../firebase/messages";
import type { Message } from "../../../types/message.type";

export function useDashboardData(user: FirebaseUser) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [accounts, setAccounts] = useState<AutomationAccount[]>([]);
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);

  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [agentPhone, setAgentPhone] = useState("");

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

    void getUserData(user.uid)
      .then((snapshot) => {
        const userData = snapshot.data();
        setAgentPhone((userData?.phone as string | undefined) ?? "");
      })
      .catch(() => setAgentPhone(""));

    return () => {
      unsubscribeApplications?.();
      unsubscribeAccounts?.();
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

  useEffect(() => {
    if (!agentPhone || !account?.mobile) {
      setLatestMessage(null);
      return;
    }

    const clientPhone = account.mobile;

    const unsubscribe = subscribeToLatestMessage(
      agentPhone,
      clientPhone,
      setLatestMessage,
      (error) => setDataError(error.message),
    );

    return () => unsubscribe();
  }, [account?.mobile, agentPhone]);

  // Webfiles are stored as fixed slots on the application.
  const applicationWebfiles = useMemo(
    () =>
      [
        application?.primary_webfile,
        application?.other_webfile_one,
        application?.other_webfile_two,
        application?.other_webfile_three,
      ].filter((webfile) => Boolean(webfile)),
    [application],
  );

  return {
    applications,
    application,
    account,
    applicationWebfiles,
    latestMessage,
    selectedApplicationId,
    setSelectedApplicationId,
    dataError,
  };
}
