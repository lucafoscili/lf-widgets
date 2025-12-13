import {
  LfCheckboxAdapter,
  LfCheckboxAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

/**
 * Prepares JSX factory functions for the checkbox component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isChecked, isDisabled, isIndeterminate)
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepCheckboxElements = (
  getAdapter: () => LfCheckboxAdapter,
): LfCheckboxAdapterJsx => {
  return {
    //#region Background
    background: () => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { blocks, framework, parts } = controller.get;

      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { theme } = mgr;
      const { bemClass } = theme;
      const { checkbox } = b;
      const { background, checkmark, mixedmark } = p;

      return (
        <div
          class={bemClass(checkbox._, checkbox.background)}
          part={background}
        >
          <svg
            class={bemClass(checkbox._, checkbox.checkmark)}
            viewBox="0 0 24 24"
            part={checkmark}
          >
            <path
              class={bemClass(checkbox._, "checkmark-path")}
              fill="none"
              d="M4.1,12.7 9,17.6 20.3,6.3"
              stroke="currentColor"
            />
          </svg>
          <div
            class={bemClass(checkbox._, checkbox.mixedmark)}
            part={mixedmark}
          />
        </div>
      );
    },
    //#endregion

    //#region Input
    input: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, cyAttributes, framework, parts } =
        controller.get;
      const { isChecked, isDisabled, isIndeterminate } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const cy = cyAttributes();

      const { lfAriaLabel, lfLabel, rootElement } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { checkbox } = b;
      const { nativeControl } = p;
      const { refs } = elements;

      const checked = isChecked();
      const indeterminate = isIndeterminate();
      const disabled = isDisabled();
      const ariaLabel = lfAriaLabel || lfLabel || rootElement.id || "checkbox";

      return (
        <input
          aria-label={ariaLabel}
          aria-checked={indeterminate ? "mixed" : checked}
          class={bemClass(checkbox._, checkbox.nativeControl)}
          checked={checked}
          data-cy={cy.input}
          disabled={disabled}
          indeterminate={indeterminate}
          onFocus={(e) => handlers.checkbox.onFocus(e)}
          onBlur={(e) => handlers.checkbox.onBlur(e)}
          part={nativeControl}
          ref={assignRef(refs, "input")}
          type="checkbox"
          value={indeterminate ? "indeterminate" : checked ? "on" : "off"}
        />
      );
    },
    //#endregion

    //#region Label
    label: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { lfLabel } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { formField } = b;
      const { refs } = elements;

      return (
        <label
          class={bemClass(formField._, formField.label)}
          onClick={(e) => handlers.label.onClick(e)}
          part={p.label}
          ref={assignRef(refs, "label")}
        >
          {lfLabel}
        </label>
      );
    },
    //#endregion
  };
};
