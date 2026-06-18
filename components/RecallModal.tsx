"use client";

import { useState } from "react";
import { HiX } from "react-icons/hi";

interface RecallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (identifier: string) => void;
}

export default function RecallModal({ isOpen, onClose, onVerified }: RecallModalProps) {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const identifier = email;

  const handleSendOtp = () => {
    setError("");
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setSuccessMessage(`Code sent to ${identifier}`);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setError("");
    if (!otp || otp.length < 4) {
      setError("Please enter a valid verification code");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Verified successfully!");
      setTimeout(() => {
        onVerified(identifier);
        handleClose();
      }, 1000);
    }, 1000);
  };

  const handleClose = () => {
    setStep("input");
    setOtp("");
    setError("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "448px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0 }}>
            Track Your Order
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "50%", display: "flex" }}
          >
            <HiX size={20} />
          </button>
        </div>

        {step === "input" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              Track, or Retrieve your saved order using your email address.
            </p>

            {/* Input */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#111827", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>{error}</p>}
            {successMessage && <p style={{ color: "#22c55e", fontSize: "14px", margin: 0 }}>{successMessage}</p>}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              Enter the 6-digit code sent to{" "}
              <span style={{ fontWeight: 600, color: "#111827" }}>{identifier}</span>
            </p>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#111827", marginBottom: "8px" }}>
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "24px",
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: "0.4em",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>{error}</p>}
            {successMessage && <p style={{ color: "#22c55e", fontSize: "14px", margin: 0 }}>{successMessage}</p>}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => { setStep("input"); setOtp(""); setError(""); setSuccessMessage(""); }}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "#2563eb",
                fontWeight: 500,
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Change Email Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}