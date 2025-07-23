"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "16px" }}
      >
        Try again
      </button>
    </div>
  );
}
