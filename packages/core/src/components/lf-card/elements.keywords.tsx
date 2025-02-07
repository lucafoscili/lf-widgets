import { LfButtonEventPayload, LfCardAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfCard } from "./lf-card";

export const prepKeywords = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller, elements, handlers } = getAdapter();
  const { refs } = elements;
  const { layouts } = handlers;
  const { blocks, compInstance, defaults, manager, parts, shapes } =
    controller.get;
  const { keywords } = defaults;
  const { data, theme } = manager;
  const { decorate } = data.cell.shapes;
  const { bemClass } = theme;
  const { keywordsLayout } = blocks;

  const { button, chart, chip } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttonCb = (e: CustomEvent<LfButtonEventPayload>) => {
    layouts.keywords.button(e);
  };
  const buttons = decorate<"LfButton", "button">(
    "button",
    button,
    async (e) => comp.onLfEvent(e, "lf-event"),
    keywords.button(),
    buttonCb,
    [() => refs.layouts.keywords.button],
  );
  const hasButton = Boolean(buttons?.length);
  //#endregion

  //#region Chart
  const charts = decorate(
    "chart",
    chart,
    async (e) => comp.onLfEvent(e, "lf-event"),
    keywords.chart(),
  );
  const hasChart = Boolean(charts?.length);
  //#endregion

  //#region Chip
  const chips = decorate<"LfChip", "chip">(
    "chip",
    chip,
    async (e) => comp.onLfEvent(e, "lf-event"),
    keywords.chip(),
    undefined,
    [(r) => (refs.layouts.keywords.chip = r)],
  );
  const hasChip = Boolean(chips?.length);
  //#endregion

  return (
    <div class={bemClass(keywordsLayout._)} part={parts.keywordsLayout}>
      {hasChart && (
        <div class={bemClass(keywordsLayout._, keywordsLayout.section1)}>
          {charts[0]}
        </div>
      )}
      {hasChip && (
        <div class={bemClass(keywordsLayout._, keywordsLayout.section2)}>
          {chips[0]}
        </div>
      )}
      {hasButton && (
        <div class={bemClass(keywordsLayout._, keywordsLayout.section3)}>
          {buttons[0]}
        </div>
      )}
    </div>
  );
};
