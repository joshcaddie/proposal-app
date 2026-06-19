"use client";
import { useState } from "react";

interface Props {
  token: string;
  clientName: string;
  agencyName: string;
  isAccepted: boolean;
  isExpired: boolean;
  acceptanceName?: string;
  acceptanceDate?: string;
}

export default function AcceptancePanel({ token, clientName, agencyName, isAccepted, isExpired, acceptanceName, acceptanceDate }: Props) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(isAccepted);
  const [displayName, setDisplayName] = useState(acceptanceName || "");
  const [displayDate, setDisplayDate] = useState(acceptanceDate || "");
  const [error, setError] = useState("");

  async function handleAccept() {
    if (!name.trim() || !signature.trim()) {
      setError("Please add a name and signature to accept.");
      return;
    }
    setError("");
    setSubmitting(true);
    const res = await fetch(`/api/proposals/${token}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, position, signatureText: signature, signedDate: date || new Date().toLocaleDateString("en-NZ") }),
    });
    const data = await res.json();
    if (res.ok) {
      setAccepted(true);
      setDisplayName(data.fullName);
      setDisplayDate(data.signedDate);
    } else {
      setError(data.error || "Something went wrong.");
    }
    setSubmitting(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #dcd8d5",
    borderRadius: 11,
    background: "#fcfbfa",
    fontFamily: "Manrope, sans-serif",
    fontSize: 15,
    color: "#20252a",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div style={{ border: "1px solid #ece9e7", borderRadius: 18, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "var(--ink)", padding: "26px 36px" }}>
        <div className="font-mono-accent" style={{ fontSize: 13, color: "var(--coral)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
          06 · ACCEPTANCE
        </div>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>
          Approve &amp; sign.
        </h2>
      </div>

      {/* Body */}
      <div style={{ padding: "34px 36px" }}>
        {isExpired ? (
          <div style={{ padding: "16px 20px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
            <p style={{ color: "#b91c1c", fontWeight: 600, margin: 0 }}>This proposal has expired.</p>
          </div>
        ) : accepted ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 12, background: "#e8f5ef", border: "1px solid #a7d7bc" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "var(--success)", color: "#fff", fontWeight: 700, fontSize: 14 }}>✓</span>
            <p style={{ color: "var(--success)", fontWeight: 600, margin: 0 }}>
              Accepted by {displayName} on {displayDate}.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 15.5, color: "#555c61", marginBottom: 24, lineHeight: 1.6 }}>
              By signing below, <strong>{clientName}</strong> accepts this proposal and authorises <strong>{agencyName}</strong> to begin work as outlined above. All prices are in NZD and exclude GST.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px", marginBottom: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7177", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Full name</label>
                <input style={inputStyle} type="text" placeholder="Type full name" value={name} onChange={e => { setName(e.target.value); setError(""); }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7177", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Position</label>
                <input style={inputStyle} type="text" placeholder="e.g. Director" value={position} onChange={e => setPosition(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7177", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Signature</label>
                <input
                  style={{ ...inputStyle, border: "none", borderBottom: "2px solid #c9c4c0", borderRadius: 0, background: "transparent", fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic", fontSize: 26, padding: "8px 0" }}
                  type="text"
                  placeholder="Type name to sign"
                  value={signature}
                  onChange={e => { setSignature(e.target.value); setError(""); }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7177", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Date</label>
                <input style={inputStyle} type="text" placeholder="DD / MM / YYYY" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>

            {error && <p style={{ color: "#d8473b", fontSize: 14, marginBottom: 16 }}>{error}</p>}

            <button
              onClick={handleAccept}
              disabled={submitting}
              style={{ background: submitting ? "#a8a3a0" : "var(--coral)", color: "#fff", padding: "15px 30px", borderRadius: 999, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 15, border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Submitting…" : "Accept proposal"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
