"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/store";

export function Hypothesis() {
  const text = useApp((s) => s.hypothesis);

  return (
    <div className="border-t border-[var(--color-stroke)] pt-4">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] mb-2 font-mono">
        System Hypothesis
      </p>
      <div className="min-h-[42px] flex items-center">
        <AnimatePresence mode="wait">
          {text ? (
            <motion.p
              key={text}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm text-[var(--color-fg)] leading-snug"
            >
              {text}
            </motion.p>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[var(--color-fg-dim)] italic"
            >
              Insufficient signal — watching.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
