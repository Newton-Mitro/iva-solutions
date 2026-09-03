import { User } from "lucide-react";

type Props = {
  userId: string;
  error: string;
  onClose: () => void;
};

export default function DashboardEmpty({ userId, error, onClose }: Props) {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center p-6 text-center">
      <div className="max-w-xs">
        <User size={28} className="mx-auto ivac-text-muted" />

        <h2 className="mt-3 text-sm font-bold">Create your first records</h2>

        <p className="mt-1 text-[10px] leading-4 ivac-text-secondary">
          Add an Applicant and an IVAC Application in Records to start the
          workflow.
        </p>

        {error && <p className="mt-3 text-[10px] ivac-danger">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-bold text-white"
        >
          Open Records
        </button>
      </div>
    </main>
  );
}
