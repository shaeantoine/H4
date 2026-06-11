export type Phase = "ch1" | "transition" | "ch2" | "results";

export type Level = "Emerging" | "Moderate" | "Strong" | "Exceptional";

export type Mode =
  | "example-first"
  | "rule-first"
  | "challenge-first"
  | "visual-first";

export type Preset = "example-driven" | null;

export interface Capability {
  level: Level;
  confidence: number;
  evidence: number[];
}

export interface CapabilityProfile {
  learningVelocity: Capability;
  exampleDependence: Capability;
  abstractionComfort: Capability;
  persistence: Capability;
  transferAbility: Capability;
  curiosity: Capability;
}

export type LearnerEvent =
  | { t: "card_view"; cardId: string; ms: number }
  | { t: "hint_open"; cardId: string }
  | { t: "answer"; qId: string; correct: boolean; latencyMs: number; attempt: number }
  | { t: "followup"; qId: string; kind: "why" | "what-if" | "more" }
  | { t: "phase_change"; from: Phase; to: Phase };

export type EventType = LearnerEvent["t"];

export type EventOf<T extends EventType> = Extract<LearnerEvent, { t: T }>;
