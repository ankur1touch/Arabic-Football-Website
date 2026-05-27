"use client";

import { useEffect } from "react";

const RELOAD_KEY = "kora-chunk-reload";

function isChunkLoadFailure(reason: unknown): boolean {
  if (!reason) return false;
  const name =
    typeof reason === "object" && reason !== null && "name" in reason
      ? String((reason as { name?: string }).name)
      : "";
  const message =
    typeof reason === "object" && reason !== null && "message" in reason
      ? String((reason as { message?: string }).message)
      : String(reason);
  return (
    name === "ChunkLoadError" ||
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to load chunk")
  );
}

/**
 * After a new deploy or stale dev server, cached HTML may reference old chunk hashes.
 * Hard-reload once when a chunk fails to load.
 */
export function ChunkRecovery() {
  useEffect(() => {
    // Page loaded successfully — allow one future chunk-recovery reload
    const timer = setTimeout(() => {
      sessionStorage.removeItem(RELOAD_KEY);
    }, 4000);

    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      const url = new URL(window.location.href);
      url.searchParams.set("_chunk", String(Date.now()));
      window.location.replace(url.toString());
    };

    const onError = (event: ErrorEvent) => {
      if (isChunkLoadFailure(event.error ?? event.message)) {
        reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadFailure(event.reason)) {
        reloadOnce();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
