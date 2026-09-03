import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";

initializeApp();
const db = getFirestore();

export const processScheduledAutomation = onSchedule(
  "every 5 minutes",
  async () => {
    const users = await db.collection("users").listDocuments();
    await Promise.all(
      users.map(async (user) => {
        const pending = await user
          .collection("automationStatus")
          .where("status", "==", "pending")
          .limit(20)
          .get();
        await Promise.all(
          pending.docs.map((record) =>
            record.ref.update({
              status: "queued",
              queuedAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            }),
          ),
        );
      }),
    );
  },
);
