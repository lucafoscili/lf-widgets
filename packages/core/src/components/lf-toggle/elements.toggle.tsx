import { LfToggleAdapter, LfToggleAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares JSX factory functions for the toggle component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, isOn)
 * - Uses `handlers` for event callbacks
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepToggle = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterJsx => {
  return {
    //#region Toggle
    toggle: (): VNode => {
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
      const { isDisabled, isOn } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const cy = cyAttributes();
      const lf = lfAttributes();

      const { lfAriaLabel, lfLabel, lfLeadingLabel, lfUiState, rootElement } =
        comp;

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      const { formField, toggle } = b;

      const accessibleLabel = (
        lfAriaLabel ||
        lfLabel ||
        rootElement.id ||
        "toggle"
      ).trim();

      return (
        <div
          class={bemClass(formField._, null, {
            leading: lfLeadingLabel,
          })}
          data-lf={lf[lfUiState]}
        >
          <div
            class={bemClass(toggle._, null, {
              active: isOn(),
            })}
            part={p.toggle}
          >
            <div
              class={bemClass(toggle._, toggle.track)}
              part={p.track}
              ref={assignRef(refs, "track")}
            ></div>
            <div class={bemClass(toggle._, toggle.thumbUnderlay)}>
              <div
                class={bemClass(toggle._, toggle.thumb)}
                part={p.thumb}
                ref={assignRef(refs, "thumb")}
              ></div>
              <input
                aria-label={accessibleLabel}
                checked={isOn()}
                class={bemClass(toggle._, toggle.nativeControl)}
                data-cy={cy.input}
                disabled={isDisabled()}
                onBlur={(e) => handlers.toggle.onBlur(e)}
                onChange={(e) => handlers.toggle.onChange(e)}
                onFocus={(e) => handlers.toggle.onFocus(e)}
                onPointerDown={(e) => handlers.toggle.onPointerDown(e)}
                part={p.nativeControl}
                ref={assignRef(refs, "input")}
                role="switch"
                type="checkbox"
                value={isOn() ? "on" : "off"}
              ></input>
            </div>
          </div>
          <label
            class={bemClass(formField._, formField.label)}
            onClick={(e) => handlers.label.onClick(e)}
            part={p.label}
            ref={assignRef(refs, "label")}
          >
            {lfLabel}
          </label>
        </div>
      );
    },
    //#endregion
  };
};
