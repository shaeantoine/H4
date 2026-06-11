import type { LearnerEvent, EventType, EventOf } from "./types";

export function filterEvents<T extends EventType>(
  events: LearnerEvent[],
  type: T,
): EventOf<T>[] {
  return events.filter((e): e is EventOf<T> => e.t === type);
}

export function countByType(events: LearnerEvent[], type: EventType): number {
  return events.filter((e) => e.t === type).length;
}
