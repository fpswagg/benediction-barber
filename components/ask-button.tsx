"use client";

import type React from "react";

/** Opens the AI assistant (components/assistant.tsx), optionally with a prefilled message. */
export function AskButton({ prefill, className, children }: { prefill?: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("bb:ask", { detail: prefill ?? "" }))} className={className}>
      {children}
    </button>
  );
}
