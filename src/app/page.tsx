import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--page-bg)" }}>
      <div className="text-center space-y-6">
        <h1 className="font-display text-5xl font-bold" style={{ color: "var(--near-black)" }}>
          Proposal Platform
        </h1>
        <p className="text-lg" style={{ color: "var(--body-grey)" }}>
          Create beautiful proposals. Get them signed.
        </p>
        <SignedIn>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 rounded-full font-bold text-white"
            style={{ background: "var(--coral)" }}
          >
            Go to Dashboard
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              className="inline-block px-8 py-4 rounded-full font-bold text-white"
              style={{ background: "var(--coral)" }}
            >
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </main>
  );
}
