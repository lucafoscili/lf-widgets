import {
  LfButtonElement,
  LfCardAdapter,
  LfChipElement,
  LfDataCell,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { LfCard } from "./lf-card";

export const prepKeywords = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller, elements, handlers } = getAdapter();
  const { refs } = elements;
  const { layouts } = handlers;
  const { blocks, compInstance, defaults, manager, parts, shapes } =
    controller.get;
  const { keywords } = defaults;
  const { theme } = manager;
  const { bemClass } = theme;
  const { keywordsLayout } = blocks;

  const { button, chart, chip } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttons: LfDataCell<"button">[] = [];
  const buttonsDef = keywords.button();
  for (let index = 0; index < button.length; index++) {
    buttons.push(
      <LfShape
        shape={"button"}
        cell={
          buttonsDef[index]
            ? Object.assign(buttonsDef[index], button[index])
            : button[index]
        }
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
        defaultCb={layouts.keywords.button}
        refCallback={(r: LfButtonElement) => (refs.layouts.keywords.button = r)}
      ></LfShape>,
    );
  }
  const hasButton = Boolean(buttons?.length);
  //#endregion

  //#region Chart
  const charts: LfDataCell<"chart">[] = [];
  const chartsDef = keywords.chart();
  for (let index = 0; index < chart.length; index++) {
    charts.push(
      <LfShape
        shape={"chart"}
        cell={
          chartsDef[index]
            ? Object.assign(chartsDef[index], chart[index])
            : chart[index]
        }
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
      ></LfShape>,
    );
  }
  const hasChart = Boolean(charts?.length);
  //#endregion

  //#region Chip
  const chips: LfDataCell<"chip">[] = [];
  const chipsDef = keywords.chip();
  for (let index = 0; index < chart.length; index++) {
    chips.push(
      <LfShape
        shape={"chip"}
        cell={
          chipsDef[index]
            ? Object.assign(chipsDef[index], chip[index])
            : chip[index]
        }
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
        refCallback={(r: LfChipElement) => (refs.layouts.keywords.chip = r)}
      ></LfShape>,
    );
  }
  const hasChip = Boolean(charts?.length);
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
