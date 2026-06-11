"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import type { Mode } from "@/lib/types";

const MODE_LABEL: Record<Mode, string> = {
  "example-first": "Example-First",
  "rule-first": "Rule-First",
  "challenge-first": "Challenge-First",
  "visual-first": "Visual-First",
};

const STAGE_BREAK_MS = 1100;
const TOTAL_MS = 2400;

interface Props {
  onComplete: () => void;
}

export function AdaptationTransition({ onComplete }: Props) {
  const chosenMode = useApp((s) => s.chosenMode);
  const [stage, setStage] = useState<"adapting" | "revealed">("adapting");

  useEffect(() => {
    const t1 = window.setTimeout(
      () => setStage("revealed"),
      STAGE_BREAK_MS,
    );
    const t2 = window.setTimeout(onComplete, TOTAL_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 50%, var(--color-violet-dim), transparent 65%), var(--color-bg-deep)",
      }}
    >
      <AnimatePresence mode="wait">
        {stage === "adapting" ? (
          <motion.div
            key="adapting"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)] mb-5">
              Learning Trace
            </p>
            <p className="text-2xl text-[var(--color-fg)] font-light leading-relaxed">
              Adapting Chapter 2 to your profile
              <DotPulse />
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-md px-6"
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)] mb-5">
              Instruction Mode
            </p>
            <p className="text-4xl text-[var(--color-fg)] font-medium tracking-tight">
              {chosenMode ? MODE_LABEL[chosenMode] : MODE_LABEL["visual-first"]}
            </p>
            <p className="text-sm text-[var(--color-fg-muted)] mt-3 italic">
              chosen because of you
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DotPulse() {
  return (
    <span className="inline-flex gap-[3px] ml-2 align-middle">
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
          className="text-[var(--color-accent)]"
        >
          ·
        </motion.span>
      ))}
    </span>
  );
}
