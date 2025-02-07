import { LfComponentTag } from "@lf-widgets/foundations/foundations";
import { LfShowcaseComponentFixture } from "src/components/lf-showcase/lf-showcase-declarations";

export const getExamplesKeys = (
  fixtures: LfShowcaseComponentFixture<LfComponentTag>,
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
