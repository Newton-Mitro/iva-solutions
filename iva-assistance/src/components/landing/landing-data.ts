export type LandingView =
  | "home"
  | "software"
  | "developer"
  | "pricing"
  | "signin"
  | "signup";

export type AuthMode = "signin" | "signup";
export type LicenseType = "trial" | "monthly" | "yearly" | "lifetime";

export const packages = [
  {
    type: "monthly" as LicenseType,
    name: "মাসিক প্যাকেজ",
    price: "৳১,০০০",
    detail: "স্বল্পমেয়াদি বা নিয়মিত ভিসা আবেদনের জন্য উপযুক্ত",
    accent: "featured",
    features: [
      "৩০ দিনের লাইসেন্স",
      "আবেদন ব্যবস্থাপনা",
      "স্বয়ংক্রিয় প্রক্রিয়া পরিচালনা",
      "আবেদনের অগ্রগতি পর্যবেক্ষণ",
      "ব্যক্তিগত ও নিরাপদ ওয়ার্কস্পেস",
    ],
  },
  {
    type: "yearly" as LicenseType,
    name: "বার্ষিক প্যাকেজ",
    price: "৳১১,৫০০",
    detail: "দীর্ঘমেয়াদি ব্যবহারের জন্য সবচেয়ে সাশ্রয়ী প্যাকেজ",
    accent: "dark",
    features: [
      "৩৬৫ দিনের লাইসেন্স",
      "আবেদন ব্যবস্থাপনা",
      "স্বয়ংক্রিয় প্রক্রিয়া পরিচালনা",
      "আবেদনের অগ্রগতি পর্যবেক্ষণ",
      "ব্যক্তিগত ও নিরাপদ ওয়ার্কস্পেস",
    ],
  },
];
