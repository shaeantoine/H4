"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";

const FLOOR_MS = 800;
const CEILING_MS = 2400;
const STAGGER_MS = 700;
const PROFILE_LAG_MS = 400;

function nextDelay(isStaggered: boolean): number {
  if (isStaggered) return STAGGER_MS + Math.random() * 200;
  return FLOOR_MS + Math.random() * (CEILING_MS - FLOOR_MS);
}

export function PacingController() {
  const queueLength = useApp((s) => s.observationQueue.length);
  const visibleLength = useApp((s) => s.visibleObservations.length);
  const pendingSettle = useApp((s) => s.pendingProfileSettle);
  const release = useApp((s) => s.releaseNextObservation);
  const settle = useApp((s) => s.settleProfileTo);
  const paused = useApp((s) => s.pacingPaused);
  const lastReleaseAtRef = useRef<number>(0);

  useEffect(() => {
    if (paused) return;
    if (queueLength === 0) return;

    const now = Date.now();
    const elapsed = now - lastReleaseAtRef.current;
    const isStaggered = visibleLength > 0 && elapsed < 4000;
    const delay = nextDelay(isStaggered);
    const wait = Math.max(0, delay - elapsed);

    const t = window.setTimeout(() => {
      release();
      lastReleaseAtRef.current = Date.now();
    }, wait);

    return () => window.clearTimeout(t);
  }, [queueLength, visibleLength, release, paused]);

  useEffect(() => {
    if (pendingSettle === null) return;
    const id = pendingSettle;
    const t = window.setTimeout(() => settle(id), PROFILE_LAG_MS);
    return () => window.clearTimeout(t);
  }, [pendingSettle, settle]);

  return null;
}
