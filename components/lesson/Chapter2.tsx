"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useApp } from "@/lib/store";
import type { Mode } from "@/lib/types";
import { ModePeek } from "./ModePeek";
import { Quiz, type QuizQuestionData } from "./Quiz";

const MODE_LABEL: Record<Mode, string> = {
  "example-first": "Example-First",
  "rule-first": "Rule-First",
  "challenge-first": "Challenge-First",
  "visual-first": "Visual-First",
};

const OPENING_EYEBROW: Record<Mode, string> = {
  "example-first": "Watching",
  "rule-first": "The Rule",
  "challenge-first": "Infer",
  "visual-first": "Pattern",
};

const PRACTICE_QUESTIONS: QuizQuestionData[] = [
  {
    qId: "ch2-q1",
    prompt: (
      <>
        ⬡ <span className="italic text-[var(--color-fg-muted)] mx-2">nim</span>{" "}
        ◇ = ?
      </>
    ),
    options: [
      { label: "8" },
      { label: "10" },
      { label: "12", correct: true },
      { label: "14" },
    ],
    hint: (
      <>
        Recall: A <span className="italic">nim</span> B = (A + B) × 2.
      </>
    ),
  },
];

interface Props {
  onComplete: () => void;
}

export function Chapter2({ onComplete }: Props) {
  const chosenMode = useApp((s) => s.chosenMode) ?? "example-first";
  const [stage, setStage] = useState<"opening" | "practice">("opening");
  const [peekOpen, setPeekOpen] = useState(false);

  return (
    <div className="relative h-full">
      <ModeBadge
        label={MODE_LABEL[chosenMode]}
        onClick={() => setPeekOpen(true)}
      />

      <AnimatePresence mode="wait">
        {stage === "opening" ? (
          <OpeningSlot
            key={`opening-${chosenMode}`}
            mode={chosenMode}
            onAdvance={() => setStage("practice")}
          />
        ) : (
          <Quiz
            key="practice"
            questions={PRACTICE_QUESTIONS}
            onComplete={onComplete}
          />
        )}
      </AnimatePresence>

      <ModePeek
        open={peekOpen}
        currentMode={chosenMode}
        onClose={() => setPeekOpen(false)}
      />
    </div>
  );
}

function ModeBadge({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute -top-2 right-0 px-3.5 py-1.5 rounded-full border border-[var(--color-stroke)] flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-stroke-strong)] transition-colors z-10 bg-[var(--color-bg-elevated)] backdrop-blur"
      aria-label="View instruction modes"
    >
      Mode:{" "}
      <span className="text-[var(--color-accent)] normal-case tracking-normal">
        {label}
      </span>
      <span className="text-[var(--color-fg-dim)] text-[10px]">⌄</span>
    </button>
  );
}

function OpeningSlot({
  mode,
  onAdvance,
}: {
  mode: Mode;
  onAdvance: () => void;
}) {
  const Body = OPENING_BODIES[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full"
    >
      <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--color-fg-muted)] mb-10">
        Chapter 2 · {OPENING_EYEBROW[mode]}
      </p>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Body />
      </div>

      <div className="mt-10 pt-6 border-t border-[var(--color-stroke)] flex justify-end">
        <button
          onClick={onAdvance}
          className="text-[12px] px-5 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-bg-deep)] font-medium hover:opacity-90 transition-opacity"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}

const OPENING_BODIES: Record<Mode, () => React.ReactNode> = {
  "example-first": () => (
    <div className="space-y-7 max-w-lg">
      <p className="text-base text-[var(--color-fg-muted)]">Watch first.</p>
      <div className="space-y-4 glyph text-lg text-[var(--color-fg)]">
        <p>
          △ <span className="italic text-[var(--color-fg-muted)]">nim</span> ◇ =
          (1 + 2) × 2 = <span className="text-[var(--color-fg-muted)]">6</span>
        </p>
        <p>
          ◇ <span className="italic text-[var(--color-fg-muted)]">nim</span> ✦ =
          (2 + 3) × 2 = <span className="text-[var(--color-fg-muted)]">10</span>
        </p>
      </div>
      <p className="text-sm text-[var(--color-fg-muted)] italic mt-2">
        See the pattern? The rule lands on the next card.
      </p>
    </div>
  ),

  "rule-first": () => (
    <div className="space-y-7 max-w-lg">
      <p className="text-3xl text-[var(--color-fg)] glyph">
        A <span className="italic text-[var(--color-fg-muted)]">nim</span> B
      </p>
      <p className="text-base text-[var(--color-fg-muted)] leading-relaxed">
        Add <span className="text-[var(--color-fg)]">A</span> and{" "}
        <span className="text-[var(--color-fg)]">B</span>, then multiply by 2.
      </p>
      <p className="text-base text-[var(--color-fg-dim)] glyph">(A + B) × 2</p>
    </div>
  ),

  "challenge-first": () => (
    <div className="space-y-7 max-w-lg">
      <p className="text-base text-[var(--color-fg-muted)]">
        These three are true.
      </p>
      <div className="space-y-3 glyph text-lg text-[var(--color-fg)]">
        <p>
          △ <span className="italic text-[var(--color-fg-muted)]">nim</span> △ ={" "}
          <span className="text-[var(--color-fg-muted)]">4</span>
        </p>
        <p>
          △ <span className="italic text-[var(--color-fg-muted)]">nim</span> ◇ ={" "}
          <span className="text-[var(--color-fg-muted)]">6</span>
        </p>
        <p>
          ◇ <span className="italic text-[var(--color-fg-muted)]">nim</span> ✦ ={" "}
          <span className="text-[var(--color-fg-muted)]">10</span>
        </p>
      </div>
      <p className="text-sm text-[var(--color-fg-muted)] italic">
        What is A nim B?
      </p>
    </div>
  ),

  "visual-first": () => (
    <div className="space-y-7 max-w-xl flex flex-col items-center">
      <div className="flex items-center gap-2 glyph">
        <Box>△</Box>
        <Op>+</Op>
        <Box>◇</Box>
        <Op>→</Op>
        <span className="px-3 py-2 border border-[var(--color-stroke)] rounded-md text-[13px] text-[var(--color-fg-muted)] glyph">
          × 2
        </span>
        <Op>=</Op>
        <span className="text-3xl text-[var(--color-fg)] glyph w-10 text-center">
          6
        </span>
      </div>
      <p className="text-sm text-[var(--color-fg-muted)] italic">
        Two glyphs, summed, doubled.
      </p>
    </div>
  ),
};

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 border border-[var(--color-stroke-strong)] rounded-md flex items-center justify-center text-2xl text-[var(--color-fg)]">
      {children}
    </div>
  );
}

function Op({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[var(--color-fg-muted)] text-lg mx-1">
      {children}
    </span>
  );
}
