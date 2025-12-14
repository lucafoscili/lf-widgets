import {
  LF_SLIDER_CSS_VARIABLES,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfSliderAdapter,
  LfSliderAdapterJsx,
} from "@lf-widgets/foundations";
import { h, Host, VNode } from "@stencil/core";

/**
 * Prepares JSX factory functions for the slider component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, valuePercentage)
 * - Routes all events through dispatcher via handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSliderJsx = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterJsx => {
  return {
    //#region Slider
    slider: (): VNode => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        framework,
        lfAttributes,
        parts,
      } = controller.get;
      const { isDisabled, valuePercentage } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const cy = cyAttributes();
      const lf = lfAttributes();
      const v = LF_SLIDER_CSS_VARIABLES;

      const { lfLabel, lfLeadingLabel, lfMax, lfMin, lfStep, lfStyle, value } =
        comp;

      const { assignRef, theme } = mgr;
      const { bemClass, setLfStyle } = theme;
      const { refs } = elements;

      const { formField, slider } = b;

      return (
        <Host>
          <style id={LF_STYLE_ID}>
            {`
              :host {
                ${v.value}: ${valuePercentage()}%;
              }
            ${(lfStyle && setLfStyle(comp)) || ""}`}
          </style>
          <div id={LF_WRAPPER_ID}>
            <div
              class={bemClass(formField._, null, {
                leading: lfLeadingLabel,
              })}
              part={p.formField}
            >
              <div
                class={bemClass(slider._, null, {
                  "has-value": value.display > lfMin,
                  disabled: isDisabled(),
                })}
                data-lf={lf[comp.lfUiState]}
                part={p.slider}
              >
                <input
                  type="range"
                  class={bemClass(slider._, slider.nativeControl)}
                  data-cy={cy.input}
                  disabled={isDisabled()}
                  max={lfMax}
                  min={lfMin}
                  onBlur={(e) => handlers.blur(e)}
                  onChange={(e) => handlers.change(e)}
                  onFocus={(e) => handlers.focus(e)}
                  onInput={(e) => handlers.input(e)}
                  onPointerDown={(e) => handlers.pointerdown(e)}
                  part={p.nativeControl}
                  ref={assignRef(refs, "input")}
                  step={lfStep}
                  value={value.real}
                />
                <div
                  class={bemClass(slider._, slider.track)}
                  ref={assignRef(refs, "track")}
                >
                  <div class={bemClass(slider._, slider.thumbUnderlay)}>
                    <div
                      class={bemClass(slider._, slider.thumb)}
                      part={p.thumb}
                      ref={assignRef(refs, "thumb")}
                    ></div>
                  </div>
                </div>
                <span class={bemClass(slider._, slider.value)} part={p.value}>
                  {value.display}
                </span>
              </div>
              <label
                class={bemClass(formField._, formField.label)}
                part={p.label}
              >
                {lfLabel}
              </label>
            </div>
          </div>
        </Host>
      );
    },
    //#endregion
  };
};
