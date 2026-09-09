import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Globe2,
  Laptop2,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import AuthScreen from "./AuthScreen";

type LandingView = "home" | "software" | "developer" | "pricing";
type AuthMode = "signin" | "signup";
type LicenseType = "trial" | "monthly" | "yearly" | "lifetime";

const packages = [
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

export default function LandingPage() {
  const [view, setView] = useState<LandingView>("home");
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
    setMenuOpen(false);
  }

  function navigate(nextView: LandingView) {
    setAuthOpen(false);
    setView(nextView);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="ivac-app site-shell">
      {authOpen ? (
        <AuthScreen initialMode={authMode} onBack={() => setAuthOpen(false)} />
      ) : null}
      {!authOpen && (
        <>
          <header className="site-header">
            <button
              className="brand"
              onClick={() => navigate("home")}
              aria-label="Go to Indian Visa Assistance home"
            >
              <span className="brand-mark">
                <Sparkles size={17} strokeWidth={2.5} />
              </span>
              <span>
                <strong>iva</strong>
                <em>assistance</em>
              </span>
            </button>
            <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
              <button onClick={() => navigate("software")}>সফটওয়্যার</button>
              <button onClick={() => navigate("pricing")}>প্যাকেজ</button>
              <button onClick={() => navigate("developer")}>
                ডেভেলপার সম্পর্কে
              </button>
              <button
                className="mobile-auth-link"
                onClick={() => openAuth("signin")}
              >
                সাইন ইন
              </button>
              <button
                className="mobile-auth-link"
                onClick={() => openAuth("signup")}
              >
                অ্যাকাউন্ট খুলুন
              </button>
            </nav>
            <div className="header-actions">
              <button
                className="text-button"
                onClick={() => openAuth("signin")}
              >
                সাইন ইন
              </button>
              <button className="header-cta" onClick={() => openAuth("signup")}>
                শুরু করুন <ArrowRight size={15} />
              </button>
            </div>
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </header>

          {view === "home" && (
            <>
              <section className="hero-section">
                <div className="hero-copy">
                  <p className="eyebrow">
                    <span /> ভারতীয় ভিসা আবেদন এখন সহজ
                  </p>
                  <h1>
                    কম সময় <i>অপেক্ষায়।</i> বেশি সময় ভ্রমণে।
                  </h1>
                  <p className="hero-description">
                    iva assistance আপনার ভিসা আবেদনকে গুছিয়ে রাখে, নিয়মিত
                    নজরদারি করে এবং পরবর্তী ধাপ পরিষ্কারভাবে দেখায়।
                  </p>
                  <div className="hero-actions">
                    <button
                      className="primary-button"
                      onClick={() => openAuth("signup")}
                    >
                      আপনার workspace খুলুন <ArrowRight size={17} />
                    </button>
                    <button
                      className="quiet-button"
                      onClick={() => navigate("software")}
                    >
                      কীভাবে কাজ করে <span>↘</span>
                    </button>
                  </div>
                  <div className="hero-trust">
                    <div className="avatar-stack">
                      <span>R</span>
                      <span>M</span>
                      <span>A</span>
                      <span>+</span>
                    </div>
                    <span>শান্ত ও পরিষ্কার আবেদন প্রক্রিয়ার জন্য</span>
                  </div>
                </div>
                <div
                  className="hero-visual"
                  aria-label="Application workflow preview"
                >
                  <div className="sun-disc" />
                  <div className="dashboard-preview">
                    <div className="preview-top">
                      <span className="preview-logo">
                        iva <b>assistance</b>
                      </span>
                      <span className="preview-status">
                        <span /> workspace চালু আছে
                      </span>
                    </div>
                    <div className="preview-heading">
                      <div>
                        <small>শুভ সকাল, মায়া</small>
                        <h2>আপনার যাত্রা, গুছানো।</h2>
                      </div>
                      <span className="preview-date">
                        12 JUN
                        <br />
                        <b>2025</b>
                      </span>
                    </div>
                    <div className="progress-line">
                      <span />
                    </div>
                    <div className="preview-metrics">
                      <div>
                        <small>আবেদন</small>
                        <strong>03</strong>
                      </div>
                      <div>
                        <small>চলমান</small>
                        <strong className="orange-number">01</strong>
                      </div>
                      <div>
                        <small>প্রস্তুত</small>
                        <strong>02</strong>
                      </div>
                    </div>
                    <div className="preview-task">
                      <div className="task-icon">
                        <Globe2 size={17} />
                      </div>
                      <div>
                        <small>সক্রিয় আবেদন</small>
                        <strong>ট্যুরিস্ট ভিসা · ভারত</strong>
                        <p>পরবর্তী ধাপ: নথি যাচাই</p>
                      </div>
                      <span className="task-arrow">↗</span>
                    </div>
                    <div className="preview-footer">
                      <span>
                        <Clock3 size={13} /> ২ মিনিট আগে যাচাই হয়েছে
                      </span>
                      <span className="secure-label">
                        <LockKeyhole size={12} /> ব্যক্তিগত workspace
                      </span>
                    </div>
                  </div>
                  <div className="float-note">
                    <span className="check-icon">
                      <Check size={14} />
                    </span>
                    <div>
                      <strong>আরও এক ধাপ এগিয়ে</strong>
                      <small>নথিগুলো সম্পূর্ণ মনে হচ্ছে</small>
                    </div>
                  </div>
                </div>
              </section>
              <section className="signal-row">
                <span>যাদের গন্তব্য আছে, তাদের জন্য</span>
                <span>নজরদারি</span>
                <span>গুছানো</span>
                <span>স্বচ্ছতা</span>
                <span>নিয়ন্ত্রণ</span>
              </section>
              <section className="feature-section" id="software">
                <div className="section-intro">
                  <p className="eyebrow">
                    <span /> আবেদন করার আরও শান্ত উপায়
                  </p>
                  <h2>
                    প্রয়োজনীয় সব সুবিধা।
                    <br />
                    <i>অপ্রয়োজনীয় কিছু নয়।</i>
                  </h2>
                </div>
                <div className="feature-grid">
                  <Feature
                    icon={<BarChart3 />}
                    title="পুরো চিত্র দেখুন"
                    text="একটি workspace থেকেই আবেদন, status এবং পরবর্তী কাজের সব তথ্য দেখুন।"
                  />
                  <Feature
                    icon={<Clock3 />}
                    title="পরিবর্তনের আগে থাকুন"
                    text="আপনি নিজের কাজে ব্যস্ত থাকুন, workflow আপনার আবেদনের দিকে নজর রাখবে।"
                  />
                  <Feature
                    icon={<ShieldCheck />}
                    title="তথ্য থাকুক ব্যক্তিগত"
                    text="আপনার applicant data আপনার account-এই থাকে; privacy এখানে একটি মূল সুবিধা।"
                  />
                </div>
              </section>
              <AuthCallout onOpen={openAuth} />
            </>
          )}

          {view === "software" && (
            <InfoPage
              eyebrow="সফটওয়্যার"
              title={
                <>
                  গুরুত্বপূর্ণ কাগজপত্রের
                  <br />
                  <i>আরও সহজ ছন্দ।</i>
                </>
              }
              onBack={() => navigate("home")}
            >
              <p>
                iva assistance ছড়িয়ে থাকা ভিসা প্রক্রিয়াকে ছোট, পরিষ্কার এবং সহজ
                ধাপে সাজিয়ে দেয়। আবেদন তৈরি করুন, নথি একসঙ্গে রাখুন এবং পরবর্তী
                করণীয় সবসময় জেনে রাখুন।
              </p>
              <div className="info-columns">
                <InfoBlock
                  icon={<Laptop2 />}
                  title="একটি focused workspace"
                  text="আবেদন, profile, workflow ধাপ এবং activity log আলাদা tab নয়, এক জায়গাতেই থাকে।"
                />
                <InfoBlock
                  icon={<Clock3 />}
                  title="নিয়ন্ত্রিত automation"
                  text="বারবার করতে হয় এমন যাচাই automation সামলায়, গুরুত্বপূর্ণ সিদ্ধান্ত থাকে আপনার হাতে।"
                />
                <InfoBlock
                  icon={<ShieldCheck />}
                  title="বিশ্বাসকে কেন্দ্র করে তৈরি"
                  text="workspace default-ভাবেই private; account অনুযায়ী data isolation এবং সহজ controls থাকে।"
                />
              </div>
            </InfoPage>
          )}
          {view === "developer" && (
            <InfoPage
              eyebrow="ডেভেলপার সম্পর্কে"
              title={
                <>
                  এমন একজনের তৈরি,
                  <br />
                  <i>যারও এটি প্রয়োজন ছিল।</i>
                </>
              }
              onBack={() => navigate("home")}
            >
              <p>
                iva assistance একটি independent tool, তৈরি হয়েছে “সব জমা দিয়েছি”
                এবং “এখন নিশ্চিন্ত হতে পারি”-এর মাঝের সময়টির জন্য। এটি
                বাস্তবধর্মী: কম ঝামেলা, বেশি confidence এবং পরবর্তী ধাপের
                পরিষ্কার ধারণা।
              </p>
              <div className="developer-note">
                <div className="developer-avatar">N</div>
                <div>
                  <strong>সমস্যার কাছাকাছি থাকা independent software।</strong>
                  <p>
                    ভ্রমণকারী, পরিবার এবং সীমান্ত পেরোনোর পরিকল্পনায়
                    সহায়তাকারীদের কথা মাথায় রেখে যত্নসহকারে তৈরি।
                  </p>
                </div>
              </div>
            </InfoPage>
          )}
          {view === "pricing" && (
            <InfoPage
              eyebrow="প্যাকেজ কিনুন"
              title={
                <>
                  আপনার প্রয়োজনের
                  <br />
                  <i>শান্তি বেছে নিন।</i>
                </>
              }
              onBack={() => navigate("home")}
            >
              <p>
                আপনার বর্তমান ভ্রমণের জন্য উপযুক্ত workspace দিয়ে শুরু করুন।
                প্রয়োজন হলে বেশি active application এবং support-এর package বেছে
                নিন।
              </p>
              <div className="pricing-grid">
                {packages.map((item) => (
                  <PackageCard
                    key={item.name}
                    {...item}
                    onChoose={() => openAuth("signup")}
                  />
                ))}
              </div>
            </InfoPage>
          )}
        </>
      )}
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-item">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button>
        দেখুন <ArrowRight size={14} />
      </button>
    </article>
  );
}
function InfoBlock({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="info-block">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function InfoPage({
  eyebrow,
  title,
  children,
  onBack,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <section className="info-page">
      <button className="back-link" onClick={onBack}>
        ← overview-এ ফিরুন
      </button>
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h1>{title}</h1>
      <div className="info-content">{children}</div>
    </section>
  );
}

function PackageCard({
  type,
  name,
  price,
  detail,
  features,
  accent,
  onChoose,
}: {
  type: LicenseType;
  name: string;
  price: string;
  detail: string;
  features: string[];
  accent: string;
  onChoose: () => void;
}) {
  const duration =
    type === "trial"
      ? "৭ দিন"
      : type === "monthly"
        ? "৩০ দিন"
        : type === "yearly"
          ? "৩৬৫ দিন"
          : "আজীবন";

  const buttonText =
    type === "trial"
      ? "বিনামূল্যে শুরু করুন"
      : type === "monthly"
        ? "মাসিক প্যাকেজ নিন"
        : type === "yearly"
          ? "বার্ষিক প্যাকেজ নিন"
          : "আজীবন প্যাকেজ নিন";

  return (
    <article className={`package-card ${accent}`}>
      <div className="package-card-header">
        <div className="package-card-title">
          <span className="package-name">{name}</span>

          {type === "yearly" && (
            <span className="package-badge">সেরা সাশ্রয়</span>
          )}
        </div>

        <h3>
          {price}
          <small>{type === "lifetime" ? " / একবার" : ` / ${duration}`}</small>
        </h3>

        <p>{detail}</p>
      </div>

      <div className="package-divider" />

      <div className="package-features">
        <span className="package-features-title">প্যাকেজে যা থাকছে</span>

        <ul>
          {features.map((feature) => (
            <li key={feature}>
              <span className="package-check">
                <Check size={14} strokeWidth={2.5} />
              </span>

              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onChoose}>
        {buttonText}
        <ArrowRight size={15} />
      </button>
    </article>
  );
}

function AuthCallout({ onOpen }: { onOpen: (mode: AuthMode) => void }) {
  return (
    <section className="auth-band" id="auth">
      <div className="auth-band-copy">
        <p className="eyebrow">
          <span /> আপনার পরবর্তী ধাপ
        </p>
        <h2>
          প্রক্রিয়াটি কি
          <br />
          <i>আরও সহজ করবেন?</i>
        </h2>
        <p>
          এক মিনিটেরও কম সময়ে account খুলুন। আপনার workspace প্রস্তুত হয়ে যাবে।
        </p>
        <button className="primary-button" onClick={() => onOpen("signup")}>
          workspace খুলুন <ArrowRight size={17} />
        </button>
      </div>
      <div className="auth-band-side">
        <UserRound size={42} strokeWidth={1.4} />
        <strong>
          নিজের private workspace দিয়ে
          <br />
          শুরু করুন।
        </strong>
        <button className="auth-side-link" onClick={() => onOpen("signin")}>
          account আছে? সাইন ইন করুন
        </button>
      </div>
    </section>
  );
}
