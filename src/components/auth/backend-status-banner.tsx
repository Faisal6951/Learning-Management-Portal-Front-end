"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/feedback";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

export function BackendStatusBanner() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/`, { method: "GET" })
      .then((res) => {
        if (!cancelled) setStatus(res.ok ? "online" : "offline");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking" || status === "online") return null;

  return (
    <Alert variant="destructive" className="mb-4">
      Backend API is not reachable at{" "}
      <strong>{API_URL}</strong>. Start it first: open a terminal in{" "}
      <code className="text-xs">lmp-backend</code> and run{" "}
      <code className="text-xs">node server.js</code>
    </Alert>
  );
}
