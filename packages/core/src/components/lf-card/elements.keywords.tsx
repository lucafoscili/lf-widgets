import {
  LfButtonElement,
  LfCardAdapter,
  LfChipElement,
  LfDataCell,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

export const prepKeywords = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller, dispatcher, elements, handlers } = getAdapter();
  const { refs } = elements;
  const { layouts } = handlers;
  const { blocks, defaults, framework, parts, shapes } = controller.get;

  const defs = defaults();
  const { keywords } = defs;
  const mgr = framework();
  const { theme } = mgr;
  const { bemClass } = theme;
  const b = blocks();
  const p = parts();
  const { keywordsLayout } = b;

  const { button, chart, chip } = shapes();

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
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
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
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
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
        eventDispatcher={async (e) =>
          dispatcher.emit("lf-event", { originalEvent: e })
        }
        framework={mgr}
        refCallback={(r: LfChipElement) => (refs.layouts.keywords.chip = r)}
      ></LfShape>,
    );
  }
  const hasChip = Boolean(charts?.length);
  //#endregion

  return (
    <div class={bemClass(keywordsLayout._)} part={p.keywordsLayout}>
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
