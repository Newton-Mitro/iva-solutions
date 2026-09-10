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
    id: "phase-one-open-ivac",
    phase: "phase_one",
    title: "Open Indian Visa Application Centre Website",
    icon: Globe2,
    selectors: [],
    action: "navigate",
    url: "https://appointment.ivacbd.com/signin",
  },

  {
    id: "phase-one-enter-phone",
    phase: "phase_one",
    title: "Enter phone number",
    icon: Phone,
    selectors: ['input[name="phone"]'],
    action: "fill",
    valueKey: "account.mobile",
  },

  {
    id: "phase-one-enter-password",
    phase: "phase_one",
    title: "Enter password",
    icon: LockKeyhole,
    selectors: ['input[name="password"]', 'input[type="password"]'],
    action: "fill",
    valueKey: "account.ivacPassword",
  },

  {
    id: "phase-one-sign-in-human-verification",
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
    id: "phase-one-sign-in-button",
    phase: "phase_one",
    title: "Click Sign In Now button",
    icon: LogIn,
    selectors: ['button[type="submit"]', "button"],
    action: "click",
  },

  {
    id: "phase-one-enter-sign-in-otp",
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
    id: "phase-one-verify-sign-in-otp",
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
    id: "phase-one-close-first-notice",
    phase: "phase_one",
    title: "Close first notice dialog",
    icon: X,
    selectors: ['button[aria-label="Close notice"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "phase-one-close-second-notice",
    phase: "phase_one",
    title: "Close second notice dialog",
    icon: X,
    selectors: ['button[aria-label="Close popup"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "phase-one-open-appointment",
    phase: "phase_one",
    title: "Click Take Your Appointment button",
    icon: ClipboardCheck,
    selectors: ["button"],
    text: "Take Your Appointment",
    action: "click",
  },

  {
    id: "phase-one-appointment-next-step",
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
    id: "phase-one-primary-webfile-verification",
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
    id: "phase-one-upload-primary-webfile",
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
    id: "phase-one-primary-webfile-upload-complete",
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
    id: "phase-one-other-webfile-one-verification",
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
    id: "phase-one-upload-other-webfile-one",
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
    id: "phase-one-other-webfile-two-verification",
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
    id: "phase-one-upload-other-webfile-two",
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
    id: "phase-one-other-webfile-three-verification",
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
    id: "phase-one-upload-other-webfile-three",
    phase: "phase_one",
    title: "Select other webfile 3 to upload",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileThree",
    optional: true,
    fileIndex: 3,
  },

  // ─────────────────────────────────────────────
  // SAVE INFORMATION
  // ─────────────────────────────────────────────

  {
    id: "phase-one-confirm-information",
    phase: "phase_one",
    title: "Click Confirm All Information is Correct button",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Confirm All Information is Correct",
    action: "click",
  },

  {
    id: "phase-one-save-and-continue",
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
    id: "select-ivac-center",
    phase: "phase_one",
    title: "Wait for Mission and IVAC center Selection",
    icon: MapPin,
    selectors: ["button"],
    text: "Select your IVAC center",
    action: "wait",
  },

  {
    id: "appointment-confirm-mission-ivac-center",
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
    id: "phase-one-wait-appointment-calendar",
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
    id: "phase-one-appointment-booking-verification",
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
    id: "phase-one-select-appointment-date",
    phase: "phase_one",
    title: "Select appointment date",
    icon: CalendarDays,
    selectors: ["button"],
    selectionType: "date",
    action: "select",
    valueKey: "application.preferAppointmentDates",
  },

  {
    id: "phase-one-continue-booking",
    phase: "phase_one",
    title: "Click Continue booking button",
    icon: ChevronRight,
    selectors: ['button[type="submit"]'],
    text: "Continue Booking",
    action: "click",
  },
];
