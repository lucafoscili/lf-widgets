import {
  LF_THEME_ICONS,
  LfDataNode,
  LfIconType,
  LfListAdapter,
  LfListAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";
import { FIcon } from "../../utils/icon";
import { LfListFC } from "./lf-list-fc";

/**
 * Prepares JSX factory functions for the list component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isDisabled, isEmpty, isFilteredEmpty)
 * - Uses `controller.actions` for complex operations
 * - Routes all events through handlers (which use dispatcher)
 *
 * FC-First Pattern:
 * - The `list` JSX factory renders the LfListFC functional component
 * - Individual factories (deleteIcon, filter, icon, node, subtitle, title)
 *   are kept for backward compatibility and composed usage
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
      const { blocks, compInstance, framework } = controller.get;
      const { refs } = elements;

      const b = blocks();
      const comp = compInstance();
      const mgr = framework();

      const { lfUiSize, lfUiState } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      const iconSearch = theme.get.current().variables[
        "--lf-icon-search"
      ] as LfIconType;

      return (
        <LfTextfieldFC
          className={bemClass(b.list._, b.list.filter)}
          framework={mgr}
          icon={iconSearch}
          inputRef={(el) => assignRef(refs, "filter")(el)}
          label="Search..."
          onInput={(value, e) => handlers.filterInput(e, value)}
          styling="flat"
          uiSize={lfUiSize}
          uiState={lfUiState}
          value=""
        />
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

    //#region List (FC-First)
    /**
     * Renders the list using the LfListFC functional component.
     * This is the FC-first entry point for rendering the list items.
     *
     * @param items - Array of visible nodes to render
     * @param onItemRef - Optional callback to capture list item refs
     * @returns VNode for the list
     */
    list: (
      items: LfDataNode[],
      onItemRef?: (el: HTMLLIElement | null, index: number) => void,
    ) => {
      const { controller, handlers } = getAdapter();
      const { get, computed } = controller;

      const compInstance = get.compInstance();
      const framework = get.framework();

      const {
        lfEmpty,
        lfEnableDeletions,
        lfSelectable,
        lfUiSize,
        lfUiState,
        lfDataset,
      } = compInstance;

      const selected = get.selected();
      const focused = get.focused();
      const isFilteredEmpty = computed.isFilteredEmpty();

      // Determine the empty message
      const emptyMessage = isFilteredEmpty
        ? "No items match your filter."
        : lfEmpty;

      // Find the visible index that corresponds to the selected original index
      const selectedVisibleIndex =
        selected !== null && selected !== undefined
          ? items.findIndex(
              (node: LfDataNode) =>
                lfDataset?.nodes?.findIndex((n) => n.id === node.id) ===
                selected,
            )
          : undefined;

      return (
        <LfListFC
          emptyMessage={emptyMessage}
          enableDeletions={lfEnableDeletions}
          focusedIndex={focused}
          framework={framework}
          items={items}
          onDeleteClick={(e, node, _index) => {
            handlers.deleteIcon(e, node);
          }}
          onItemBlur={(e, node, index) => {
            handlers.node.blur(e, node, index);
          }}
          onItemClick={(e, node, index) => {
            handlers.node.click(e, node, index);
          }}
          onItemFocus={(e, node, index) => {
            handlers.node.focus(e, node, index);
          }}
          onItemPointerDown={(e, node, index) => {
            handlers.node.pointerdown(e, node, index);
          }}
          onItemRef={onItemRef}
          selectable={lfSelectable}
          selectedIndex={selectedVisibleIndex}
          uiSize={lfUiSize}
          uiState={lfUiState}
        />
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
