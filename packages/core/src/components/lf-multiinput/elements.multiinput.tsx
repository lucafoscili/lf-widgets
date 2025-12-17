import {
  LfMultiInputAdapter,
  LfMultiInputAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";
import { MultiinputFC } from "./fc/multiinput-fc";

/**
 * Prepares the JSX factories for lf-multiinput adapter.
 *
 * This factory creates JSX rendering functions that are used by both
 * the Web Component render method and the MultiinputFC adapter wrapper.
 */
export const prepMultiInputJsx = (
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapterJsx => {
  return {
    //#region Chips
    chips: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const framework = get.framework();
      const compInstance = get.compInstance();
      const nodes = get.historyNodes();

      const { assignRef, sanitizeProps, theme } = framework;
      const { bemClass } = theme;

      if (!nodes.length) {
        return null;
      }

      return (
        <lf-chip
          lfDataset={{ nodes }}
          lfStyling="filter"
          lfUiSize={compInstance.lfUiSize}
          lfUiState={compInstance.lfUiState}
          {...sanitizeProps(compInstance.lfChipProps, "LfChip")}
          class={bemClass(blocks._, blocks.chips)}
          data-cy={cyAttributes.node}
          lfValue={compInstance.lfValue?.split(",") || []}
          onLf-chip-event={handlers.chips}
          part={parts.chips}
          ref={assignRef(refs, "chips")}
        />
      );
    },
    //#endregion

    //#region Textfield
    textfield: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { get } = controller;

      const blocks = get.blocks();
      const framework = get.framework();
      const compInstance = get.compInstance();

      const { assignRef, sanitizeProps, theme } = framework;
      const { bemClass } = theme;

      // Extract sanitized textfield props
      const sanitizedProps = sanitizeProps(
        compInstance.lfTextfieldProps,
        "LfTextfield",
      );

      return (
        <LfTextfieldFC
          className={bemClass(blocks._, blocks.textfield)}
          disabled={compInstance.lfUiState === "disabled"}
          framework={framework}
          icon={sanitizedProps?.lfIcon}
          inputRef={(el) => assignRef(refs, "textfield")(el)}
          label={sanitizedProps?.lfLabel}
          onIconClick={handlers.textfieldIconClick}
          onInput={(value, e) => handlers.textfieldInput(e, value)}
          onKeyDown={handlers.textfieldKeyDown}
          styling={sanitizedProps?.lfStyling || "flat"}
          trailingIconAction="--lf-icon-clear"
          uiSize={compInstance.lfUiSize}
          uiState={compInstance.lfUiState}
          value={compInstance.lfValue || ""}
        />
      );
    },
    //#endregion
  };
};

/**
 * Renders the multiinput using the FC-first pattern.
 *
 * This function creates a VNode tree using the MultiinputFC adapter wrapper,
 * which in turn uses the pure presentational LfMultiinputFC component.
 *
 * @param adapter - The multiinput adapter containing all state and handlers
 * @returns VNode tree for the multiinput component
 */
export const renderMultiinputFC = (adapter: LfMultiInputAdapter): VNode => {
  return <MultiinputFC adapter={adapter} />;
};
