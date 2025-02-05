import type { LfShowcaseFixture } from "src/components/lf-showcase/lf-showcase-declarations";
import type { LfComponentTag } from "src/types/lf-components";

export const getExamplesKeys = (
  fixtures: LfShowcaseFixture<LfComponentTag>,
) => {
  const examples = fixtures.examples;
  const keys: string[] = [];
  for (const key in examples) {
    const example = examples[key as keyof typeof examples];
    for (const k1 in example) {
      keys.push(key + "-" + k1);
    }
  }

  return keys;
};
