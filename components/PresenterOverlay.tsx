"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/store";

export function PresenterOverlay() {
  const open = useApp((s) => s.presenterMode);
  const phase = useApp((s) => s.phase);
  const events = useApp((s) => s.events);
  const queueLength = useApp((s) => s.observationQueue.length);
  const visibleObservations = useApp((s) => s.visibleObservations);
  const chosenMode = useApp((s) => s.chosenMode);
  const profile = useApp((s) => s.profile);
  const hyp = useApp((s) => s.hypothesis);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-4 right-4 z-[60] w-[280px] p-5 text-[11px] font-mono space-y-4 pointer-events-none rounded-xl border border-[var(--color-stroke-strong)]"
          style={{ background: "rgba(6, 4, 13, 0.85)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between text-[9px] tracking-[0.32em] uppercase text-[var(--color-fg-muted)]">
            <span>Presenter</span>
            <span className="text-[var(--color-fg-dim)]">⌘⇧P</span>
          </div>

          <Row label="Phase" value={phase} />
          <Row label="Events" value={`${events.length}`} />
          <Row
            label="Pacing"
            value={`${visibleObservations.length} shown · ${queueLength} queued`}
          />
          <Row label="Mode" value={chosenMode ?? "—"} />
          <Row
            label="Hypothesis"
            value={hyp ? (hyp.length > 28 ? hyp.slice(0, 28) + "…" : hyp) : "—"}
          />

          <div className="border-t border-[var(--color-stroke)] pt-3 space-y-2">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]">
              Profile
            </p>
            <div className="space-y-1 text-[10px]">
              <Mini label="Velocity" level={profile.learningVelocity.level} />
              <Mini label="Examples" level={profile.exampleDependence.level} />
              <Mini label="Persistence" level={profile.persistence.level} />
              <Mini label="Transfer" level={profile.transferAbility.level} />
            </div>
          </div>

          <div className="border-t border-[var(--color-stroke)] pt-3 space-y-1 text-[var(--color-fg-dim)]">
            <p>
              <span className="text-[var(--color-fg-muted)]">␣</span> advance ·{" "}
              <span className="text-[var(--color-fg-muted)]">⌫</span> rewind
            </p>
            <p>
              <span className="text-[var(--color-fg-muted)]">esc</span> reset ·{" "}
              <span className="text-[var(--color-fg-muted)]">⌘⇧P</span> toggle
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)]">
        {label}
      </span>
      <span className="text-[var(--color-fg)] truncate">{value}</span>
    </div>
  );
}

function Mini({ label, level }: { label: string; level: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-fg-muted)]">{label}</span>
      <span className="text-[var(--color-fg)]">{level}</span>
    </div>
  );
}
