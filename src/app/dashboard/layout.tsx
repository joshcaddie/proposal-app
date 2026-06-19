import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--page-bg)" }}>
      <nav className="sticky top-0 z-50 border-b" style={{ background: "#fff", borderColor: "var(--hairline)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-display font-bold text-lg" style={{ color: "var(--near-black)" }}>
            Proposals
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/proposals/new"
              className="px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{ background: "var(--coral)" }}
            >
              + New proposal
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
