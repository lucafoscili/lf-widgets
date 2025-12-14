import { LfSpinnerAdapter, LfSpinnerAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the spinner component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isBarVariant, showFader)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSpinnerJsx = (
  getAdapter: () => LfSpinnerAdapter,
): LfSpinnerAdapterJsx => {
  return {
    //#region Spinner
    spinner: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { blocks, compInstance, framework, lfAttributes, parts } =
        controller.get;
      const { isBarVariant, showFader } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const lf = lfAttributes();

      const { lfFader, lfLayout, lfUiState, progress } = comp;

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;
      const spinnerBlocks = b.spinner;

      return (
        <div
          class={`${bemClass(spinnerBlocks._)}${isBarVariant() ? "" : ` spinner--${lfLayout}`}`}
          data-lf={lf[lfUiState]}
          part={p.spinner}
          ref={assignRef(refs, "spinner")}
        >
          {isBarVariant() ? (
            // Bar variant: progress bar
            <div
              class={bemClass(spinnerBlocks._, spinnerBlocks.bar)}
              part={p.bar}
              ref={assignRef(refs, "bar")}
            >
              <div
                class={bemClass(spinnerBlocks._, spinnerBlocks.barFill)}
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            // Widget variant: layout-specific spinner
            <div
              class={bemClass(spinnerBlocks._, spinnerBlocks.content)}
              part={p.content}
              ref={assignRef(refs, "content")}
            >
              {renderLayoutContent(adapter)}
            </div>
          )}

          {/* Fader overlay */}
          {lfFader && (
            <div
              class={`${bemClass(spinnerBlocks._, spinnerBlocks.fader)}${showFader() ? " spinner__fader--visible" : ""}`}
              part={p.fader}
              ref={assignRef(refs, "fader")}
            />
          )}
        </div>
      );
    },
    //#endregion
  };
};

/**
 * Renders the layout-specific content based on the spinner layout type.
 */
const renderLayoutContent = (adapter: LfSpinnerAdapter): VNode | VNode[] => {
  const { controller } = adapter;
  const { blocks, compInstance, framework } = controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();

  const { lfLayout, lfIcon } = comp;

  switch (lfLayout) {
    case "dots":
      // Middle dot is a span, outer dots are ::before/::after
      return <span></span>;

    case "bars":
      // 5 equalizer bars
      return [1, 2, 3, 4, 5].map((i) => <div class="bar" key={`bar-${i}`} />);

    case "spinner":
      // 8 chasing dots
      return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div class="dot" key={`dot-${i}`} />
      ));

    case "grid":
      // 3x3 grid cells
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div class="cell" key={`cell-${i}`} />
      ));

    case "icon":
      return (
        <div class={b.spinner.icon}>
          <FIcon
            framework={mgr}
            icon={lfIcon || "settings"}
            wrapperClass="spinner__icon-wrapper"
          />
        </div>
      );

    case "wave":
      // 5 wave bars
      return [1, 2, 3, 4, 5].map((i) => (
        <div class="wave-bar" key={`wave-${i}`} />
      ));

    case "ring":
    case "pulse":
    default:
      // These layouts use only CSS pseudo-elements
      return null;
  }
};
