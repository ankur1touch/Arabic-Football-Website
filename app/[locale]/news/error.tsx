"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-slate-100">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-400">
        Try refreshing the page. If the error persists, stop the dev server, run{" "}
        <code className="text-kora-teal">npm run dev:clean</code>, and try again.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
