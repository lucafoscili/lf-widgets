import { LfFrameworkInterface } from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { getAllFrameworkFixtures } from "../helpers/doc.fixtures";
import { LfShowcase } from "../lf-showcase";
import { LfShowcasePlayground } from "../lf-showcase-declarations";

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
      {playground && prepPlayground(playground, manager, framework)}
      <lf-article
        class={bemClass("framework-template", "documentation")}
        lfDataset={documentation}
      ></lf-article>
    </div>
  );
};

//#region Playground
const prepPlayground = (
  playground: LfShowcasePlayground,
  manager: LfFrameworkInterface,
  framework: string,
): VNode => {
  const { bemClass } = manager.theme;
  const { description, props, events, slots } = playground;

  const eventProps = events
    ? Object.fromEntries(
        Object.entries(events).map(([key, handler]) => [
          `on${key.charAt(0).toUpperCase() + key.slice(1)}`,
          handler,
        ]),
      )
    : {};

  return (
    <div class={bemClass("framework-template", "playground")}>
      <div class={bemClass("framework-template", "playground-description")}>
        {description}
      </div>
      <lf-shapeeditor
        id={`${framework}-playground`}
        {...(props as any)}
        {...eventProps}
      >
        {prepSlot(manager, slots)}
      </lf-shapeeditor>
    </div>
  );
};

const prepSlot = (
  manager: LfFrameworkInterface,
  slots: string[] = [],
): VNode[] => {
  const { bemClass } = manager.theme;

  if (slots?.length) {
    return slots.map((name) => {
      if (name === "glass-surface") {
        return (
          <div class={bemClass("example", "glass-surface")} slot={name}></div>
        );
      } else {
        return (
          <div class={bemClass("example", "simple-slot")} slot={name}>
            Simple slot
          </div>
        );
      }
    });
  }

  return [];
};
//#endregion

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
