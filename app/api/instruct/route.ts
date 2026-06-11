import { selectInstruction } from "@/lib/instruction";
import type { CapabilityProfile } from "@/lib/types";

/**
 * POST /api/instruct
 * Body:    { profile: CapabilityProfile, cardId: string }
 * Returns: { plan: InstructionPlan }
 *
 * v0: delegates to the local deterministic selectInstruction().
 * v1: body becomes a Claude call that generates the prose fields
 *     (introProse, exampleProse, hintProse, transferProse) conditioned
 *     on the full profile. Callers unchanged.
 */
export async function POST(request: Request) {
  let body: { profile?: CapabilityProfile; cardId?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (!body.profile || !body.cardId) {
    return Response.json(
      { error: "Required: profile, cardId" },
      { status: 400 },
    );
  }

  const plan = selectInstruction(body.profile, body.cardId);
  return Response.json({ plan });
}
