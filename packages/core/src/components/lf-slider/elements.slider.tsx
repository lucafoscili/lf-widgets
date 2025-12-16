import {
  LF_SLIDER_CSS_VARIABLES,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfSliderAdapter,
  LfSliderAdapterJsx,
} from "@lf-widgets/foundations";
import { h, Host, VNode } from "@stencil/core";
import { LfSliderFC } from "./lf-slider-fc";

/**
 * Prepares JSX factory functions for the slider component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, valuePercentage)
 * - Routes all events through dispatcher via handlers
 * - Wraps `LfSliderFC` functional component for actual rendering
 *
 * @see Section 2 & 5 of 4_0_0_REFACTORING.md
 */
export const prepSliderJsx = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterJsx => {
  return {
    //#region Slider
    slider: (): VNode => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { compInstance, framework } = controller.get;
      const { isDisabled } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const v = LF_SLIDER_CSS_VARIABLES;

      const { lfLabel, lfLeadingLabel, lfMax, lfMin, lfStep, lfStyle, value } =
        comp;

      const { assignRef, theme } = mgr;
      const { setLfStyle } = theme;
      const { refs } = elements;

      return (
        <Host>
          <style id={LF_STYLE_ID}>
            {`
              :host {
                ${v.value}: ${controller.computed.valuePercentage()}%;
              }
            ${(lfStyle && setLfStyle(comp)) || ""}`}
          </style>
          <div id={LF_WRAPPER_ID}>
            <LfSliderFC
              disabled={isDisabled()}
              framework={mgr}
              inputRef={assignRef(refs, "input")}
              label={lfLabel}
              leadingLabel={lfLeadingLabel}
              max={lfMax}
              min={lfMin}
              onBlur={(e) => handlers.blur(e)}
              onChange={(_, e) => handlers.change(e)}
              onFocus={(e) => handlers.focus(e)}
              onInput={(_, e) => handlers.input(e)}
              onPointerDown={(e) => handlers.pointerdown(e)}
              step={lfStep}
              thumbRef={assignRef(refs, "thumb")}
              thumbUnderlayRef={assignRef(refs, "thumbUnderlay")}
              trackRef={assignRef(refs, "track")}
              uiSize={comp.lfUiSize}
              uiState={comp.lfUiState}
              value={value}
            />
          </div>
        </Host>
      );
    },
    //#endregion
  };
};
