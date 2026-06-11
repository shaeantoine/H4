"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ConceptCard } from "./ConceptCard";
import { Quiz, type QuizQuestionData } from "./Quiz";

type Stage = "intro" | "operator-rule" | "worked-example" | "quiz";

const QUIZ_QUESTIONS: QuizQuestionData[] = [
  {
    qId: "q1",
    prompt: (
      <>
        △ <span className="text-[var(--color-fg-muted)] italic mx-2">zor</span>{" "}
        ◇ = ?
      </>
    ),
    options: [
      { label: "3" },
      { label: "4", correct: true },
      { label: "5" },
      { label: "6" },
    ],
    hint: (
      <>
        Recall: A <span className="italic">zor</span> B = (2 × A) + B.
      </>
    ),
  },
  {
    qId: "q2",
    prompt: (
      <>
        ◇ <span className="text-[var(--color-fg-muted)] italic mx-2">zor</span>{" "}
        ✦ = ?
      </>
    ),
    options: [
      { label: "5" },
      { label: "6" },
      { label: "7", correct: true },
      { label: "8" },
    ],
  },
  {
    qId: "transfer-q1",
    prompt: (
      <>
        ✦ <span className="text-[var(--color-fg-muted)] italic mx-2">zor</span>{" "}
        ⬡ = ?
      </>
    ),
    options: [
      { label: "8" },
      { label: "10", correct: true },
      { label: "12" },
      { label: "14" },
    ],
  },
];

interface Props {
  onComplete: () => void;
}

export function Chapter1({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>("intro");

  return (
    <AnimatePresence mode="wait">
      {stage === "intro" ? (
        <ConceptCard
          key="intro"
          cardId="intro"
          eyebrow="Chapter 1 · The Symbols"
          onNext={() => setStage("operator-rule")}
        >
          <div className="space-y-10 max-w-lg">
            <p className="text-base text-[var(--color-fg-muted)] leading-relaxed">
              Four glyphs. Four numbers.
            </p>
            <div className="flex gap-10 justify-center glyph">
              {[
                { g: "△", n: 1 },
                { g: "◇", n: 2 },
                { g: "✦", n: 3 },
                { g: "⬡", n: 4 },
              ].map(({ g, n }) => (
                <div key={g} className="flex flex-col items-center gap-3">
                  <span className="text-5xl text-[var(--color-fg)]">{g}</span>
                  <span className="text-sm text-[var(--color-fg-muted)] font-mono">
                    = {n}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ConceptCard>
      ) : null}

      {stage === "operator-rule" ? (
        <ConceptCard
          key="operator-rule"
          cardId="operator-rule"
          eyebrow="Chapter 1 · The Operator"
          hint={{
            label: "Show worked example",
            content: (
              <div className="space-y-2 glyph text-base">
                <p>
                  △{" "}
                  <span className="italic text-[var(--color-accent)]">zor</span>{" "}
                  ◇ = (2 × 1) + 2
                </p>
                <p className="text-[var(--color-fg-muted)]">= 2 + 2</p>
                <p>= 4 = ⬡</p>
              </div>
            ),
          }}
          onNext={() => setStage("worked-example")}
        >
          <div className="space-y-7 max-w-lg">
            <p className="text-3xl text-[var(--color-fg)] glyph">
              A{" "}
              <span className="text-[var(--color-accent)] italic">zor</span> B
            </p>
            <p className="text-base text-[var(--color-fg-muted)] leading-relaxed">
              Double <span className="text-[var(--color-fg)]">A</span>, then
              add <span className="text-[var(--color-fg)]">B</span>.
            </p>
            <p className="text-base text-[var(--color-fg-dim)] glyph">
              (2 × A) + B
            </p>
          </div>
        </ConceptCard>
      ) : null}

      {stage === "worked-example" ? (
        <ConceptCard
          key="worked-example"
          cardId="worked-example"
          eyebrow="Chapter 1 · Two More"
          isLast
          onNext={() => setStage("quiz")}
        >
          <div className="space-y-6 max-w-lg">
            <p className="text-base text-[var(--color-fg-muted)] mb-6">
              Two more, worked through.
            </p>
            <div className="space-y-4 glyph text-lg text-[var(--color-fg)]">
              <p>
                ◇{" "}
                <span className="italic text-[var(--color-accent)]">zor</span>{" "}
                △ = (2 × 2) + 1 ={" "}
                <span className="text-[var(--color-fg-muted)]">5</span>
              </p>
              <p>
                △{" "}
                <span className="italic text-[var(--color-accent)]">zor</span>{" "}
                ✦ = (2 × 1) + 3 ={" "}
                <span className="text-[var(--color-fg-muted)]">5</span>
              </p>
            </div>
          </div>
        </ConceptCard>
      ) : null}

      {stage === "quiz" ? (
        <Quiz key="quiz" questions={QUIZ_QUESTIONS} onComplete={onComplete} />
      ) : null}
    </AnimatePresence>
  );
}
