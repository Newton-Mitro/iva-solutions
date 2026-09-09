import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import type { Message } from "../types/message.type";
import { db } from "./firestore";

export const messagesRef = collection(db, "messages");

export function subscribeToMessages(
  agentPhone: string,
  clientPhone?: string,
  listener?: (messages: Message[]) => void,
  onError?: (error: Error) => void,
) {
  const constraints: QueryConstraint[] = [
    where("agentPhone", "==", agentPhone),
  ];

  if (clientPhone) {
    constraints.push(where("clientPhone", "==", clientPhone));
  }

  constraints.push(orderBy("timestamp", "desc"), limit(20));

  return onSnapshot(
    query(messagesRef, ...constraints),
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      })) as Message[];
      listener?.(items);
    },
    (error) => onError?.(error),
  );
}

export function subscribeToLatestMessage(
  agentPhone: string,
  clientPhone?: string,
  listener?: (message: Message | null) => void,
  onError?: (error: Error) => void,
) {
  return subscribeToMessages(
    agentPhone,
    clientPhone,
    (messages) => {
      listener?.(messages[0] ?? null);
    },
    onError,
  );
}
