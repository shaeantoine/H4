"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/store";
import {
  EXAMPLE_DRIVEN,
  FAST_ABSTRACTOR,
  PERSISTENT_EXPLORER,
} from "@/lib/inference/fixtures";
import type { LearnerEvent, Phase, Preset } from "@/lib/types";

const PRESET_EVENTS: Record<NonNullable<Preset>, LearnerEvent[]> = {
  "example-driven": EXAMPLE_DRIVEN,
};

const ALL_PRESETS: Record<string, LearnerEvent[]> = {
  "example-driven": EXAMPLE_DRIVEN,
  "fast-abstractor": FAST_ABSTRACTOR,
  "persistent-explorer": PERSISTENT_EXPLORER,
};

const VALID_STAGES: Phase[] = ["ch1", "transition", "ch2", "results"];

export function DemoModeController() {
  const loadEvents = useApp((s) => s.loadEvents);
  const setPhase = useApp((s) => s.setPhase);
  const setDemoPreset = useApp((s) => s.setDemoPreset);
  const setPresenterMode = useApp((s) => s.setPresenterMode);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const run = params.get("run");
    if (run && ALL_PRESETS[run]) {
      loadEvents(ALL_PRESETS[run]);
      if (run in PRESET_EVENTS) {
        setDemoPreset(run as NonNullable<Preset>);
      }
      const stage = params.get("stage");
      if (stage && (VALID_STAGES as string[]).includes(stage)) {
        setPhase(stage as Phase);
      } else {
        setPhase("transition");
      }
    } else {
      const stage = params.get("stage");
      if (stage && (VALID_STAGES as string[]).includes(stage)) {
        setPhase(stage as Phase);
      }
    }

    if (params.get("p") === "1") {
      setPresenterMode(true);
    }

    if (params.get("contrast") === "high") {
      document.documentElement.classList.add("contrast-high");
    }
  }, [loadEvents, setPhase, setDemoPreset, setPresenterMode]);

  return null;
}
