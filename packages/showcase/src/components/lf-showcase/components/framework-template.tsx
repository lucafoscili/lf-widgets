import { LfFrameworkInterface } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { getAllFrameworkFixtures } from "../helpers/doc.fixtures";
import { LfShowcase } from "../lf-showcase";
import { PlaygroundTemplate } from "./playground-template";

const fixtureCache = new WeakMap<
  LfShowcase,
  Map<string, ReturnType<typeof getAllFrameworkFixtures>>
>();

export const FrameworkTemplate: FunctionalComponent<{
  framework: string;
  showcase: LfShowcase;
  manager: LfFrameworkInterface;
}> = ({ framework, showcase, manager }) => {
  const { bemClass } = manager.theme;

  const { documentation, playground } = getCachedFixtures(
    framework,
    showcase,
    manager,
  );

  return (
    <div class={bemClass("framework-template")}>
      {playground && (
        <PlaygroundTemplate
          playground={playground}
          manager={manager}
          id={`${framework}-playground`}
        />
      )}
      <lf-article
        class={bemClass("framework-template", "documentation")}
        lfDataset={documentation}
      ></lf-article>
    </div>
  );
};

//#region Helpers
const getCachedFixtures = (
  framework: string,
  showcase: LfShowcase,
  manager: LfFrameworkInterface,
) => {
  if (!fixtureCache.has(showcase)) {
    fixtureCache.set(showcase, new Map());
  }
  const managerCache = fixtureCache.get(showcase)!;

  if (!managerCache.has(framework)) {
    managerCache.set(framework, getAllFrameworkFixtures(framework, manager));
  }

  return managerCache.get(framework)!;
};
//#endregion
