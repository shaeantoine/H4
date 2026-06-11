"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

interface Props {
  cardId: string;
  eyebrow: string;
  hint?: { label: string; content: React.ReactNode };
  onNext: () => void;
  isLast?: boolean;
  children: React.ReactNode;
}

export function ConceptCard({
  cardId,
  eyebrow,
  hint,
  onNext,
  isLast,
  children,
}: Props) {
  const emit = useApp((s) => s.emit);
  const [hintOpen, setHintOpen] = useState(false);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    return () => {
      emit({ t: "card_view", cardId, ms: Date.now() - startedAt });
    };
  }, [cardId, startedAt, emit]);

  function handleHint() {
    if (hintOpen) return;
    setHintOpen(true);
    emit({ t: "hint_open", cardId });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full"
    >
      <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--color-fg-muted)] mb-10">
        {eyebrow}
      </p>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {children}
        {hint && hintOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-md border-t border-[var(--color-stroke)] pt-6"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-fg-muted)] mb-3 font-mono">
              Worked example
            </p>
            <div className="text-[var(--color-fg)] text-base leading-relaxed">
              {hint.content}
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className="mt-10 pt-6 border-t border-[var(--color-stroke)] flex items-center justify-between">
        {hint && !hintOpen ? (
          <button
            onClick={handleHint}
            className="text-[11px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors font-mono uppercase tracking-[0.18em]"
          >
            {hint.label} →
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={onNext}
          className="text-[12px] px-5 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-bg-deep)] font-medium hover:opacity-90 transition-opacity"
        >
          {isLast ? "Begin Quiz" : "Continue"} →
        </button>
      </div>
    </motion.div>
  );
}
