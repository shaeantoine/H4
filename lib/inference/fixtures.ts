import type { LearnerEvent } from "../types";

export const EXAMPLE_DRIVEN: LearnerEvent[] = [
  { t: "card_view", cardId: "intro", ms: 4500 },
  { t: "card_view", cardId: "operator-rule", ms: 8200 },
  { t: "hint_open", cardId: "operator-rule" },
  { t: "card_view", cardId: "worked-example", ms: 5400 },
  { t: "answer", qId: "q1", correct: false, latencyMs: 9000, attempt: 1 },
  { t: "answer", qId: "q1", correct: true, latencyMs: 4000, attempt: 2 },
  { t: "answer", qId: "q2", correct: true, latencyMs: 7000, attempt: 1 },
  { t: "answer", qId: "transfer-q1", correct: true, latencyMs: 11000, attempt: 1 },
];

export const FAST_ABSTRACTOR: LearnerEvent[] = [
  { t: "card_view", cardId: "intro", ms: 2800 },
  { t: "card_view", cardId: "operator-rule", ms: 3200 },
  { t: "card_view", cardId: "worked-example", ms: 1900 },
  { t: "answer", qId: "q1", correct: true, latencyMs: 4000, attempt: 1 },
  { t: "answer", qId: "q2", correct: true, latencyMs: 3500, attempt: 1 },
  { t: "answer", qId: "transfer-q1", correct: true, latencyMs: 5000, attempt: 1 },
];

export const PERSISTENT_EXPLORER: LearnerEvent[] = [
  { t: "card_view", cardId: "intro", ms: 6000 },
  { t: "card_view", cardId: "operator-rule", ms: 9500 },
  { t: "followup", qId: "operator-rule", kind: "why" },
  { t: "card_view", cardId: "worked-example", ms: 7800 },
  { t: "hint_open", cardId: "worked-example" },
  { t: "answer", qId: "q1", correct: false, latencyMs: 14000, attempt: 1 },
  { t: "answer", qId: "q1", correct: false, latencyMs: 9000, attempt: 2 },
  { t: "answer", qId: "q1", correct: true, latencyMs: 6000, attempt: 3 },
  { t: "followup", qId: "q1", kind: "what-if" },
  { t: "answer", qId: "transfer-q1", correct: false, latencyMs: 12000, attempt: 1 },
  { t: "answer", qId: "transfer-q1", correct: true, latencyMs: 8000, attempt: 2 },
];
