"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/store";

export function KeyboardCues() {
  const release = useApp((s) => s.releaseNextObservation);
  const rewind = useApp((s) => s.rewindObservation);
  const reset = useApp((s) => s.resetSession);
  const setPresenterMode = useApp((s) => s.setPresenterMode);
  const presenterMode = useApp((s) => s.presenterMode);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        release();
      } else if (e.key === "Backspace" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        rewind();
      } else if (e.key === "Escape") {
        e.preventDefault();
        reset();
      } else if (
        (e.key === "p" || e.key === "P") &&
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey
      ) {
        e.preventDefault();
        setPresenterMode(!presenterMode);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [release, rewind, reset, setPresenterMode, presenterMode]);

  return null;
}
