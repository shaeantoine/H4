import { inferProfile } from "@/lib/inference";
import type { LearnerEvent } from "@/lib/types";

/**
 * POST /api/infer
 * Body:    { events: LearnerEvent[] }
 * Returns: { profile: CapabilityProfile }
 *
 * v0: delegates to the local deterministic inferProfile().
 * v1: body becomes a Claude call passing the event log as context, returning
 *     the same CapabilityProfile shape (with non-zero confidence + evidence
 *     fields populated). Callers unchanged.
 */
export async function POST(request: Request) {
  let body: { events?: LearnerEvent[] } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const profile = inferProfile(body.events ?? []);
  return Response.json({ profile });
}
