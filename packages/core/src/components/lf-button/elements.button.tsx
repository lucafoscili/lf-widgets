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
import { ButtonFC } from "./fc";

/**
 * Prepares JSX factory functions for the button component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, isDropdown, isOn)
 * - Uses `controller.actions` for complex operations (toggle)
 * - Routes all events through dispatcher
 * - Wraps `ButtonFC` functional component for actual rendering
 *
 * @see Section 2 & 5 of 4_0_0_REFACTORING.md
 */
export const prepButton = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterJsx => {
  return {
    //#region Button
    button: () => {
      const adapter = getAdapter();
      const { controller, dispatcher, elements } = adapter;
      const { compInstance, framework, styling } = controller.get;
      const { isDisabled } = controller.computed;
      const { toggle } = controller.actions;

      const comp = compInstance();
      const mgr = framework();

      const {
        lfIcon,
        lfLabel,
        lfShowSpinner,
        lfTrailingIcon,
        lfType,
        lfUiSize,
        lfUiState,
      } = comp;

      const { assignRef } = mgr;
      const { refs } = elements;

      return (
        <ButtonFC
          disabled={isDisabled()}
          framework={mgr}
          icon={lfIcon}
          label={lfLabel}
          onBlur={(e) => dispatcher.emit("blur", { originalEvent: e })}
          onClick={(e) => {
            toggle();
            dispatcher.emit("click", { originalEvent: e });
          }}
          onFocus={(e) => dispatcher.emit("focus", { originalEvent: e })}
          onPointerDown={(e) =>
            dispatcher.emit("pointerdown", { originalEvent: e })
          }
          buttonRef={assignRef(refs, "button")}
          showSpinner={lfShowSpinner}
          styling={styling()}
          trailingIcon={lfTrailingIcon}
          type={lfType ?? "button"}
          uiSize={lfUiSize}
          uiState={lfUiState}
        />
      );
    },
    //#endregion

    //#region Dropdown
    dropdown: () => {
      const adapter = getAdapter();
      const { controller, dispatcher, elements, handlers } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        framework,
        lfAttributes,
        parts,
        styling,
      } = controller.get;
      const { isDisabled } = controller.computed;
      const { list } = controller.actions;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const cy = cyAttributes();
      const lf = lfAttributes();

      const { lfDataset, lfUiState } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      return (
        <Fragment>
          <button
            class={bemClass(b.button._, null, {
              disabled: isDisabled(),
              dropdown: true,
              [styling()]: true,
            })}
            data-cy={cy.dropdownButton}
            data-lf={lf[lfUiState]}
            disabled={isDisabled()}
            onClick={() => list()}
            onPointerDown={(e) =>
              dispatcher.emit("pointerdown", { originalEvent: e })
            }
            part={p.dropdown}
            ref={assignRef(refs, "dropdown")}
          >
            {prepIcon(adapter, true)}
          </button>
          <lf-list
            class={bemClass(b.button._, b.button.list)}
            data-cy={cy.dropdownMenu}
            data-lf={lf.portal}
            lfDataset={{ nodes: lfDataset.nodes[0].children }}
            onLf-list-event={handlers.list}
            part={p.list}
            ref={assignRef(refs, "list")}
          ></lf-list>
        </Fragment>
      );
    },
    //#endregion

    //#region Icon
    icon: () => {
      const adapter = getAdapter();
      const { controller, dispatcher, elements } = adapter;
      const { compInstance, framework } = controller.get;
      const { isDisabled, isOn } = controller.computed;
      const { toggle } = controller.actions;

      const comp = compInstance();
      const mgr = framework();

      const {
        lfIcon,
        lfIconOff,
        lfShowSpinner,
        lfToggable,
        lfType,
        lfUiSize,
        lfUiState,
      } = comp;

      const { assignRef } = mgr;
      const { refs } = elements;

      // Determine which icon to show based on toggle state
      const iconOff = lfIconOff ? lfIconOff : `off-${lfIcon}`;
      const displayIcon = lfToggable && !isOn() ? iconOff : lfIcon;

      return (
        <ButtonFC
          disabled={isDisabled()}
          framework={mgr}
          icon={displayIcon}
          onBlur={(e) => dispatcher.emit("blur", { originalEvent: e })}
          onClick={(e) => {
            toggle();
            dispatcher.emit("click", { originalEvent: e });
          }}
          onFocus={(e) => dispatcher.emit("focus", { originalEvent: e })}
          onPointerDown={(e) =>
            dispatcher.emit("pointerdown", { originalEvent: e })
          }
          buttonRef={assignRef(refs, "button")}
          showSpinner={lfShowSpinner}
          styling="icon"
          type={lfType ?? "button"}
          uiSize={lfUiSize}
          uiState={lfUiState}
        />
      );
    },
    //#endregion
  };
};

//#region Helpers
const prepIcon = (adapter: LfButtonAdapter, isDropdown = false): VNode => {
  const { controller, elements } = adapter;
  const { blocks, compInstance, framework, parts } = controller.get;
  const { isOn } = controller.computed;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();

  const { lfIcon, lfIconOff, lfToggable } = comp;
  const { assignRef, theme } = mgr;
  const { bemClass, get } = theme;
  const { refs } = elements;

  let icon = "";

  if (isDropdown) {
    icon = get.current().variables[LF_THEME_ICONS.dropdown];
  } else {
    const iconOff = lfIconOff ? lfIconOff : `off-${lfIcon}`;
    icon = lfToggable && !isOn() ? iconOff : lfIcon;
  }

  return (
    <div
      class={bemClass(b.button._, b.button.icon)}
      part={p.icon}
      ref={assignRef(refs, "icon")}
    >
      <FIcon framework={mgr} icon={icon as LfIconType} />
    </div>
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
//#endregion
