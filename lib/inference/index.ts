import type {
  CapabilityProfile,
  LearnerEvent,
  Level,
  Mode,
} from "../types";
import {
  rule_learningVelocity,
  rule_exampleDependence,
  rule_abstractionComfort,
  rule_persistence,
  rule_transferAbility,
  rule_curiosity,
} from "./rules";

export function inferProfile(events: LearnerEvent[]): CapabilityProfile {
  return {
    learningVelocity: rule_learningVelocity(events),
    exampleDependence: rule_exampleDependence(events),
    abstractionComfort: rule_abstractionComfort(events),
    persistence: rule_persistence(events),
    transferAbility: rule_transferAbility(events),
    curiosity: rule_curiosity(events),
  };
}

const RANK: Record<Level, number> = {
  Emerging: 0,
  Moderate: 1,
  Strong: 2,
  Exceptional: 3,
};

export function chooseMode(profile: CapabilityProfile): Mode {
  const ex = RANK[profile.exampleDependence.level];
  const abs = RANK[profile.abstractionComfort.level];
  const trans = RANK[profile.transferAbility.level];
  const cur = RANK[profile.curiosity.level];

  if (ex >= 2) return "example-first";
  if (trans >= 2 && cur >= 2) return "challenge-first";
  if (abs >= 2 && ex <= 1) return "rule-first";
  return "visual-first";
}

export function hypothesis(
  profile: CapabilityProfile,
  events: LearnerEvent[],
): string {
  const answerCount = events.filter((e) => e.t === "answer").length;
  if (answerCount < 3) return "";

  const ex = RANK[profile.exampleDependence.level];
  const pers = RANK[profile.persistence.level];
  const abs = RANK[profile.abstractionComfort.level];
  const cur = RANK[profile.curiosity.level];
  const trans = RANK[profile.transferAbility.level];
  const velo = RANK[profile.learningVelocity.level];

  // Two-trait templates (most specific first)
  if (cur >= 2 && pers >= 2)
    return "Curious explorer. Recovers fast from uncertainty.";
  if (ex >= 2 && pers >= 2)
    return "Builds from concrete examples. Persists through friction.";
  if (abs >= 2 && trans >= 2)
    return "Comfortable with abstraction. Fast to transfer.";
  if (velo >= 3 && trans >= 3)
    return "Rapid acquisition. Sees the structure early.";

  // Single-trait fallbacks
  if (ex >= 2) return "Anchors to examples before abstract rules.";
  if (abs >= 2) return "Jumps to the rule itself; uses examples sparingly.";
  if (cur >= 2) return "Explores beyond the lesson.";
  if (pers >= 2) return "Persistent through the rough patches.";

  return "";
}
