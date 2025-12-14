import {
  LfProgressbarAdapter,
  LfProgressbarAdapterJsx,
  LfIconType,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the progressbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Routes all events through dispatcher (none for display component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepProgressbarJsx = (
  getAdapter: () => LfProgressbarAdapter,
): LfProgressbarAdapterJsx => {
  return {
    //#region Progressbar
    progressbar: () => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { compInstance } = controller.get;

      const comp = compInstance();
      const { lfIsRadial } = comp;

      return lfIsRadial ? prepRadialBar(adapter) : prepLinearBar(adapter);
    },
    //#endregion
  };
};

//#region Internal helpers
/**
 * Prepares the icon element for the progressbar.
 */
const prepIcon = (adapter: LfProgressbarAdapter): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, framework, parts } = controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();

  const { lfIcon } = comp;
  const { bemClass } = mgr.theme;
  const { progressbar } = b;

  return (
    <div class={bemClass(progressbar._, progressbar.icon)} part={p.icon}>
      <FIcon framework={mgr} icon={lfIcon as LfIconType} />
    </div>
  );
};

/**
 * Prepares the label element for the progressbar.
 */
const prepLabel = (adapter: LfProgressbarAdapter): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, framework, parts } = controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();

  const { lfIcon, lfLabel, lfValue } = comp;
  const { bemClass } = mgr.theme;
  const { progressbar } = b;

  const label: VNode[] = lfLabel
    ? [
        <div class={bemClass(progressbar._, progressbar.text)} part={p.text}>
          {lfLabel}
        </div>,
      ]
    : [
        <div class={bemClass(progressbar._, progressbar.text)} part={p.text}>
          {lfValue}
        </div>,
        <div class={bemClass(progressbar._, progressbar.mu)} part={p.mu}>
          %
        </div>,
      ];

  return (
    <div class={bemClass(progressbar._, progressbar.label)}>
      {lfIcon && prepIcon(adapter)}
      {label}
    </div>
  );
};

/**
 * Prepares the linear progress bar element.
 */
const prepLinearBar = (adapter: LfProgressbarAdapter): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, framework, lfAttributes, parts } =
    controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();
  const lf = lfAttributes();

  const { lfCenteredLabel, lfUiState } = comp;
  const { bemClass } = mgr.theme;
  const { progressbar } = b;

  return (
    <div
      class={bemClass(progressbar._)}
      data-lf={lf[lfUiState]}
      part={p.progressbar}
    >
      <div
        class={bemClass(progressbar._, progressbar.percentage)}
        part={p.percentage}
      >
        {!lfCenteredLabel && prepLabel(adapter)}
      </div>
      {lfCenteredLabel && prepLabel(adapter)}
    </div>
  );
};

/**
 * Prepares the radial progress bar element.
 */
const prepRadialBar = (adapter: LfProgressbarAdapter): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, framework, lfAttributes, parts } =
    controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();
  const lf = lfAttributes();

  const { lfUiState, lfValue } = comp;
  const { bemClass } = mgr.theme;
  const { pie, progressbar } = b;

  return (
    <div
      class={bemClass(progressbar._)}
      data-lf={lf[lfUiState]}
      part={p.progressbar}
    >
      {prepLabel(adapter)}
      <div
        class={bemClass(pie._, null, {
          empty: lfValue <= 50,
          full: lfValue > 50,
          "has-value": Boolean(lfValue),
        })}
      >
        <div
          class={bemClass(pie._, pie.halfCircle, {
            left: true,
          })}
        ></div>
        <div
          class={bemClass(pie._, pie.halfCircle, {
            right: true,
          })}
        ></div>
      </div>
      <div class={bemClass(pie._, pie.track)} part={p.track}></div>
    </div>
  );
};
//#endregion
