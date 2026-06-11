"use client";

import { create } from "zustand";
import type {
  CapabilityProfile,
  LearnerEvent,
  Mode,
  Phase,
  Preset,
} from "./types";
import { chooseMode, hypothesis, inferProfile } from "./inference";
import { observe } from "./observations";

const EMPTY_PROFILE: CapabilityProfile = {
  learningVelocity: { level: "Emerging", confidence: 0, evidence: [] },
  exampleDependence: { level: "Emerging", confidence: 0, evidence: [] },
  abstractionComfort: { level: "Emerging", confidence: 0, evidence: [] },
  persistence: { level: "Emerging", confidence: 0, evidence: [] },
  transferAbility: { level: "Emerging", confidence: 0, evidence: [] },
  curiosity: { level: "Emerging", confidence: 0, evidence: [] },
};

export interface QueuedObservation {
  id: number;
  text: string;
}

interface AppState {
  phase: Phase;
  cursor: number;
  events: LearnerEvent[];

  observationQueue: QueuedObservation[];
  visibleObservations: QueuedObservation[];
  pendingProfileSettle: number | null;
  pacingPaused: boolean;

  profile: CapabilityProfile;
  hypothesis: string;
  chosenMode: Mode | null;

  demoPreset: Preset;
  presenterMode: boolean;

  emit: (event: LearnerEvent) => void;
  releaseNextObservation: () => void;
  rewindObservation: () => void;
  settleProfileTo: (eventId: number) => void;
  setPacingPaused: (paused: boolean) => void;
  setPhase: (phase: Phase) => void;
  setCursor: (cursor: number) => void;
  setDemoPreset: (preset: Preset) => void;
  setPresenterMode: (on: boolean) => void;
  loadEvents: (events: LearnerEvent[]) => void;
  resetSession: () => void;
}

export const useApp = create<AppState>((set) => ({
  phase: "ch1",
  cursor: 0,
  events: [],

  observationQueue: [],
  visibleObservations: [],
  pendingProfileSettle: null,
  pacingPaused: false,

  profile: EMPTY_PROFILE,
  hypothesis: "",
  chosenMode: null,

  demoPreset: null,
  presenterMode: false,

  emit: (event) =>
    set((state) => {
      const events = [...state.events, event];
      const obsText = observe(event, state.events, state.profile);
      const queueAdd: QueuedObservation[] = obsText
        ? [{ id: events.length - 1, text: obsText }]
        : [];
      return {
        events,
        observationQueue: [...state.observationQueue, ...queueAdd],
      };
    }),

  releaseNextObservation: () =>
    set((state) => {
      if (state.observationQueue.length === 0) return state;
      const [next, ...rest] = state.observationQueue;
      return {
        observationQueue: rest,
        visibleObservations: [...state.visibleObservations, next],
        pendingProfileSettle: next.id,
      };
    }),

  rewindObservation: () =>
    set((state) => {
      if (state.visibleObservations.length === 0) return state;
      const visible = state.visibleObservations;
      const last = visible[visible.length - 1];
      const newVisible = visible.slice(0, -1);
      const newQueue = [last, ...state.observationQueue];

      const priorVisibleId =
        newVisible.length > 0 ? newVisible[newVisible.length - 1].id : -1;
      const eventsToProfile =
        priorVisibleId >= 0 ? state.events.slice(0, priorVisibleId + 1) : [];
      const profile =
        priorVisibleId >= 0 ? inferProfile(eventsToProfile) : EMPTY_PROFILE;

      return {
        visibleObservations: newVisible,
        observationQueue: newQueue,
        pendingProfileSettle: null,
        profile,
        hypothesis: hypothesis(profile, eventsToProfile),
        chosenMode: chooseMode(profile),
      };
    }),

  settleProfileTo: (eventId) =>
    set((state) => {
      const events = state.events.slice(0, eventId + 1);
      const profile = inferProfile(events);
      return {
        profile,
        hypothesis: hypothesis(profile, events),
        chosenMode: chooseMode(profile),
        pendingProfileSettle:
          state.pendingProfileSettle === eventId
            ? null
            : state.pendingProfileSettle,
      };
    }),

  setPacingPaused: (pacingPaused) => set({ pacingPaused }),

  setPhase: (phase) =>
    set((state) => {
      const event: LearnerEvent = {
        t: "phase_change",
        from: state.phase,
        to: phase,
      };
      return { phase, events: [...state.events, event] };
    }),

  setCursor: (cursor) => set({ cursor }),
  setDemoPreset: (demoPreset) => set({ demoPreset }),
  setPresenterMode: (presenterMode) => set({ presenterMode }),

  loadEvents: (events) => {
    const profile = inferProfile(events);
    const obs: QueuedObservation[] = [];
    for (let i = 0; i < events.length; i++) {
      const text = observe(events[i], events.slice(0, i));
      if (text) obs.push({ id: i, text });
    }
    set({
      events,
      observationQueue: [],
      visibleObservations: obs,
      pendingProfileSettle: null,
      profile,
      hypothesis: hypothesis(profile, events),
      chosenMode: chooseMode(profile),
    });
  },

  resetSession: () =>
    set({
      phase: "ch1",
      cursor: 0,
      events: [],
      observationQueue: [],
      visibleObservations: [],
      pendingProfileSettle: null,
      profile: EMPTY_PROFILE,
      hypothesis: "",
      chosenMode: null,
    }),
}));
