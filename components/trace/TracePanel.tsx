"use client";

import { useApp } from "@/lib/store";
import { CapabilityBars } from "./CapabilityBars";
import { Hypothesis } from "./Hypothesis";
import { ObservationFeed } from "./ObservationFeed";

export function TracePanel() {
  const eventCount = useApp((s) => s.events.length);

  return (
    <div className="glass p-6 flex flex-col gap-5 h-full">
      <header className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--color-fg-muted)]">
          Learning Trace
          <span className="text-[var(--color-accent)] ml-2">· observing</span>
        </p>
        <span className="text-[10px] text-[var(--color-fg-dim)] font-mono">
          {eventCount} {eventCount === 1 ? "event" : "events"}
        </span>
      </header>

      <section>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] mb-3 font-mono">
          Observations
        </p>
        <ObservationFeed />
      </section>

      <section>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] mb-3 font-mono">
          Capability Signals
        </p>
        <CapabilityBars />
      </section>

      <Hypothesis />
    </div>
  );
}
