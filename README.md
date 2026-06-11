# H4

> Grades measure what you know. **H4** measures how you learn.

H4 is an implementation prototype of a learner-facing assessment system that
infers a *capability profile* — not from a final score, but from the
moment-to-moment trace of someone working through a problem.

A short interactive lesson on a made-up symbolic operator drives the demo.
While the learner reads, hesitates, asks "why?", retries, and recovers, H4
records typed events, derives observations from them, infers six capability
signals, and adapts the next chapter's instruction to match.

The aim is to demonstrate that a few minutes of structured interaction yields
a more honest read on a learner than a multiple-choice exam — and that the
read can be acted on immediately.

## Branches

- **`main`** — implementation (this branch).
- **[`docs`](https://github.com/shaeantoine/h4/tree/docs)** — proposal,
  presentation, and supporting documentation. Also serves the demo
  presentation via GitHub Pages: <https://shaeantoine.github.io/H4/>.

## Capability signals

| Signal              | What it captures                                      |
| ------------------- | ----------------------------------------------------- |
| Learning velocity   | How quickly correct answers consolidate               |
| Example dependence  | Whether the learner anchors on examples or rules      |
| Abstraction comfort | Tolerance for rule-first framing                      |
| Persistence         | Recovery from misses                                  |
| Transfer ability    | Carrying a rule into a novel surface form             |
| Curiosity           | Reaching past the lesson — *why?*, *what if?*, *more* |

Each signal resolves to a level (`Emerging`, `Moderate`, `Strong`,
`Exceptional`) with a confidence and the event indices it was inferred from,
so any reading can be traced back to the events that produced it.

## Repository layout

```
app/                        Next.js App Router entry
  layout.tsx                Root layout, fonts, metadata
  page.tsx                  Phase router (chapter 1 → adapt → chapter 2 → results)
  api/
    infer/                  Inference endpoint (server)
    instruct/               Instruction-plan endpoint (server)

components/
  DemoModeController.tsx    Demo presets and scripted runs
  PacingController.tsx      Releases observations on a controlled cadence
  PresenterOverlay.tsx      Stage UI for live talks
  KeyboardCues.tsx          Demo keyboard hotkeys
  Results.tsx               End-of-session capability summary
  lesson/                   Chapter cards, quizzes, mode peek, transition
  trace/                    Live trace panel: observations, capability bars, hypothesis

lib/
  types.ts                  Phase, Level, Mode, Capability shapes
  events.ts                 LearnerEvent helpers
  observations.ts           Event → human-readable observation
  store.ts                  Zustand store: phase, events, profile, observations
  inference/                Deterministic rules: events → capability profile → mode
  instruction/              selectInstruction(profile, cardId) → InstructionPlan

scripts/
  check-inference.ts        Sanity-check the rule layer against fixtures
```

## Design

**One source of truth, two consumers.** Every learner action emits a
`LearnerEvent`. The store appends events; everything downstream — the
observation feed, capability bars, hypothesis, and instruction plan — is a
pure function of that event log. Rewinding is a slice. Adapting is a
re-derivation.

**A v0 / v1 boundary that is implementation-only.** `selectInstruction` is
deterministic today. Its return type carries optional prose fields that
components fall back on hand-authored copy when absent. Replacing the rule
implementation with a model call later (filling those prose fields) does not
touch any component — the surface is stable by construction.

**Observation before inference.** The trace panel surfaces *what was
observed* before *what was concluded*. The hypothesis only appears once
enough events have accumulated to make it honest.

## Running the demo

```sh
npm install
npm run dev
```

Then open <http://localhost:3000>. Press `?` to see the demo hotkeys.

## On the name

[John Harrison](https://en.wikipedia.org/wiki/John_Harrison) (1693–1776) was
an English clockmaker who, in 1759, completed the marine chronometer known
as **H4** — a pocket-sized timepiece accurate enough at sea to fix
longitude. The longitude problem had stymied navigators for centuries; the
prevailing view was that a celestial-mechanics solution would never be
matched by mechanical means. H4 was the instrument that quietly closed the
question.

The project takes the name as a reminder: hard measurement problems often
yield not to grander theory but to a precise enough instrument.
