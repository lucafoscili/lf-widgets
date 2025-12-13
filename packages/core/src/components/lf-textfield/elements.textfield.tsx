import {
  LfIconType,
  LfTextfieldAdapter,
  LfTextfieldAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the textfield component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, isOutlined, isTextarea)
 * - Uses `controller.actions` for complex operations (updateState, formatJSON)
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepTextfieldElements = (
  getAdapter: () => LfTextfieldAdapter,
): LfTextfieldAdapterJsx => {
  return {
    //#region Counter
    counter: (): VNode => {
      const adapter = getAdapter();
      const { blocks, compInstance, framework, maxLength, parts } =
        adapter.controller.get;

      const max = maxLength();
      if (!max) {
        return null;
      }

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { bemClass } = mgr.theme;
      const { textfield } = b;

      return (
        <div class={bemClass(textfield._, textfield.counter)} part={p.counter}>
          {`${(comp.value || "").length} / ${max}`}
        </div>
      );
    },
    //#endregion

    //#region Helper
    helper: (): VNode => {
      const adapter = getAdapter();
      const { blocks, compInstance, framework } = adapter.controller.get;
      const { isTextarea } = adapter.controller.computed;

      const comp = compInstance();
      if (!comp.lfHelper?.value) {
        return null;
      }

      const mgr = framework();
      const b = blocks();

      const { bemClass } = mgr.theme;
      const { textfield } = b;
      const shouldShow =
        (comp.lfHelper.showWhenFocused && comp.status.has("focused")) ||
        !comp.lfHelper.showWhenFocused;

      return (
        <div class={bemClass(textfield._, textfield.helperLine)}>
          <div
            class={bemClass(textfield._, textfield.helperText, {
              active: shouldShow,
            })}
          >
            {comp.lfHelper.value}
          </div>
          {!isTextarea() && adapter.elements.jsx.counter()}
        </div>
      );
    },
    //#endregion

    //#region Icon
    icon: (): VNode => {
      const adapter = getAdapter();
      const { blocks, compInstance, framework } = adapter.controller.get;

      const comp = compInstance();
      if (!comp.lfIcon) {
        return null;
      }

      const mgr = framework();
      const b = blocks();
      const { bemClass } = mgr.theme;
      const { textfield } = b;

      return (
        <FIcon
          framework={mgr}
          icon={comp.lfIcon}
          wrapperClass={bemClass(textfield._, textfield.icon, {
            trailing: comp.lfTrailingIcon,
          })}
          onClick={(e: MouseEvent) => {
            adapter.handlers.icon.onClick(e, "regular");
          }}
          style={{ tabIndex: 0, cursor: "pointer" }}
        />
      );
    },
    //#endregion

    //#region Icon Action
    iconAction: (): VNode => {
      const adapter = getAdapter();
      const { blocks, compInstance, framework } = adapter.controller.get;

      const comp = compInstance();
      if (!comp.lfTrailingIconAction) {
        return null;
      }

      const mgr = framework();
      const b = blocks();
      const { bemClass, get } = mgr.theme;
      const { textfield } = b;
      const { variables } = get.current();

      // Resolve the CSS variable to the actual icon name
      const iconName = variables[comp.lfTrailingIconAction] as string;

      return (
        <FIcon
          framework={mgr}
          icon={iconName as LfIconType}
          wrapperClass={bemClass(textfield._, textfield.iconAction, {
            trailing: true,
          })}
          onClick={(e: MouseEvent) => {
            adapter.handlers.icon.onClick(e, "action");
          }}
          style={{ tabIndex: 0, cursor: "pointer" }}
        />
      );
    },
    //#endregion

    //#region Input
    input: (): VNode => {
      const adapter = getAdapter();
      const { blocks, compInstance, cyAttributes, framework, parts } =
        adapter.controller.get;
      const { isDisabled, isOutlined } = adapter.controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const cy = cyAttributes();

      const { assignRef, sanitizeProps, theme } = mgr;
      const { bemClass } = theme;
      const { textfield } = b;
      const { refs } = adapter.elements;

      return (
        <input
          {...sanitizeProps(comp.lfHtmlAttributes)}
          class={bemClass(textfield._, textfield.input)}
          data-cy={cy.input}
          disabled={isDisabled()}
          onBlur={(e) => adapter.handlers.input.onBlur(e)}
          onChange={(e) => adapter.handlers.input.onChange(e)}
          onClick={(e) => adapter.handlers.input.onClick(e)}
          onFocus={(e) => adapter.handlers.input.onFocus(e)}
          onInput={(e) => adapter.handlers.input.onInput(e)}
          onKeyDown={(e) => adapter.handlers.input.onKeyDown(e)}
          part={p.input}
          placeholder={(isOutlined() && comp.lfLabel) || ""}
          ref={assignRef(refs, "input")}
          value={comp.value}
        ></input>
      );
    },
    //#endregion

    //#region Label
    label: (): VNode => {
      const adapter = getAdapter();
      const { blocks, compInstance, framework, parts } = adapter.controller.get;
      const { isOutlined } = adapter.controller.computed;

      const comp = compInstance();
      if (isOutlined() || !comp.lfLabel) {
        return null;
      }

      const mgr = framework();
      const b = blocks();
      const p = parts();
      const { bemClass } = mgr.theme;
      const { textfield } = b;

      return (
        <label
          class={bemClass(textfield._, textfield.label)}
          htmlFor="input"
          part={p.label}
        >
          {comp.lfLabel}
        </label>
      );
    },
    //#endregion

    //#region Textarea
    textarea: (): VNode => {
      const adapter = getAdapter();
      const {
        blocks,
        compInstance,
        cyAttributes,
        formattingError,
        framework,
        parts,
      } = adapter.controller.get;
      const { isOutlined } = adapter.controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const cy = cyAttributes();

      const { assignRef, sanitizeProps, theme } = mgr;
      const { bemClass } = theme;
      const { textfield } = b;
      const { refs } = adapter.elements;

      const { displayBorderOnError, displayErrorAsTitle } =
        comp.lfFormatJSON || {};

      const hasError = Boolean(formattingError());
      const shouldFormat = comp.lfFormatJSON !== null;

      return (
        <span class={bemClass(textfield._, textfield.resizer)}>
          <textarea
            {...sanitizeProps(comp.lfHtmlAttributes)}
            class={bemClass(textfield._, textfield.input, {
              error: shouldFormat && hasError && displayBorderOnError,
            })}
            data-cy={cy.input}
            id="input"
            onBlur={(e) => adapter.handlers.input.onBlur(e)}
            onChange={(e) => adapter.handlers.input.onChange(e)}
            onClick={(e) => adapter.handlers.input.onClick(e)}
            onFocus={(e) => adapter.handlers.input.onFocus(e)}
            onInput={(e) => adapter.handlers.input.onInput(e)}
            onKeyDown={(e) => adapter.handlers.input.onKeyDown(e)}
            part={p.input}
            placeholder={(isOutlined() && comp.lfLabel) || ""}
            ref={assignRef(refs, "input")}
            title={
              shouldFormat && hasError && displayErrorAsTitle
                ? formattingError()
                : ""
            }
            value={comp.value}
          ></textarea>
        </span>
      );
    },
    //#endregion

    //#region Underline
    underline: (): VNode => {
      const adapter = getAdapter();
      const { blocks, framework, hasOutline } = adapter.controller.get;

      if (hasOutline()) {
        return null;
      }

      const mgr = framework();
      const b = blocks();
      const { bemClass } = mgr.theme;
      const { textfield } = b;

      return <span class={bemClass(textfield._, textfield.underline)}></span>;
    },
    //#endregion
  };
};
