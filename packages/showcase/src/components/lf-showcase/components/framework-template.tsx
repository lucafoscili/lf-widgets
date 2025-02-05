import { LfCoreInterface } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { getFrameworkFixtures } from "../helpers/doc.fixtures";
import { LfShowcase } from "../lf-showcase";

const fixtureCache = new WeakMap<
  LfShowcase,
  Map<string, ReturnType<typeof getFrameworkFixtures>>
>();

export const FrameworkTemplate: FunctionalComponent<{
  framework: string;
  showcase: LfShowcase;
  manager: LfCoreInterface;
}> = ({ framework, showcase, manager }) => {
  const { bemClass } = manager.theme;

  const { documentation } = getCachedFixtures(framework, showcase);

  return (
    <div class={bemClass("framework-template")}>
      <lf-article
        class={bemClass("framework-template", "documentation")}
        lfDataset={documentation}
      ></lf-article>
    </div>
  );
};

//#region Helpers
const getCachedFixtures = (framework: string, showcase: LfShowcase) => {
  if (!fixtureCache.has(showcase)) {
    fixtureCache.set(showcase, new Map());
  }
  const managerCache = fixtureCache.get(showcase)!;

  if (!managerCache.has(framework)) {
    managerCache.set(framework, getFrameworkFixtures(framework));
  }

  return managerCache.get(framework)!;
};
//#endregion
