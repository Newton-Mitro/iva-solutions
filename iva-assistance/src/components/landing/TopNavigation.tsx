import { ArrowRight, Menu, X } from "lucide-react";
import type { AuthMode, LandingView } from "./landing-data";

export function TopNavigation({
  menuOpen,
  onToggleMenu,
  onNavigate,
  onOpenAuth,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (view: LandingView) => void;
  onOpenAuth: (mode: AuthMode) => void;
}) {
  return (
    <header className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-7 sm:px-8 xl:px-0">
      <button
        className="flex items-center gap-2.5 border-0 bg-transparent text-[var(--app-text)]"
        onClick={() => onNavigate("home")}
        aria-label="Go to Indian Visa Assistance home"
      >
        <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--app-warning)] text-white">
          <span className="text-lg">✦</span>
        </span>
        <span className="text-[18px] tracking-[-0.04em] text-[var(--app-text)]">
          <strong className="text-[25px] tracking-[-0.08em]">iva</strong>
          <em className="ml-1 text-[17px] not-italic tracking-[-0.06em] text-[var(--app-text)]">
            assistance
          </em>
        </span>
      </button>

      <nav
        className={
          menuOpen
            ? "absolute left-4 right-4 top-[86px] z-20 flex flex-col gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-lg lg:static lg:flex lg:flex-row lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
            : "hidden lg:flex lg:items-center lg:gap-8"
        }
      >
        <button
          className="border-0 bg-transparent text-left text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
          onClick={() => onNavigate("software")}
        >
          সফটওয়্যার
        </button>
        <button
          className="border-0 bg-transparent text-left text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
          onClick={() => onNavigate("pricing")}
        >
          প্যাকেজ
        </button>
        <button
          className="border-0 bg-transparent text-left text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
          onClick={() => onNavigate("developer")}
        >
          ডেভেলপার সম্পর্কে
        </button>
        <button
          className="border-0 bg-transparent text-left text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)] lg:hidden"
          onClick={() => onOpenAuth("signin")}
        >
          সাইন ইন
        </button>
        <button
          className="border-0 bg-transparent text-left text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)] lg:hidden"
          onClick={() => onOpenAuth("signup")}
        >
          অ্যাকাউন্ট খুলুন
        </button>
      </nav>

      <div className="hidden items-center gap-6 sm:flex">
        <button
          className="border-0 bg-transparent text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
          onClick={() => onOpenAuth("signin")}
        >
          সাইন ইন
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-[var(--app-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--app-primary-hover)]"
          onClick={() => onOpenAuth("signup")}
        >
          শুরু করুন <ArrowRight size={15} />
        </button>
      </div>

      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] lg:hidden"
        onClick={onToggleMenu}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
    </header>
  );
}
