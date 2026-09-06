import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FilePlus2,
  Globe2,
  LockKeyhole,
  LogIn,
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
    id: "sign-verify-human",
    phase: "phase_one",
    title: "Human verification required",
    icon: ShieldCheck,
    selectors: [
      'input[aria-label="Verify you are human"]',
      'input[type="checkbox"][aria-label*="human" i]',
      'input[type="checkbox"][aria-label*="verify" i]',
    ],
    action: "click",
  },

  {
    id: "sign-in-now",
    phase: "phase_one",
    title: "Sign in",
    icon: LogIn,
    selectors: ['button[type="submit"]', "button"],
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
    selectors: [
      '[role="dialog"] button',
      '[role="dialog"] button[aria-label*="close" i]',
      '[role="dialog"] .btn-close',
      ".modal button.close",
    ],
    action: "click",
  },

  {
    id: "close-second-notice",
    phase: "phase_one",
    title: "Close second notice",
    icon: X,
    selectors: [
      '[role="dialog"] button',
      '[role="dialog"] button[aria-label*="close" i]',
      '[role="dialog"] .btn-close',
      ".modal button.close",
    ],
    action: "click",
  },

  // ─────────────────────────────────────────────
  // BOOK APPOINTMENT
  // ─────────────────────────────────────────────

  {
    id: "book-appointment",
    phase: "phase_one",
    title: "Book appointment",
    icon: ClipboardCheck,
    selectors: [
      'button:has-text("Book Appointment")',
      'a:has-text("Book Appointment")',
      '[role="button"]:has-text("Book Appointment")',
    ],
    action: "click",
  },

  {
    id: "appointment-next-webfile",
    phase: "phase_one",
    title: "Proceed to webfile selection",
    icon: ChevronRight,
    selectors: ['button:has-text("Next")', 'button[type="submit"]'],
    action: "click",
  },

  // ─────────────────────────────────────────────
  // HUMAN VERIFICATION
  // ─────────────────────────────────────────────

  {
    id: "appointment-human-verification",
    phase: "phase_one",
    title: "Complete human verification",
    icon: ShieldCheck,
    selectors: [
      'input[aria-label*="human" i]',
      'input[aria-label*="verify" i]',
      'iframe[title*="challenge" i]',
      'iframe[title*="captcha" i]',
    ],
    action: "wait",
  },

  // ─────────────────────────────────────────────
  // WEBFILES
  // ─────────────────────────────────────────────

  {
    id: "select-primary-webfile",
    phase: "phase_one",
    title: "Select primary webfile",
    icon: FileCheck2,
    selectors: [
      'input[name="primary_webfile"]',
      'input[type="radio"]',
      "[data-webfile]",
    ],
    action: "click",
    valueKey: "appointment.primaryWebfile",
  },

  {
    id: "select-other-webfiles",
    phase: "phase_one",
    title: "Select other webfiles",
    icon: FilePlus2,
    selectors: [
      'input[name="webfiles[]"]',
      'input[type="checkbox"][data-webfile]',
      '[data-webfile] input[type="checkbox"]',
    ],
    action: "click",
    valueKey: "appointment.otherWebfiles",
  },

  // ─────────────────────────────────────────────
  // MISSION / IVAC CENTER
  // ─────────────────────────────────────────────

  {
    id: "select-mission",
    phase: "phase_one",
    title: "Select mission",
    icon: MapPin,
    selectors: [
      'select[name="mission"]',
      'select[name="mission_id"]',
      'select[name="mission_type"]',
    ],
    action: "select",
    valueKey: "appointment.mission",
  },

  {
    id: "select-ivac-center",
    phase: "phase_one",
    title: "Select IVAC center",
    icon: MapPin,
    selectors: [
      'select[name="ivac_center"]',
      'select[name="ivac_center_id"]',
      'select[name="center"]',
    ],
    action: "select",
    valueKey: "appointment.ivacCenter",
  },

  {
    id: "appointment-next-details",
    phase: "phase_one",
    title: "Proceed to appointment details",
    icon: ChevronRight,
    selectors: ['button:has-text("Next")', 'button[type="submit"]'],
    action: "click",
  },

  // ─────────────────────────────────────────────
  // APPOINTMENT DATE / TIME
  // ─────────────────────────────────────────────

  {
    id: "wait-appointment-slots",
    phase: "phase_one",
    title: "Wait for appointment slots",
    icon: Timer,
    selectors: [
      "[data-appointment-date]",
      'input[type="date"]',
      ".appointment-date",
      ".available-date",
    ],
    action: "wait",
  },

  {
    id: "select-appointment-date",
    phase: "phase_one",
    title: "Select appointment date",
    icon: CalendarDays,
    selectors: [
      "[data-appointment-date]",
      'input[type="date"]',
      ".appointment-date",
      ".available-date",
    ],
    action: "click",
    valueKey: "appointment.date",
  },

  {
    id: "select-appointment-time",
    phase: "phase_one",
    title: "Select appointment time",
    icon: Clock3,
    selectors: [
      "[data-appointment-time]",
      'select[name="appointment_time"]',
      'input[name="appointment_time"]',
      ".appointment-time",
      ".available-time",
    ],
    action: "click",
    valueKey: "appointment.time",
  },

  {
    id: "appointment-next-confirmation",
    phase: "phase_one",
    title: "Proceed to confirmation",
    icon: ChevronRight,
    selectors: ['button:has-text("Next")', 'button[type="submit"]'],
    action: "click",
  },

  // ─────────────────────────────────────────────
  // CONFIRMATION
  // ─────────────────────────────────────────────

  {
    id: "wait-confirmation-page",
    phase: "phase_one",
    title: "Wait for confirmation page",
    icon: Timer,
    selectors: [
      "[data-confirmation]",
      ".confirmation",
      ".appointment-confirmation",
    ],
    action: "wait",
  },

  {
    id: "confirm-appointment",
    phase: "phase_one",
    title: "Confirm appointment",
    icon: CheckCircle2,
    selectors: ['button:has-text("Confirm")', 'button[type="submit"]'],
    action: "click",
  },

  {
    id: "wait-confirmation-message",
    phase: "phase_one",
    title: "Wait for confirmation",
    icon: CheckCircle2,
    selectors: [
      '[role="alert"]',
      ".alert-success",
      ".success-message",
      "[data-confirmation-message]",
    ],
    action: "wait",
  },

  // ─────────────────────────────────────────────
  // CAPTURE APPOINTMENT DETAILS
  // ─────────────────────────────────────────────

  {
    id: "capture-appointment-details",
    phase: "phase_one",
    title: "Capture appointment details",
    icon: ClipboardCheck,
    selectors: [
      "[data-appointment-details]",
      ".appointment-details",
      ".confirmation-details",
    ],
    action: "capture",
    valueKey: "appointment.details",
  },
];
