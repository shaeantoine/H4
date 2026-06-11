"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

const VISIBLE_LIMIT = 6;
const TYPE_SPEED_MS = 50;

function ObservationLine({
  id,
  text,
  isNewest,
}: {
  id: number;
  text: string;
  isNewest: boolean;
}) {
  const [displayed, setDisplayed] = useState(isNewest ? "" : text);

  useEffect(() => {
    if (!isNewest) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = window.setInterval(() => {
      i++;
      if (i > text.length) {
        window.clearInterval(interval);
        return;
      }
      setDisplayed(text.slice(0, i));
    }, TYPE_SPEED_MS);
    return () => window.clearInterval(interval);
  }, [id, text, isNewest]);

  return (
    <span>
      {displayed}
      {isNewest && displayed.length < text.length ? (
        <span className="inline-block w-[2px] h-[0.9em] align-[-2px] ml-[1px] bg-[var(--color-accent)] animate-pulse" />
      ) : null}
    </span>
  );
}

export function ObservationFeed() {
  const visible = useApp((s) => s.visibleObservations);
  const queueLength = useApp((s) => s.observationQueue.length);
  const recent = visible.slice(-VISIBLE_LIMIT).reverse();
  const newestId = visible.length > 0 ? visible[visible.length - 1].id : -1;
  const startIndex = Math.max(0, visible.length - VISIBLE_LIMIT);

  return (
    <div className="min-h-[180px]">
      {visible.length === 0 ? (
        <p className="text-sm text-[var(--color-fg-dim)] italic">
          Watching for behavioral signal…
        </p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {recent.map((obs, i) => (
              <motion.li
                key={obs.id}
                layout
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{
                  opacity: Math.max(0.35, 1 - i * 0.13),
                  x: 0,
                  height: "auto",
                }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-[13px] leading-snug text-[var(--color-fg)] flex gap-2"
              >
                <span className="text-[var(--color-accent)] mt-[2px]">·</span>
                <ObservationLine
                  id={obs.id}
                  text={obs.text}
                  isNewest={obs.id === newestId}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {queueLength > 0 ? (
        <p className="mt-3 text-[10px] text-[var(--color-fg-dim)] font-mono tracking-wider">
          {queueLength} pending · press space to advance
        </p>
      ) : null}
    </div>
  );
}
