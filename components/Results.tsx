"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import type { CapabilityProfile, Level, LearnerEvent } from "@/lib/types";

const LEVEL_INDEX: Record<Level, number> = {
  Emerging: 1,
  Moderate: 2,
  Strong: 3,
  Exceptional: 4,
};

interface CapabilityMeta {
  key: keyof CapabilityProfile;
  label: string;
  verbByLevel: Partial<Record<Level, string>>;
}

const CAPABILITY_META: CapabilityMeta[] = [
  {
    key: "learningVelocity",
    label: "Learning Velocity",
    verbByLevel: {
      Moderate: "steady pace",
      Strong: "learns fast",
      Exceptional: "rapid acquisition",
    },
  },
  {
    key: "exampleDependence",
    label: "Example Dependence",
    verbByLevel: {
      Moderate: "uses examples",
      Strong: "builds from examples",
      Exceptional: "example-anchored",
    },
  },
  {
    key: "abstractionComfort",
    label: "Abstraction Comfort",
    verbByLevel: {
      Moderate: "comfortable with rules",
      Strong: "leans abstract",
      Exceptional: "rule-first thinker",
    },
  },
  {
    key: "persistence",
    label: "Persistence",
    verbByLevel: {
      Moderate: "recovers",
      Strong: "persists through friction",
      Exceptional: "high-friction tolerance",
    },
  },
  {
    key: "transferAbility",
    label: "Transfer Ability",
    verbByLevel: {
      Moderate: "transfers with prompting",
      Strong: "transfers fast",
      Exceptional: "near-instant transfer",
    },
  },
  {
    key: "curiosity",
    label: "Curiosity",
    verbByLevel: {
      Moderate: "asks questions",
      Strong: "explores beyond",
      Exceptional: "high exploratory drive",
    },
  },
];

const SUGGESTED_DIRECTIONS = [
  "technical problem solving",
  "systems design",
  "research",
  "teaching",
];

function computeScore(events: LearnerEvent[]): {
  percent: number;
  total: number;
} {
  const finalByQ = new Map<string, boolean>();
  for (const e of events) {
    if (e.t === "answer") finalByQ.set(e.qId, e.correct);
  }
  const total = finalByQ.size;
  if (total === 0) return { percent: 0, total: 0 };
  const correct = Array.from(finalByQ.values()).filter(Boolean).length;
  return { percent: Math.round((correct / total) * 100), total };
}

function computeElapsed(events: LearnerEvent[]): string {
  const ms = events.reduce((s, e) => {
    if (e.t === "card_view") return s + e.ms;
    if (e.t === "answer") return s + e.latencyMs;
    return s;
  }, 0);
  const m = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${m}m ${sec.toString().padStart(2, "0")}s`;
}

interface Props {
  onReset: () => void;
}

export function Results({ onReset }: Props) {
  const profile = useApp((s) => s.profile);
  const events = useApp((s) => s.events);
  const { percent } = computeScore(events);
  const elapsed = computeElapsed(events);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto px-6 py-12 lg:py-20 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-20 items-start">
        <Traditional percent={percent} elapsed={elapsed} />
        <Trace profile={profile} />
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 4.2 }}
        onClick={onReset}
        className="absolute bottom-6 right-6 text-[10px] text-[var(--color-fg-dim)] hover:text-[var(--color-fg-muted)] transition-colors font-mono uppercase tracking-[0.18em]"
      >
        ↺ Run again
      </motion.button>
    </motion.div>
  );
}

function Traditional({
  percent,
  elapsed,
}: {
  percent: number;
  elapsed: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 0.55, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4 grayscale"
    >
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-dim)]">
        Traditional Assessment
      </p>
      <p className="text-7xl font-extralight text-[var(--color-fg-muted)] leading-none tracking-tight">
        {percent}%
      </p>
      <p className="text-xs text-[var(--color-fg-dim)] font-mono">{elapsed}</p>
    </motion.div>
  );
}

function Trace({ profile }: { profile: CapabilityProfile }) {
  return (
    <div className="space-y-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)]"
      >
        Learning Trace
      </motion.p>

      <div className="space-y-3.5">
        {CAPABILITY_META.map((meta, i) => (
          <CapabilityRow
            key={meta.key}
            meta={meta}
            cap={profile[meta.key]}
            delay={0.7 + i * 0.12}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl lg:text-[28px] text-[var(--color-fg)] leading-snug font-light pt-2"
      >
        Two people can score 80%.
        <br />
        Only one of them is you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 3.4 }}
        className="space-y-3 pt-2"
      >
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] font-mono">
          Suggested directions
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_DIRECTIONS.map((d, i) => (
            <motion.span
              key={d}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 3.6 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="px-3 py-1.5 rounded-full border border-[var(--color-stroke)] text-[12px] text-[var(--color-fg-muted)] font-mono"
            >
              {d}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CapabilityRow({
  meta,
  cap,
  delay,
}: {
  meta: CapabilityMeta;
  cap: { level: Level };
  delay: number;
}) {
  const filled = LEVEL_INDEX[cap.level];
  const verb = meta.verbByLevel[cap.level];
  const isExceptional = cap.level === "Exceptional";

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-baseline gap-4"
    >
      <span className="text-sm text-[var(--color-fg-muted)] w-44 shrink-0">
        {meta.label}
      </span>

      <div className="flex gap-[3px] shrink-0">
        {[1, 2, 3, 4].map((i) => {
          const active = i <= filled;
          const color = !active
            ? "var(--color-stroke-strong)"
            : isExceptional
              ? "var(--color-accent)"
              : "var(--color-violet)";
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0.4, backgroundColor: color }}
              transition={{ duration: 0.35, delay: delay + i * 0.05 }}
              className="block w-2 h-5 rounded-[2px]"
            />
          );
        })}
      </div>

      <span className="text-[10px] text-[var(--color-fg-dim)] w-[78px] font-mono uppercase tracking-wider shrink-0">
        {cap.level}
      </span>

      {verb ? (
        <span className="text-[12px] text-[var(--color-fg-muted)] italic truncate">
          · {verb}
        </span>
      ) : null}
    </motion.div>
  );
}
