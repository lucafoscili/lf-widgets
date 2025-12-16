import { LfCheckboxAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface CheckboxFCProps {
  adapter: LfCheckboxAdapter;
}
//#endregion

/**
 * FC for the checkbox component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates checkbox UI.
 */
export const CheckboxFC: FunctionalComponent<CheckboxFCProps> = ({
  adapter,
}) => {
  const { controller, elements, handlers } = adapter;
  const { computed, get } = controller;

  const blocks = get.blocks();
  const { lfLabel, lfLeadingLabel, lfUiState } = get.compInstance();
  const { theme } = get.framework();
  const lf = get.lfAttributes();
  const parts = get.parts();

  const { bemClass } = theme;
  const { checkbox, formField } = blocks;
  const { background, input, label } = elements.jsx;
  const { isChecked, isDisabled, isIndeterminate } = computed;
  const { refs } = elements;

  return (
    <div
      class={bemClass(formField._, null, { leading: lfLeadingLabel })}
      data-lf={lf[lfUiState]}
    >
      <div
        class={bemClass(checkbox._)}
        onClick={(e) => handlers.checkbox.onChange(e)}
        onPointerDown={(e) => handlers.checkbox.onPointerDown(e)}
        ref={(el) => {
          if (refs) refs.surface = el;
        }}
      >
        <div
          class={bemClass(checkbox._, checkbox.surface, {
            checked: isChecked(),
            indeterminate: isIndeterminate(),
            disabled: isDisabled(),
          })}
          part={parts.checkbox}
        >
          {input()}
          {background()}
        </div>
      </div>
      {lfLabel && label()}
    </div>
  );
};
