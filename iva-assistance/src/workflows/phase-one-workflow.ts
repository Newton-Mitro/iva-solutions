import {
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  LockKeyhole,
  LogIn,
  MessageSquare,
  MapPin,
  Phone,
  ShieldCheck,
  Timer,
  X,
} from "lucide-react";

import { WorkflowStepDefinition } from "../types/workflow.type";

export const phaseOneWorkFlow: WorkflowStepDefinition[] = [
  // ─────────────────────────────────────────────
  // SIGN IN
  // ─────────────────────────────────────────────

  {
    id: "p1_open_ivac",
    phase: "phase_one",
    title: "Navigate to Indian Visa Application Centre Website",
    icon: Globe2,
    selectors: [],
    action: "navigate",
    url: "https://appointment.ivacbd.com/signin",
  },

  {
    id: "p1_enter_phone",
    phase: "phase_one",
    title: "Enter phone number",
    icon: Phone,
    selectors: ['input[name="phone"]'],
    action: "fill",
    valueKey: "account.mobile",
  },

  {
    id: "p1_enter_password",
    phase: "phase_one",
    title: "Enter password",
    icon: LockKeyhole,
    selectors: ['input[name="password"]', 'input[type="password"]'],
    action: "fill",
    valueKey: "account.ivacPassword",
  },

  {
    id: "p1_signin_verify",
    phase: "phase_one",
    title: "Click are you human checkbox",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label*="Verify you are human" i]',
      'iframe[title*="Turnstile" i]',
      'iframe[src*="challenges.cloudflare.com" i]',
    ],
    action: "wait",
  },

  {
    id: "p1_signin",
    phase: "phase_one",
    title: "Click Sign In Now button",
    icon: LogIn,
    selectors: ['button[type="submit"]', "button"],
    action: "click",
  },

  {
    id: "p1_signin_otp",
    phase: "phase_one",
    title: "Enter Sign In OTP",
    child: "Enter the OTP received for this phase.",
    icon: MessageSquare,
    manual: true,
    manualInput: "otp",
    selectors: ['input[id^="otp-"]', 'input[autocomplete="one-time-code"]'],
    action: "focus",
  },

  {
    id: "p1_verify_otp",
    phase: "phase_one",
    title: "Click Verify OTP button",
    icon: LogIn,
    selectors: ['button[type="submit"]'],
    action: "click",
  },

  // ─────────────────────────────────────────────
  // NOTICES
  // ─────────────────────────────────────────────

  {
    id: "p1_close_notice_1",
    phase: "phase_one",
    title: "Close first notice dialog",
    icon: X,
    selectors: ['button[aria-label="Close notice"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "p1_close_notice_2",
    phase: "phase_one",
    title: "Close second notice dialog",
    icon: X,
    selectors: ['button[aria-label="Close popup"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "p1_appointment",
    phase: "phase_one",
    title: "Click Take Your Appointment button",
    icon: ClipboardCheck,
    selectors: ["button"],
    text: "Take Your Appointment",
    action: "click",
  },

  {
    id: "p1_next",
    phase: "phase_one",
    title: "Click Next Step button",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Next Step",
    action: "click",
  },

  // ─────────────────────────────────────────────
  // UPLOAD WEBFILES
  // ─────────────────────────────────────────────

  {
    id: "p1_primary_verify",
    phase: "phase_one",
    title: "Complete primary webfile human verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label*="Verify you are human" i]',
      'iframe[title*="Turnstile" i]',
      'iframe[src*="challenges.cloudflare.com" i]',
    ],
    action: "wait",
  },

  {
    id: "p1_upload_primary",
    phase: "phase_one",
    title: "Select primary webfile to upload",
    icon: FileCheck2,
    selectors: [
      'input[type="file"][accept=".pdf,application/pdf"]',
      'input[name="primary_webfile"]',
      'input[type="file"][data-webfile="primary"]',
      'input[type="file"]',
    ],
    action: "upload-file",
    valueKey: "application.primaryWebfile",
    fileIndex: 0,
  },

  {
    id: "p1_primary_complete",
    phase: "phase_one",
    title: "Wait for primary webfile upload to complete",
    icon: ShieldCheck,
    selectors: [],
    action: "wait",
  },

  // ─────────────────────────────────────────────
  // OTHER WEBFILE 1
  // ─────────────────────────────────────────────

  {
    id: "p1_other1_verify",
    phase: "phase_one",
    title: "Click are you human checkbox for other webfile 1",
    manual: true,
    manualInput: "verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label="Verify you are human"]',
      'input[aria-label*="Verify you are human" i]',
      'input[type="checkbox"][aria-label*="human" i]',
    ],
    action: "focus",
    valueKey: "application.otherWebfileOne",
    optional: true,
  },

  {
    id: "p1_upload_other1",
    phase: "phase_one",
    title: "Select other webfile 1 to upload",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileOne",
    optional: true,
    fileIndex: 1,
  },

  // ─────────────────────────────────────────────
  // OTHER WEBFILE 2
  // ─────────────────────────────────────────────

  {
    id: "p1_other2_verify",
    phase: "phase_one",
    title: "Click are you human checkbox for other webfile 2",
    manual: true,
    manualInput: "verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label="Verify you are human"]',
      'input[aria-label*="Verify you are human" i]',
      'input[type="checkbox"][aria-label*="human" i]',
    ],
    action: "focus",
    valueKey: "application.otherWebfileTwo",
    optional: true,
  },

  {
    id: "p1_upload_other2",
    phase: "phase_one",
    title: "Select other webfile 2 to upload",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileTwo",
    optional: true,
    fileIndex: 2,
  },

  // ─────────────────────────────────────────────
  // OTHER WEBFILE 3
  // ─────────────────────────────────────────────

  {
    id: "p1_other3_verify",
    phase: "phase_one",
    title: "Click are you human checkbox for other webfile 3",
    manual: true,
    manualInput: "verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label="Verify you are human"]',
      'input[aria-label*="Verify you are human" i]',
      'input[type="checkbox"][aria-label*="human" i]',
    ],
    action: "focus",
    valueKey: "application.otherWebfileThree",
    optional: true,
  },

  {
    id: "p1_upload_other3",
    phase: "phase_one",
    title: "Select other webfile 3 to upload",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileThree",
    optional: true,
    fileIndex: 3,
  },

  {
    id: "p1_other3_complete",
    phase: "phase_one",
    title: "Wait for other webfile 3 to upload",
    icon: ShieldCheck,
    selectors: [],
    action: "wait",
  },

  // ─────────────────────────────────────────────
  // SAVE INFORMATION
  // ─────────────────────────────────────────────

  {
    id: "p1_confirm_info",
    phase: "phase_one",
    title: "Click Confirm All Information is Correct button",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Confirm All Information is Correct",
    action: "click",
  },

  {
    id: "p1_save_continue",
    phase: "phase_one",
    title: "Click Save & Continue button",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Save & Continue",
    action: "click",
  },

  // ─────────────────────────────────────────────
  // MISSION / IVAC CENTER
  // ─────────────────────────────────────────────

  {
    id: "p1_select_ivac",
    phase: "phase_one",
    title: "Wait for Mission and IVAC center Selection",
    icon: MapPin,
    selectors: ["button"],
    text: "Select your IVAC center",
    action: "wait",
  },

  {
    id: "p1_confirm_ivac",
    phase: "phase_one",
    title: "Click Confirm Mission & IVAC Center button",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Confirm Mission & IVAC Center",
    action: "click",
  },

  // ─────────────────────────────────────────────
  // BOOK AN APPOINTMENT DATE
  // ─────────────────────────────────────────────

  {
    id: "p1_wait_calendar",
    phase: "phase_one",
    title: "Wait for appointment dates",
    icon: Timer,
    selectors: [
      'button[aria-label="Previous month"]',
      'button[aria-label="Next month"]',
    ],
    action: "wait",
  },

  {
    id: "p1_booking_verify",
    phase: "phase_one",
    title: "Click are you human checkbox",
    child:
      "Complete the security verification in the IVAC page, then continue.",
    icon: ShieldCheck,
    manual: true,
    manualInput: "verification",
    selectors: ["#cf-turnstile", 'input[name="cf-turnstile-response"]'],
    action: "focus",
  },

  {
    id: "p1_select_date",
    phase: "phase_one",
    title: "Select appointment date",
    icon: CalendarDays,
    selectors: ["button"],
    selectionType: "date",
    action: "select",
    valueKey: "application.preferAppointmentDates",
  },

  {
    id: "p1_continue_booking",
    phase: "phase_one",
    title: "Click Continue booking button",
    icon: ChevronRight,
    selectors: ['button[type="submit"]'],
    text: "Continue Booking",
    action: "click",
  },
];
