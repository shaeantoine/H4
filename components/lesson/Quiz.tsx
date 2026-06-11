"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

export interface QuizOption {
  label: string;
  correct?: boolean;
}

export interface QuizQuestionData {
  qId: string;
  prompt: React.ReactNode;
  options: QuizOption[];
  hint?: React.ReactNode;
}

interface Selection {
  label: string;
  correct: boolean;
}

interface Props {
  questions: QuizQuestionData[];
  onComplete: () => void;
}

export function Quiz({ questions, onComplete }: Props) {
  const emit = useApp((s) => s.emit);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shownAt, setShownAt] = useState(() => Date.now());
  const [attempt, setAttempt] = useState(1);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [followupSent, setFollowupSent] = useState(false);

  const q = questions[currentIndex];

  useEffect(() => {
    setShownAt(Date.now());
    setAttempt(1);
    setSelection(null);
    setHintOpen(false);
    setFollowupSent(false);
  }, [q.qId]);

  function handleAnswer(opt: QuizOption) {
    if (selection) return;
    const correct = !!opt.correct;
    emit({
      t: "answer",
      qId: q.qId,
      correct,
      latencyMs: Date.now() - shownAt,
      attempt,
    });
    setSelection({ label: opt.label, correct });

    if (correct) {
      window.setTimeout(() => {
        setSelection(null);
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          onComplete();
        }
      }, 850);
    } else {
      window.setTimeout(() => {
        setSelection(null);
        setAttempt((a) => a + 1);
      }, 750);
    }
  }

  function handleHint() {
    if (hintOpen) return;
    setHintOpen(true);
    emit({ t: "hint_open", cardId: q.qId });
  }

  function handleFollowup() {
    if (followupSent) return;
    setFollowupSent(true);
    emit({ t: "followup", qId: q.qId, kind: "why" });
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
        Chapter 1 · Quiz · {currentIndex + 1} / {questions.length}
      </p>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.qId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="space-y-10 w-full max-w-md"
          >
            <div className="text-3xl glyph text-[var(--color-fg)]">
              {q.prompt}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isSelected = selection?.label === opt.label;
                const showCorrect = isSelected && selection.correct;
                const showWrong = isSelected && !selection.correct;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selection}
                    className={`p-4 rounded-md border transition-all glyph text-xl ${
                      showCorrect
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-fg)]"
                        : showWrong
                          ? "border-[var(--color-stroke)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] opacity-60"
                          : "border-[var(--color-stroke)] text-[var(--color-fg)] hover:border-[var(--color-stroke-strong)] hover:bg-[var(--color-bg-elevated)] disabled:opacity-40"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {hintOpen && q.hint ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-[var(--color-fg-muted)] italic"
              >
                {q.hint}
              </motion.div>
            ) : null}

            {selection && !selection.correct ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[var(--color-fg-muted)] italic"
              >
                Not quite — try again.
              </motion.p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 pt-6 border-t border-[var(--color-stroke)] flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em]">
        <div className="flex gap-5">
          {q.hint && !hintOpen ? (
            <button
              onClick={handleHint}
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              Need a hint?
            </button>
          ) : null}
          <button
            onClick={handleFollowup}
            disabled={followupSent}
            className="text-[var(--color-fg-dim)] hover:text-[var(--color-fg-muted)] transition-colors disabled:opacity-50"
          >
            {followupSent ? 'Asked "why?"' : 'Ask "why?"'}
          </button>
        </div>
        <span className="text-[var(--color-fg-dim)]">Attempt {attempt}</span>
      </div>
    </motion.div>
  );
}
