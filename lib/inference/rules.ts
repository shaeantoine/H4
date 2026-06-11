import type { Capability, Level, LearnerEvent } from "../types";
import { filterEvents } from "../events";

const empty = (): Capability => ({
  level: "Emerging",
  confidence: 0,
  evidence: [],
});

export function rule_learningVelocity(events: LearnerEvent[]): Capability {
  const answers = filterEvents(events, "answer");
  if (answers.length === 0) return empty();

  const meanLatencyMs =
    answers.reduce((s, a) => s + a.latencyMs, 0) / answers.length;
  const firstTryCorrect = answers.filter(
    (a) => a.attempt === 1 && a.correct,
  ).length;
  const firstTryRate = firstTryCorrect / answers.length;

  let level: Level = "Emerging";
  if (meanLatencyMs < 8000 && firstTryRate > 0.66) level = "Exceptional";
  else if (meanLatencyMs < 12000 && firstTryRate > 0.5) level = "Strong";
  else if (meanLatencyMs < 18000 || firstTryRate > 0.4) level = "Moderate";

  return {
    level,
    confidence: Math.min(1, answers.length / 3),
    evidence: [],
  };
}

export function rule_exampleDependence(events: LearnerEvent[]): Capability {
  const cards = filterEvents(events, "card_view");
  const hints = filterEvents(events, "hint_open");
  if (cards.length === 0) return empty();

  const ratio = hints.length / cards.length;
  let level: Level = "Emerging";
  if (ratio >= 0.5) level = "Exceptional";
  else if (ratio >= 0.3) level = "Strong";
  else if (ratio >= 0.15) level = "Moderate";

  return {
    level,
    confidence: Math.min(1, cards.length / 3),
    evidence: [],
  };
}

export function rule_abstractionComfort(events: LearnerEvent[]): Capability {
  const cards = filterEvents(events, "card_view");
  const hints = filterEvents(events, "hint_open");
  const answers = filterEvents(events, "answer");
  if (cards.length === 0 || answers.length === 0) return empty();

  const hintRatio = hints.length / cards.length;
  const correctRate =
    answers.filter((a) => a.correct).length / answers.length;

  let level: Level = "Emerging";
  if (hintRatio === 0 && correctRate === 1) level = "Exceptional";
  else if (hintRatio < 0.15 && correctRate >= 0.8) level = "Strong";
  else if (hintRatio < 0.3 && correctRate >= 0.6) level = "Moderate";

  return {
    level,
    confidence: Math.min(1, cards.length / 3),
    evidence: [],
  };
}

export function rule_persistence(events: LearnerEvent[]): Capability {
  const answers = filterEvents(events, "answer");
  if (answers.length === 0) return empty();

  const byQ = new Map<string, typeof answers>();
  for (const a of answers) {
    const list = byQ.get(a.qId) ?? [];
    list.push(a);
    byQ.set(a.qId, list);
  }

  const recoveries: number[] = [];
  for (const [, attempts] of byQ) {
    const sorted = [...attempts].sort((x, y) => x.attempt - y.attempt);
    const eventuallyCorrect = sorted.some((a) => a.correct);
    const maxAttempt = Math.max(...sorted.map((a) => a.attempt));
    if (eventuallyCorrect && maxAttempt > 1) recoveries.push(maxAttempt);
  }

  if (recoveries.length === 0) {
    const anyFailure = answers.some((a) => !a.correct);
    return {
      level: anyFailure ? "Emerging" : "Moderate",
      confidence: 0.4,
      evidence: [],
    };
  }

  const avgRecovery =
    recoveries.reduce((s, r) => s + r, 0) / recoveries.length;
  let level: Level = "Moderate";
  if (avgRecovery >= 3) level = "Exceptional";
  else if (avgRecovery >= 2) level = "Strong";

  return {
    level,
    confidence: Math.min(1, recoveries.length / 2),
    evidence: [],
  };
}

export function rule_transferAbility(events: LearnerEvent[]): Capability {
  const answers = filterEvents(events, "answer");
  const transferAnswers = answers.filter((a) => a.qId.startsWith("transfer-"));
  if (transferAnswers.length === 0) return empty();

  const byQ = new Map<string, typeof transferAnswers>();
  for (const a of transferAnswers) {
    const list = byQ.get(a.qId) ?? [];
    list.push(a);
    byQ.set(a.qId, list);
  }

  let firstTryCorrect = 0;
  let eventuallyCorrect = 0;
  for (const [, attempts] of byQ) {
    const sorted = [...attempts].sort((x, y) => x.attempt - y.attempt);
    if (sorted[0].correct) firstTryCorrect++;
    else if (sorted.some((a) => a.correct)) eventuallyCorrect++;
  }

  let level: Level = "Emerging";
  const total = byQ.size;
  if (firstTryCorrect === total) level = "Exceptional";
  else if (firstTryCorrect + eventuallyCorrect === total) level = "Strong";
  else if (firstTryCorrect + eventuallyCorrect > 0) level = "Moderate";

  return {
    level,
    confidence: Math.min(1, total / 2),
    evidence: [],
  };
}

export function rule_curiosity(events: LearnerEvent[]): Capability {
  const followups = filterEvents(events, "followup");
  const cards = filterEvents(events, "card_view");
  if (followups.length === 0 && cards.length === 0) return empty();

  const dwells = cards.map((c) => c.ms).sort((a, b) => a - b);
  const median =
    dwells.length > 0 ? dwells[Math.floor(dwells.length / 2)] : 0;

  let level: Level = "Emerging";
  if (followups.length >= 2 || (followups.length >= 1 && median > 6000))
    level = "Strong";
  else if (followups.length >= 1 || median > 8000) level = "Moderate";

  return {
    level,
    confidence: Math.min(1, (followups.length + cards.length) / 4),
    evidence: [],
  };
}
