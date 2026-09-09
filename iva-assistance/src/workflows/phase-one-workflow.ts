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
    id: "open_ivac",
    phase: "phase_one",
    title: "Open Indian Visa Application Centre Website",
    icon: Globe2,
    selectors: [],
    action: "navigate",
    url: "https://appointment.ivacbd.com/signin",
  },

  {
    id: "enter_phone",
    phase: "phase_one",
    title: "Enter phone number",
    icon: Phone,
    selectors: ['input[name="phone"]'],
    action: "fill",
    valueKey: "account.mobile",
  },

  {
    id: "enter_password",
    phase: "phase_one",
    title: "Enter password",
    icon: LockKeyhole,
    selectors: ['input[name="password"]', 'input[type="password"]'],
    action: "fill",
    valueKey: "account.ivacPassword",
  },

  {
    id: "sign_in_human_verification",
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
    id: "sign_in_now_button",
    phase: "phase_one",
    title: "Click Sign In Now button",
    icon: LogIn,
    selectors: ['button[type="submit"]', "button"],
    action: "click",
  },

  {
    id: "enter_signin_otp",
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
    id: "verify_signin_otp_button",
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
    id: "close_first_notice",
    phase: "phase_one",
    title: "Close first notice dialog",
    icon: X,
    selectors: ['button[aria-label="Close notice"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "close_second_notice",
    phase: "phase_one",
    title: "Close second notice dialog",
    icon: X,
    selectors: ['button[aria-label="Close popup"]', '[role="dialog"] button'],
    action: "click",
  },

  {
    id: "book_appointment_button",
    phase: "phase_one",
    title: "Click Take Your Appointment button",
    icon: ClipboardCheck,
    selectors: ["button"],
    text: "Take Your Appointment",
    action: "click",
  },

  {
    id: "appointment_next_step_button",
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
    id: "webfile_human_verification",
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
    id: "upload-primary-webfile",
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
    id: "appointment-other-webfile-one-human-verification",
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
    id: "upload-other-webfile-one",
    phase: "phase_one",
    title: "Select other webfile 1 to upload",
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
    id: "upload-other-webfile-two",
    phase: "phase_one",
    title: "Select other webfile 2 to upload",
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
    id: "upload-other-webfile-three",
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
    id: "appointment-save-and-continue",
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
    title: "Click Select IVAC center button",
    icon: MapPin,
    selectors: [
      'button:has(span:text("Select your IVAC center"))',
      'button:has(> div > div > span:text("Select your IVAC center"))',
      "button",
    ],
    text: "Select your IVAC center",
    action: "click",
    valueKey: "appointment.ivacCenter",
  },

  {
    id: "select-ivac-center-value",
    phase: "phase_one",
    title: "Select IVAC center Value",
    icon: MapPin,
    selectors: ['button[style*="background"][class*="FFF4E6"]', "button"],
    text: "IVAC, Dhaka (JFP)",
    action: "click",
    valueKey: "appointment.ivacCenter",
  },

  {
    id: "appointment-confirm-mission-ivac-center",
    phase: "phase_one",
    title: "Click Confirm Mission & IVAC Center button",
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
    title: "Click Continue booking button",
    icon: ChevronRight,
    selectors: ['button[type="submit"]'],
    text: "Continue Booking",
    action: "click",
  },
];
