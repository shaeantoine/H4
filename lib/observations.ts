import type { CapabilityProfile, LearnerEvent } from "./types";
import { countByType } from "./events";

const CARD_LABELS: Record<string, string> = {
  intro: "the symbols",
  "operator-rule": "the operator rule",
  "worked-example": "the worked example",
};

function cardLabel(id: string): string {
  return CARD_LABELS[id] ?? id;
}

function pick<T>(items: T[], index: number): T {
  return items[Math.min(index, items.length - 1)];
}

export function observe(
  event: LearnerEvent,
  prevEvents: LearnerEvent[] = [],
  _prevProfile?: CapabilityProfile,
): string {
  switch (event.t) {
    case "card_view": {
      const isLong = event.ms > 8000;
      const isShort = event.ms > 0 && event.ms < 2500;
      if (!isLong && !isShort) return "";
      const card = cardLabel(event.cardId);
      const seconds = (event.ms / 1000).toFixed(1);

      if (isLong) {
        const longCount = prevEvents.filter(
          (e) => e.t === "card_view" && e.ms > 8000,
        ).length;
        return pick(
          [
            `Lingered ${seconds}s on ${card}.`,
            `Re-reading ${card}.`,
            `Sat with ${card} for ${seconds}s.`,
          ],
          longCount,
        );
      }

      const shortCount = prevEvents.filter(
        (e) => e.t === "card_view" && e.ms > 0 && e.ms < 2500,
      ).length;
      return pick(
        [`Skimmed ${card}.`, `Glanced past ${card}.`],
        shortCount,
      );
    }

    case "hint_open": {
      const hintCount = countByType(prevEvents, "hint_open");
      return pick(
        [
          "Opened the worked example before answering.",
          "Reached for another example.",
          "Wanted to see one more worked through.",
        ],
        hintCount,
      );
    }

    case "answer": {
      if (event.correct && event.attempt === 1) {
        if (event.latencyMs < 5000) {
          return `First-try correct in ${(event.latencyMs / 1000).toFixed(1)}s.`;
        }
        if (event.latencyMs < 10000) {
          return "Answered correctly on first attempt.";
        }
        return "Sat with it, then got it on the first try.";
      }

      if (event.correct && event.attempt > 1) {
        if (event.attempt === 2) {
          return pick(
            [
              "Self-corrected on the next try.",
              "Recovered after one miss.",
            ],
            prevEvents.filter(
              (e) => e.t === "answer" && e.correct && e.attempt > 1,
            ).length,
          );
        }
        return `Recovered after ${event.attempt - 1} misses.`;
      }

      const wrongCount = prevEvents.filter(
        (e) => e.t === "answer" && !e.correct,
      ).length;
      return pick(
        [
          `Missed on attempt ${event.attempt}.`,
          "Wrong answer — retrying.",
          "Off the mark; trying again.",
        ],
        wrongCount,
      );
    }

    case "followup": {
      if (event.kind === "why") return 'Asked "why?".';
      if (event.kind === "what-if") return 'Asked "what if?".';
      return "Asked for another example.";
    }

    case "phase_change":
      return "";
  }
}
