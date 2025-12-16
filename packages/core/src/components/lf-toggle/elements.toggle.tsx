import { LfToggleAdapter, LfToggleAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfToggleFC } from "./fc";

/**
 * Prepares JSX factory functions for the toggle component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, isOn)
 * - Uses `handlers` for event callbacks
 * - Routes all events through dispatcher
 * - Wraps `LfToggleFC` functional component for actual rendering
 *
 * @see Section 2 & 5 of 4_0_0_REFACTORING.md
 */
export const prepToggle = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterJsx => {
  return {
    //#region Toggle
    toggle: (): VNode => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { compInstance, framework } = controller.get;
      const { isDisabled, isOn } = controller.computed;

      const comp = compInstance();
      const mgr = framework();

      const { lfAriaLabel, lfLabel, lfLeadingLabel, lfUiSize, lfUiState } =
        comp;

      const { assignRef } = mgr;
      const { refs } = elements;

      return (
        <LfToggleFC
          ariaLabel={lfAriaLabel}
          disabled={isDisabled()}
          framework={mgr}
          inputRef={assignRef(refs, "input")}
          label={lfLabel}
          leadingLabel={lfLeadingLabel}
          onBlur={(e) => handlers.toggle.onBlur(e)}
          onChange={(_, e) => handlers.toggle.onChange(e)}
          onFocus={(e) => handlers.toggle.onFocus(e)}
          onLabelClick={(e) => handlers.label.onClick(e)}
          onPointerDown={(e) => handlers.toggle.onPointerDown(e)}
          thumbRef={assignRef(refs, "thumb")}
          thumbUnderlayRef={assignRef(refs, "thumbUnderlay")}
          trackRef={assignRef(refs, "track")}
          uiSize={lfUiSize}
          uiState={lfUiState}
          value={isOn()}
        />
      );
    },
    //#endregion
  };
};
