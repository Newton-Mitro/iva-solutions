import { Timestamp } from "firebase/firestore";

export type Message = {
  id: string;
  agentPhone: string;
  body: string;
  otp: string;
  clientPhone: string;
  deviceUid: string;
  sender: string;
  timestamp: Timestamp;
};
