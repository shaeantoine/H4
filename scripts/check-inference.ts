import { inferProfile, chooseMode, hypothesis } from "../lib/inference";
import {
  EXAMPLE_DRIVEN,
  FAST_ABSTRACTOR,
  PERSISTENT_EXPLORER,
} from "../lib/inference/fixtures";

// Hand-traced expected outputs (sandbox can't run this script, so verified by inspection):
//
// Example-Driven:
//   learningVelocity:   Moderate     exampleDependence:  Strong
//   abstractionComfort: Emerging     persistence:        Strong
//   transferAbility:    Exceptional  curiosity:          Emerging
//   → mode: example-first
//   → hypothesis: "Builds from concrete examples. Persists through friction."
//
// Fast Abstractor:
//   learningVelocity:   Exceptional  exampleDependence:  Emerging
//   abstractionComfort: Exceptional  persistence:        Moderate
//   transferAbility:    Exceptional  curiosity:          Emerging
//   → mode: rule-first
//   → hypothesis: "Comfortable with abstraction. Fast to transfer."
//
// Persistent Explorer:
//   learningVelocity:   Moderate     exampleDependence:  Strong
//   abstractionComfort: Emerging     persistence:        Strong
//   transferAbility:    Strong       curiosity:          Strong
//   → mode: example-first
//   → hypothesis: "Curious explorer. Recovers fast from uncertainty."

const fixtures = [
  { name: "Example-Driven", events: EXAMPLE_DRIVEN },
  { name: "Fast Abstractor", events: FAST_ABSTRACTOR },
  { name: "Persistent Explorer", events: PERSISTENT_EXPLORER },
];

for (const { name, events } of fixtures) {
  const profile = inferProfile(events);
  const mode = chooseMode(profile);
  const hyp = hypothesis(profile, events);
  console.log(`\n=== ${name} ===`);
  for (const [key, cap] of Object.entries(profile)) {
    console.log(
      `  ${key.padEnd(22)} ${cap.level.padEnd(12)} (conf ${cap.confidence.toFixed(2)})`,
    );
  }
  console.log(`  → mode:       ${mode}`);
  console.log(`  → hypothesis: ${hyp || "(none — insufficient signal)"}`);
}
