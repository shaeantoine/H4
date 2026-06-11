import type { Mode } from "../types";

/**
 * The contract for "what to show next, in what mode."
 *
 * v0: deterministic. `select.ts` populates `mode`, `eyebrow`, and the
 *     structural example/transfer fields. Prose fields are intentionally
 *     left empty — components fall back to hand-authored copy.
 *
 * v1 (post-funding): an LLM-backed implementation populates the prose
 *     fields conditioned on the learner's profile. Components don't
 *     change — they consume prose when present, fall back when absent.
 *
 * This boundary is what makes the "deterministic rules become a labeled
 * training set the moment we have one" claim verifiable: the swap is
 * implementation-only, not surface.
 */
export interface InstructionPlan {
  mode: Mode;
  cardId: string;

  // Structural — present in both v0 and v1
  eyebrow: string;
  examples: Array<{ setup: string; result: string }>;
  transfer: { prompt: string };

  // Prose fields — empty in v0, generated in v1
  introProse?: string;
  exampleProse?: string;
  transferProse?: string;
  hintProse?: string;
}
