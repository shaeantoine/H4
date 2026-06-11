"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Mode } from "@/lib/types";

interface ModeEntry {
  mode: Mode;
  label: string;
  framing: string;
  sample: React.ReactNode;
}

const MODES: ModeEntry[] = [
  {
    mode: "example-first",
    label: "Example-First",
    framing: "Watch the worked examples, then state the rule.",
    sample: (
      <>
        △ <span className="italic">nim</span> ◇ = 6
      </>
    ),
  },
  {
    mode: "rule-first",
    label: "Rule-First",
    framing: "Lead with the rule, then show it in action.",
    sample: <>(A + B) × 2</>,
  },
  {
    mode: "challenge-first",
    label: "Challenge-First",
    framing: "Infer the rule from a handful of true statements.",
    sample: (
      <>
        △ <span className="italic">nim</span> △ = 4 — find the rule.
      </>
    ),
  },
  {
    mode: "visual-first",
    label: "Visual-First",
    framing: "A diagram before any words.",
    sample: <>[△ + ◇] × 2</>,
  },
];

interface Props {
  open: boolean;
  currentMode: Mode;
  onClose: () => void;
}

export function ModePeek({ open, currentMode, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-md cursor-pointer"
          style={{ background: "rgba(6, 4, 13, 0.82)" }}
        >
          <div className="w-full max-w-3xl px-6">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-fg-muted)] mb-6 text-center">
              Same content · Four doorways
            </p>
            <div className="grid grid-cols-2 gap-4">
              {MODES.map(({ mode, label, framing, sample }, i) => {
                const isCurrent = mode === currentMode;
                return (
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`glass p-6 ${
                      isCurrent
                        ? "ring-1 ring-[var(--color-accent)]"
                        : "opacity-70"
                    }`}
                  >
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] mb-3">
                      {label}
                      {isCurrent ? (
                        <span className="text-[var(--color-accent)] normal-case ml-2 tracking-normal">
                          · chosen
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-[var(--color-fg)] leading-relaxed mb-3">
                      {framing}
                    </p>
                    <p className="text-sm text-[var(--color-fg-muted)] glyph">
                      {sample}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-[10px] text-[var(--color-fg-dim)] mt-6 text-center font-mono tracking-wider">
              click anywhere to close
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
