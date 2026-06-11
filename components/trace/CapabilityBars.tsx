"use client";

import { motion } from "framer-motion";
import type { CapabilityProfile, Level } from "@/lib/types";
import { useApp } from "@/lib/store";

const CAPABILITIES: Array<{
  key: keyof CapabilityProfile;
  label: string;
}> = [
  { key: "learningVelocity", label: "Learning Velocity" },
  { key: "exampleDependence", label: "Example Dependence" },
  { key: "abstractionComfort", label: "Abstraction Comfort" },
  { key: "persistence", label: "Persistence" },
  { key: "transferAbility", label: "Transfer Ability" },
  { key: "curiosity", label: "Curiosity" },
];

const LEVEL_INDEX: Record<Level, number> = {
  Emerging: 1,
  Moderate: 2,
  Strong: 3,
  Exceptional: 4,
};

export function CapabilityBars() {
  const profile = useApp((s) => s.profile);

  return (
    <div className="space-y-2.5">
      {CAPABILITIES.map(({ key, label }) => {
        const cap = profile[key];
        const filled = LEVEL_INDEX[cap.level];
        const isExceptional = cap.level === "Exceptional";

        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-[11px] text-[var(--color-fg-muted)] flex-1 truncate">
              {label}
            </span>
            <div className="flex gap-[3px]">
              {[1, 2, 3, 4].map((i) => {
                const active = i <= filled;
                const color = !active
                  ? "var(--color-stroke-strong)"
                  : isExceptional
                    ? "var(--color-accent)"
                    : "var(--color-violet)";
                return (
                  <motion.span
                    key={i}
                    className="block w-1.5 h-4 rounded-[2px]"
                    initial={false}
                    animate={{
                      backgroundColor: color,
                      opacity: active ? 1 : 0.4,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-[var(--color-fg-dim)] w-[78px] text-right font-mono uppercase tracking-wider">
              {cap.level}
            </span>
          </div>
        );
      })}
    </div>
  );
}
