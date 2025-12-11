import { LfFrameworkInterface } from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { LfShowcasePlayground } from "../lf-showcase-declarations";

//#region Main Component
/**
 * PlaygroundTemplate renders an lf-shapeeditor playground section.
 * Used by framework pages and can be reused by component pages if needed.
 */
export const PlaygroundTemplate: FunctionalComponent<{
  playground: LfShowcasePlayground;
  manager: LfFrameworkInterface;
  id: string;
}> = ({ playground, manager, id }) => {
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
    <div class={bemClass("playground-template")}>
      <div class={bemClass("playground-template", "description")}>
        {description}
      </div>
      <lf-shapeeditor id={id} {...props} {...eventProps}>
        {prepSlot(manager, slots)}
      </lf-shapeeditor>
    </div>
  );
};
//#endregion

//#region Helpers
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
