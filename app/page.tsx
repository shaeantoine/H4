"use client";

import { AnimatePresence } from "framer-motion";
import { AdaptationTransition } from "@/components/lesson/AdaptationTransition";
import { Chapter1 } from "@/components/lesson/Chapter1";
import { Chapter2 } from "@/components/lesson/Chapter2";
import { DemoModeController } from "@/components/DemoModeController";
import { KeyboardCues } from "@/components/KeyboardCues";
import { PacingController } from "@/components/PacingController";
import { PresenterOverlay } from "@/components/PresenterOverlay";
import { Results } from "@/components/Results";
import { TracePanel } from "@/components/trace/TracePanel";
import { useApp } from "@/lib/store";

export default function Home() {
  const phase = useApp((s) => s.phase);
  const setPhase = useApp((s) => s.setPhase);
  const reset = useApp((s) => s.resetSession);
  const isResults = phase === "results";

  return (
    <>
      <DemoModeController />
      <PacingController />
      <KeyboardCues />
      <PresenterOverlay />

      {isResults ? (
        <main className="min-h-screen flex items-center justify-center">
          <Results onReset={reset} />
        </main>
      ) : (
        <main className="min-h-screen p-6 lg:p-10 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          <section className="glass p-10 lg:p-14 min-h-[640px] flex flex-col relative">
            {phase === "ch1" ? (
              <Chapter1 onComplete={() => setPhase("transition")} />
            ) : null}
            {phase === "ch2" ? (
              <Chapter2 onComplete={() => setPhase("results")} />
            ) : null}
          </section>

          <aside className="lg:sticky lg:top-6 self-start">
            <TracePanel />
          </aside>
        </main>
      )}

      <AnimatePresence>
        {phase === "transition" ? (
          <AdaptationTransition
            key="transition"
            onComplete={() => setPhase("ch2")}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
