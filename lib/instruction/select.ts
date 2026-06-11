import type { CapabilityProfile, Mode } from "../types";
import { chooseMode } from "../inference";
import type { InstructionPlan } from "./types";

const EYEBROW_BY_MODE: Record<Mode, string> = {
  "example-first": "Watching",
  "rule-first": "The Rule",
  "challenge-first": "Infer",
  "visual-first": "Pattern",
};

const EXAMPLES_BY_MODE: Record<
  Mode,
  Array<{ setup: string; result: string }>
> = {
  "example-first": [
    { setup: "△ nim ◇", result: "(1 + 2) × 2 = 6" },
    { setup: "◇ nim ✦", result: "(2 + 3) × 2 = 10" },
  ],
  "rule-first": [{ setup: "A nim B", result: "(A + B) × 2" }],
  "challenge-first": [
    { setup: "△ nim △", result: "= 4" },
    { setup: "△ nim ◇", result: "= 6" },
    { setup: "◇ nim ✦", result: "= 10" },
  ],
  "visual-first": [{ setup: "[△ + ◇] × 2", result: "= 6" }],
};

const TRANSFER: { prompt: string } = {
  prompt: "⬡ nim ◇ = ?",
};

/**
 * Select the next instruction plan for a learner.
 *
 * v0: deterministic — profile → mode (via chooseMode) → static plan.
 * v1: same signature; body becomes a Claude call that conditions the
 *     prose fields (introProse, exampleProse, hintProse, transferProse)
 *     on the full profile. Callers unchanged.
 */
export function selectInstruction(
  profile: CapabilityProfile,
  cardId: string,
): InstructionPlan {
  const mode = chooseMode(profile);
  return {
    mode,
    cardId,
    eyebrow: EYEBROW_BY_MODE[mode],
    examples: EXAMPLES_BY_MODE[mode],
    transfer: TRANSFER,
  };
}
