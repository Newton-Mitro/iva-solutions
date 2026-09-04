import { useEffect, useMemo, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { Applicant, Application } from "../../../../types/models";
import { subscribeToRecords } from "../../../../firebase/data";

export function useDashboardData(user: FirebaseUser) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

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

    return () => {
      unsubscribeApplicants?.();
      unsubscribeApplications?.();
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
    selectedApplicantId,
    selectedApplicationId,
    setSelectedApplicationId,
    selectApplicant,
    dataError,
  };
}
