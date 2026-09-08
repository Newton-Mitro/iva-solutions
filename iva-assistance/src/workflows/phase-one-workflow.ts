import {
  CalendarDays,
  CheckCircle2,
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
    id: "open-ivac",
    phase: "phase_one",
    title: "Open IVAC website",
    icon: Globe2,
    selectors: [],
    action: "navigate",
    url: "https://appointment.ivacbd.com/signin",
  },

  {
    id: "signin-phone",
    phase: "phase_one",
    title: "Enter phone number",
    icon: Phone,
    selectors: ['input[name="phone"]'],
    action: "fill",
    valueKey: "account.mobile",
  },

  {
    id: "signin-password",
    phase: "phase_one",
    title: "Enter password",
    icon: LockKeyhole,
    selectors: ['input[name="password"]', 'input[type="password"]'],
    action: "fill",
    valueKey: "account.ivacPassword",
  },

  {
    id: "appointment-human-verification",
    phase: "phase_one",
    title: "Complete human verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label*="Verify you are human" i]',
      'iframe[title*="Turnstile" i]',
      'iframe[src*="challenges.cloudflare.com" i]',
    ],
    action: "wait",
  },

  {
    id: "sign-in-now",
    phase: "phase_one",
    title: "Sign in",
    icon: LogIn,
    selectors: ['button[type="submit"]', "button"],
    action: "click",
  },

  {
    id: "signin-otp",
    phase: "phase_one",
    title: "Enter OTP",
    child: "Enter the OTP received for this phase.",
    icon: MessageSquare,
    manual: true,
    manualInput: "otp",
    selectors: ['input[id^="otp-"]', 'input[autocomplete="one-time-code"]'],
    action: "focus",
  },

  {
    id: "verify-signin-otp",
    phase: "phase_one",
    title: "Verify OTP",
    icon: LogIn,
    selectors: ['button[type="submit"]'],
    action: "click",
  },

  // ─────────────────────────────────────────────
  // NOTICES
  // ─────────────────────────────────────────────

  {
    id: "close-first-notice",
    phase: "phase_one",
    title: "Close first notice",
    icon: X,
    selectors: ['button[aria-label="Close notice"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "close-second-notice",
    phase: "phase_one",
    title: "Close second notice",
    icon: X,
    selectors: ['button[aria-label="Close popup"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "book-appointment",
    phase: "phase_one",
    title: "Click Book appointment button",
    icon: ClipboardCheck,
    selectors: ["button"],
    text: "Take Your Appointment",
    action: "click",
  },

  {
    id: "appointment-next-webfile",
    phase: "phase_one",
    title: "Proceed to webfile selection",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Next Step",
    action: "click",
  },

  // ─────────────────────────────────────────────
  // UPLOAD WEBFILES
  // ─────────────────────────────────────────────

  {
    id: "appointment-webfile-confirmation-human-verification",
    phase: "phase_one",
    title: "Complete human verification",
    manual: true,
    manualInput: "verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label="Verify you are human"]',
      'input[aria-label*="Verify you are human" i]',
      'input[type="checkbox"][aria-label*="human" i]',
    ],
    action: "focus",
  },

  {
    id: "upload-primary-webfile",
    phase: "phase_one",
    title: "Upload primary webfile",
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
    id: "appointment-other-webfile-one-human-verification",
    phase: "phase_one",
    title: "Complete human verification for other webfile 1",
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
    id: "upload-other-webfile-one",
    phase: "phase_one",
    title: "Upload other webfile 1",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileOne",
    optional: true,
    fileIndex: 1,
  },

  {
    id: "appointment-other-webfile-two-human-verification",
    phase: "phase_one",
    title: "Complete human verification for other webfile 2",
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
    id: "upload-other-webfile-two",
    phase: "phase_one",
    title: "Upload other webfile 2",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileTwo",
    optional: true,
    fileIndex: 2,
  },

  {
    id: "appointment-other-webfile-three-human-verification",
    phase: "phase_one",
    title: "Complete human verification for other webfile 3",
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
    id: "upload-other-webfile-three",
    phase: "phase_one",
    title: "Upload other webfile 3",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileThree",
    optional: true,
    fileIndex: 3,
  },

  {
    id: "appointment-other-webfile-four-human-verification",
    phase: "phase_one",
    title: "Complete human verification for other webfile 4",
    manual: true,
    manualInput: "verification",
    icon: ShieldCheck,
    selectors: [
      'input[type="checkbox"][aria-label="Verify you are human"]',
      'input[aria-label*="Verify you are human" i]',
      'input[type="checkbox"][aria-label*="human" i]',
    ],
    action: "focus",
    valueKey: "application.otherWebfileFour",
    optional: true,
  },

  {
    id: "upload-other-webfile-four",
    phase: "phase_one",
    title: "Upload other webfile 4",
    icon: FileCheck2,
    selectors: ['input[type="file"]'],
    action: "upload-file",
    valueKey: "application.otherWebfileFour",
    optional: true,
    fileIndex: 4,
  },

  {
    id: "appointment-confirm-all-correct",
    phase: "phase_one",
    title: "Confirm all information is correct",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Confirm All Information is Correct",
    action: "click",
  },

  {
    id: "appointment-save-and-continue",
    phase: "phase_one",
    title: "Save & Continue",
    icon: ChevronRight,
    selectors: ["button"],
    text: "Save & Continue",
    action: "click",
  },

  // ─────────────────────────────────────────────
  // MISSION / IVAC CENTER
  // ─────────────────────────────────────────────

  {
    id: "select-mission",
    phase: "phase_one",
    title: "Select mission",
    icon: MapPin,
    selectors: ["button"],
    text: "Select a mission",
    action: "select",
    valueKey: "appointment.mission",
  },

  {
    id: "select-ivac-center",
    phase: "phase_one",
    title: "Select IVAC center",
    icon: MapPin,
    selectors: ["button"],
    text: "Select your IVAC center",
    action: "select",
    valueKey: "appointment.ivacCenter",
  },

  {
    id: "appointment-confirm-mission-ivac-center",
    phase: "phase_one",
    title: "Confirm Mission & IVAC Center",
    icon: ChevronRight,
    selectors: ['button[type="submit"]'],
    text: "Confirm Mission & IVAC Center",
    action: "click",
  },

  // ─────────────────────────────────────────────
  // BOOK AN APPOINTMENT DATE
  // ─────────────────────────────────────────────

  {
    id: "wait-appointment-calendar",
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
    id: "appointment-booking-human-verification",
    phase: "phase_one",
    title: "Complete booking verification",
    child:
      "Complete the security verification in the IVAC page, then continue.",
    icon: ShieldCheck,
    manual: true,
    manualInput: "verification",
    selectors: ["#cf-turnstile", 'input[name="cf-turnstile-response"]'],
    action: "focus",
  },

  {
    id: "select-appointment-date",
    phase: "phase_one",
    title: "Select appointment date",
    icon: CalendarDays,
    selectors: ["button"],
    selectionType: "date",
    action: "select",
    valueKey: "application.preferAppointmentDates",
  },

  {
    id: "continue-booking",
    phase: "phase_one",
    title: "Continue booking",
    icon: ChevronRight,
    selectors: ['button[type="submit"]'],
    text: "Continue Booking",
    action: "click",
  },
];
