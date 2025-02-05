import { LfCardAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfCard } from "./lf-card";

export const prepDebug = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller, elements, handlers } = getAdapter();
  const { refs } = elements;
  const { layouts } = handlers;
  const { blocks, compInstance, defaults, manager, parts, shapes } =
    controller.get;
  const { debug } = defaults;
  const { data, theme } = manager;
  const { decorate } = data.cell.shapes;
  const { bemClass } = theme;
  const { debugLayout } = blocks;

  const { button, code, toggle } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttons = decorate<"LfButton", "button">(
    "button",
    button,
    async (e) => comp.onLfEvent(e, "lf-event"),
    debug.button(),
    layouts.debug.button,
    [(r) => (refs.layouts.debug.button = r)],
  );
  const hasButton = Boolean(buttons?.length);
  const hasButton2 = Boolean(buttons?.length > 1);
  //#endregion

  //#region Code
  const codes = decorate<"LfCode", "code">(
    "code",
    code,
    async (e) => comp.onLfEvent(e, "lf-event"),
    debug.code(),
    layouts.debug.code,
    [(r) => (refs.layouts.debug.code = r)],
  );
  const hasCode = Boolean(codes?.length);
  //#endregion

  //#region Toggle
  const toggles = decorate<"LfToggle", "toggle">(
    "toggle",
    toggle,
    async (e) => comp.onLfEvent(e, "lf-event"),
    debug.toggle(),
    layouts.debug.toggle,
    [(r) => (refs.layouts.debug.toggle = r)],
  );
  const hasToggle = Boolean(toggles?.length);
  //#endregion

  return (
    <div class={bemClass(debugLayout._)} part={parts.debugLayout}>
      {hasToggle && (
        <div class={bemClass(debugLayout._, debugLayout.section1)}>
          {toggles[0]}
        </div>
      )}
      {hasCode && (
        <div class={bemClass(debugLayout._, debugLayout.section2)}>
          {codes[0]}
        </div>
      )}
      {hasButton && (
        <div class={bemClass(debugLayout._, debugLayout.section3)}>
          {buttons[0]}
        </div>
      )}
      {hasButton2 && (
        <div class={bemClass(debugLayout._, debugLayout.section4)}>
          {buttons[1]}
        </div>
      )}
    </div>
  );
};
