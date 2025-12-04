import {
  CY_ATTRIBUTES,
  LF_THEME_ICONS,
  LfButtonAdapter,
  LfButtonAdapterJsx,
  LfDataNode,
  LfIconType,
} from "@lf-widgets/foundations";
import { Fragment, h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { LfButton } from "./lf-button";

//#endregion
export const prepButton = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterJsx => {
  return {
    //#region Button
    button: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        isDisabled,
        lfAttributes,
        manager,
        parts,
        styling,
      } = controller.get;
      const {
        lfAriaLabel,
        lfIcon,
        lfLabel,
        lfShowSpinner,
        lfTrailingIcon,
        lfType,
        lfUiState,
        rootElement,
      } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { refs } = elements;

      const comp = compInstance as LfButton;

      const accessibleLabel = (
        lfAriaLabel ||
        lfLabel ||
        lfIcon ||
        rootElement.id ||
        "button"
      ).trim();

      return (
        <button
          aria-label={accessibleLabel}
          class={bemClass(blocks.button._, null, {
            [styling()]: true,
            disabled: isDisabled(),
            "has-spinner": lfShowSpinner,
            "no-label": !lfLabel || lfLabel === " ",
          })}
          data-cy={cyAttributes.button}
          data-lf={lfAttributes[lfUiState]}
          disabled={isDisabled()}
          onBlur={(e) => comp.onLfEvent(e, "blur")}
          onClick={(e) => comp.onLfEvent(e, "click")}
          onFocus={(e) => comp.onLfEvent(e, "focus")}
          onPointerDown={(e) => comp.onLfEvent(e, "pointerdown")}
          part={parts.button}
          ref={assignRef(refs, "button")}
          type={lfType ?? "button"}
        >
          {lfTrailingIcon
            ? [prepLabel(adapter), lfIcon && prepIcon(adapter)]
            : [lfIcon && prepIcon(adapter), prepLabel(adapter)]}
          {prepSpinner(adapter)}
        </button>
      );
    },
    //#endregion

    //#region Dropdown
    dropdown: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        isDisabled,
        lfAttributes,
        manager,
        parts,
        styling,
      } = controller.get;
      const { list } = controller.set;
      const { lfDataset, lfUiState } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { refs } = elements;

      const comp = compInstance as LfButton;

      return (
        <Fragment>
          <button
            class={bemClass(blocks.button._, null, {
              disabled: isDisabled(),
              dropdown: true,
              [styling()]: true,
            })}
            data-cy={cyAttributes.dropdownButton}
            data-lf={lfAttributes[lfUiState]}
            disabled={isDisabled()}
            onClick={() => list()}
            onPointerDown={(e) => comp.onLfEvent(e, "pointerdown")}
            part={parts.dropdown}
            ref={assignRef(refs, "dropdown")}
          >
            {prepIcon(adapter, true)}
          </button>
          <lf-list
            class={bemClass(blocks.button._, blocks.button.list)}
            data-cy={cyAttributes.dropdownMenu}
            data-lf={lfAttributes.portal}
            lfDataset={{ nodes: lfDataset.nodes[0].children }}
            onLf-list-event={handlers.list}
            part={parts.list}
            ref={assignRef(refs, "list")}
          ></lf-list>
        </Fragment>
      );
    },
    //#endregion

    //#region Icon
    icon: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        isDisabled,
        lfAttributes,
        manager,
        isOn,
        parts,
      } = controller.get;
      const {
        lfAriaLabel,
        lfShowSpinner,
        lfToggable,
        lfType,
        lfUiState,
        rootElement,
      } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { refs } = elements;

      const comp = compInstance as LfButton;

      const accessibleLabel = (
        lfAriaLabel ||
        compInstance.lfLabel ||
        compInstance.lfIcon ||
        rootElement.id ||
        "button"
      ).trim();

      return (
        <button
          aria-label={accessibleLabel}
          class={bemClass(blocks.button._, null, {
            active: lfToggable && isOn(),
            disabled: isDisabled(),
            "has-spinner": lfShowSpinner,
            icon: true,
            toggable: lfToggable,
          })}
          data-cy={cyAttributes.button}
          data-lf={lfAttributes[lfUiState]}
          disabled={isDisabled()}
          onBlur={(e) => comp.onLfEvent(e, "blur")}
          onClick={(e) => comp.onLfEvent(e, "click")}
          onFocus={(e) => comp.onLfEvent(e, "focus")}
          onPointerDown={(e) => comp.onLfEvent(e, "pointerdown")}
          part={parts.button}
          ref={assignRef(refs, "button")}
          value={comp.value}
          type={lfType ? lfType : "button"}
        >
          {prepIcon(adapter)}
          {prepSpinner(adapter)}
        </button>
      );
    },
    //#endregion
  };
};

//#region Helpers
const prepIcon = (adapter: LfButtonAdapter, isDropdown = false): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, isOn, manager, parts } = controller.get;
  const { lfIcon, lfIconOff, lfToggable } = compInstance;
  const { theme } = manager;
  const { bemClass, get } = theme;

  let icon = "";

  if (isDropdown) {
    icon = get.current().variables[LF_THEME_ICONS.dropdown];
  } else {
    const iconOff = lfIconOff ? lfIconOff : `off-${lfIcon}`;
    icon = lfToggable && !isOn() ? iconOff : lfIcon;
  }

  return (
    <div
      class={bemClass(blocks.button._, blocks.button.icon)}
      part={parts.icon}
    >
      <FIcon framework={manager} icon={icon as LfIconType} />
    </div>
  );
};
const prepLabel = (adapter: LfButtonAdapter): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, isDisabled, manager, parts } = controller.get;
  const { lfLabel, lfShowSpinner } = compInstance;
  const { bemClass } = manager.theme;

  return (
    <span
      class={bemClass(blocks.button._, blocks.button.label, {
        hidden: lfShowSpinner && !isDisabled(),
      })}
      part={parts.label}
    >
      {lfLabel}
    </span>
  );
};
const prepNode = (node: LfDataNode): VNode => {
  const { children, value } = node;

  const currentNode = <div data-cy={CY_ATTRIBUTES.node}>{value}</div>;

  const hasChildren = !!(Array.isArray(children) && children.length > 0);
  return hasChildren ? (
    <Fragment>
      {currentNode}
      {children.map((c) => prepNode(c))}
    </Fragment>
  ) : (
    currentNode
  );
};
const prepSpinner = (adapter: LfButtonAdapter): VNode => {
  const { controller } = adapter;
  const { blocks, compInstance, manager, parts } = controller.get;
  const { lfShowSpinner } = compInstance;
  const { bemClass } = manager.theme;

  return (
    lfShowSpinner && (
      <lf-spinner
        class={bemClass(blocks.button._, blocks.button.spinner)}
        lfActive={lfShowSpinner}
        lfDimensions=".625em"
        part={parts.spinner}
      ></lf-spinner>
    )
  );
};
//#endregion
