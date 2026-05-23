"use client";

import { useEffect } from "react";

const RELOAD_KEY = "kora-chunk-reload";

/**
 * After a new deploy, cached HTML may reference old chunk hashes.
 * Reload once when a chunk fails to load.
 */
export function ChunkRecovery() {
  useEffect(() => {
    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      const msg = event.message ?? "";
      if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) {
        reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const name =
        reason && typeof reason === "object" && "name" in reason
          ? String((reason as { name?: string }).name)
          : "";
      if (name === "ChunkLoadError") reloadOnce();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
