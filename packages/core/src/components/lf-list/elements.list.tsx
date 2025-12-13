import {
  LF_THEME_ICONS,
  LfListAdapter,
  LfListAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the list component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, isEmpty, isFilteredEmpty)
 * - Uses `controller.actions` for complex operations
 * - Routes all events through handlers (which use dispatcher)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepList = (getAdapter: () => LfListAdapter): LfListAdapterJsx => {
  return {
    //#region Delete Icon
    deleteIcon: (node) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, framework, lfAttributes, parts } =
        controller.get;
      const { refs } = elements;
      const { deleteIcon } = handlers;

      const b = blocks();
      const cy = cyAttributes();
      const lf = lfAttributes();
      const p = parts();
      const mgr = framework();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(b.deleteIcon._)}
          data-cy={cy.button}
          data-lf={lf.icon}
          onClick={(e) => deleteIcon(e, node)}
          part={p.deleteIcon}
          ref={assignRef(refs, "deleteIcon")}
        >
          <div
            class={bemClass(b.deleteIcon._, b.deleteIcon.icon)}
            key={node.id + "_delete"}
          >
            <FIcon framework={mgr} icon={LF_THEME_ICONS.clear} />
          </div>
        </div>
      );
    },
    //#endregion

    //#region Filter
    filter: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, framework, lfAttributes, parts } =
        controller.get;
      const { refs } = elements;
      const { filter } = handlers;

      const b = blocks();
      const lf = lfAttributes();
      const p = parts();
      const comp = compInstance();
      const mgr = framework();

      const { lfUiSize, lfUiState } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      const iconSearch = theme.get.current().variables["--lf-icon-search"];

      return (
        <lf-textfield
          class={bemClass(b.list._, b.list.filter)}
          data-lf={lf[lfUiState]}
          lfIcon={iconSearch}
          lfLabel="Search..."
          lfStretchX={true}
          lfStyling="flat"
          lfUiSize={lfUiSize}
          lfUiState={lfUiState}
          onLf-textfield-event={filter}
          part={p.filter}
          ref={assignRef(refs, "filter")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Icon
    icon(node) {
      const { controller, elements } = getAdapter();
      const { blocks, framework, parts } = controller.get;

      const b = blocks();
      const p = parts();
      const mgr = framework();

      const { assignRef } = mgr;
      const { bemClass } = mgr.theme;
      const { refs } = elements;

      return (
        <div
          class={bemClass(b.node._, b.node.icon)}
          part={p.icon}
          ref={assignRef(refs, "icon")}
        >
          <FIcon framework={mgr} icon={node.icon} />
        </div>
      );
    },
    //#endregion

    //#region Node
    node: (node, index, isSelected) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, focused, framework, parts } =
        controller.get;
      const { jsx, refs } = elements;

      const b = blocks();
      const cy = cyAttributes();
      const p = parts();
      const mgr = framework();

      const { assignRef, data, theme } = mgr;
      const { stringify } = data.cell;
      const { bemClass } = theme;

      const hasValue = String(node.value).valueOf().trim().length > 0;
      const isFocused = focused() === index;

      return (
        <div
          aria-checked={isSelected}
          aria-selected={isSelected}
          class={bemClass(b.node._)}
          data-cy={cy.node}
          data-index={index.toString()}
          onBlur={(e) => handlers.node.blur(e, node, index)}
          onClick={(e) => handlers.node.click(e, node, index)}
          onFocus={(e) => handlers.node.focus(e, node, index)}
          onPointerDown={(e) => handlers.node.pointerdown(e, node, index)}
          part={p.node}
          ref={assignRef(refs, "node")}
          role={"option"}
          tabindex={isSelected || isFocused ? "0" : "-1"}
          title={stringify(node.value) || stringify(node.description)}
        >
          {node.icon && jsx.icon(node)}
          <span class={bemClass(b.node._, b.node.text)}>
            {hasValue && jsx.title(node)}
            {node.description && jsx.subtitle(node)}
          </span>
        </div>
      );
    },
    //#endregion

    //#region Subtitle
    subtitle: (node) => {
      const { controller, elements } = getAdapter();
      const { blocks, framework, parts } = controller.get;
      const { refs } = elements;

      const b = blocks();
      const p = parts();
      const mgr = framework();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(b.node._, b.node.subtitle)}
          part={p.subtitle}
          ref={assignRef(refs, "subtitle")}
        >
          {node.description}
        </div>
      );
    },
    //#endregion

    //#region Title
    title: (node) => {
      const { controller, elements } = getAdapter();
      const { blocks, framework, parts } = controller.get;
      const { refs } = elements;

      const b = blocks();
      const p = parts();
      const mgr = framework();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      return (
        <div
          class={bemClass(b.node._, b.node.title)}
          part={p.title}
          ref={assignRef(refs, "title")}
        >
          {String(node.value).valueOf()}
        </div>
      );
    },
    //#endregion
  };
};
