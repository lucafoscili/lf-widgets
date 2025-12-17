import {
  LF_LIST_BLOCKS,
  LF_LIST_PARTS,
  LF_THEME_ICONS,
  LfDataNode,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../utils/icon";

//#region Props
/**
 * Props interface for the `LfListFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfListFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Whether items can be deleted */
  enableDeletions?: boolean;
  /** Empty message when no items exist */
  emptyMessage?: string;
  /** Currently focused item index */
  focusedIndex?: number;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** List items (nodes) to render */
  items?: LfDataNode[];
  /** Reference callback for the list element */
  listRef?: (el: HTMLUListElement | null) => void;
  /** Callback fired when delete icon is clicked */
  onDeleteClick?: (e: MouseEvent, node: LfDataNode, index: number) => void;
  /** Callback fired when item is blurred */
  onItemBlur?: (e: FocusEvent, node: LfDataNode, index: number) => void;
  /** Callback fired when item is clicked */
  onItemClick?: (e: MouseEvent, node: LfDataNode, index: number) => void;
  /** Callback fired when item is focused */
  onItemFocus?: (e: FocusEvent, node: LfDataNode, index: number) => void;
  /** Callback fired on item pointerdown */
  onItemPointerDown?: (
    e: PointerEvent,
    node: LfDataNode,
    index: number,
  ) => void;
  /** Reference callback for individual item elements */
  onItemRef?: (el: HTMLLIElement | null, index: number) => void;
  /** Whether items are selectable */
  selectable?: boolean;
  /** Currently selected item index (original dataset index) */
  selectedIndex?: number;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /**
   * UI size multiplier for the component.
   * Controls font-size scaling. Required for composed usage where
   * CSS inheritance from :host doesn't work (e.g., portaled content).
   * @default "medium"
   */
  uiSize?: LfThemeUISize;
  /**
   * UI state for theming (primary, success, warning, danger, etc.).
   * Controls color scheme. Required for composed usage where
   * CSS cascade doesn't work (e.g., portaled content).
   * @default "primary"
   */
  uiState?: LfThemeUIState;
}

/**
 * Props for individual list item rendering.
 */
interface ListItemProps {
  enableDeletions?: boolean;
  framework: LfFrameworkInterface;
  index: number;
  isFocused: boolean;
  isSelected: boolean;
  node: LfDataNode;
  onDeleteClick?: (e: MouseEvent, node: LfDataNode, index: number) => void;
  onItemBlur?: (e: FocusEvent, node: LfDataNode, index: number) => void;
  onItemClick?: (e: MouseEvent, node: LfDataNode, index: number) => void;
  onItemFocus?: (e: FocusEvent, node: LfDataNode, index: number) => void;
  onItemPointerDown?: (
    e: PointerEvent,
    node: LfDataNode,
    index: number,
  ) => void;
  onItemRef?: (el: HTMLLIElement | null, index: number) => void;
  uiState?: LfThemeUIState;
}
//#endregion

//#region List Item FC
/**
 * Individual list item component.
 * Renders the node content with icon, title, subtitle, and delete button.
 */
const ListItemFC: FunctionalComponent<ListItemProps> = ({
  enableDeletions,
  framework,
  index,
  isFocused,
  isSelected,
  node,
  onDeleteClick,
  onItemBlur,
  onItemClick,
  onItemFocus,
  onItemPointerDown,
  onItemRef,
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;
  const { stringify } = framework.data.cell;

  const blocks = LF_LIST_BLOCKS;
  const parts = LF_LIST_PARTS;
  const { deleteIcon, list, node: nodeBlock } = blocks;

  const hasValue = String(node.value).valueOf().trim().length > 0;
  const hasDescription = !!node.description;

  return (
    <li
      class={bemClass(list._, list.item, {
        focused: isFocused,
        "has-description": hasDescription,
        selected: isSelected,
      })}
      data-lf={uiState}
      key={node.id}
      ref={(el) => onItemRef?.(el, index)}
    >
      {/* Delete Icon */}
      {enableDeletions && (
        <div
          class={bemClass(deleteIcon._)}
          data-cy="button"
          onClick={(e) => onDeleteClick?.(e, node, index)}
          part={parts.deleteIcon}
        >
          <div
            class={bemClass(deleteIcon._, deleteIcon.icon)}
            key={`${node.id}_delete`}
          >
            <FIcon framework={framework} icon={LF_THEME_ICONS.clear} />
          </div>
        </div>
      )}

      {/* Node Content */}
      <div
        aria-checked={isSelected}
        aria-selected={isSelected}
        class={bemClass(nodeBlock._)}
        data-cy="node"
        data-index={index.toString()}
        onBlur={(e) => onItemBlur?.(e, node, index)}
        onClick={(e) => onItemClick?.(e, node, index)}
        onFocus={(e) => onItemFocus?.(e, node, index)}
        onPointerDown={(e) => onItemPointerDown?.(e, node, index)}
        part={parts.node}
        role="option"
        tabindex={isSelected || isFocused ? "0" : "-1"}
        title={stringify(node.value) || stringify(node.description)}
      >
        {/* Icon */}
        {node.icon && (
          <div class={bemClass(nodeBlock._, nodeBlock.icon)} part={parts.icon}>
            <FIcon framework={framework} icon={node.icon} />
          </div>
        )}

        {/* Text Content */}
        <span class={bemClass(nodeBlock._, nodeBlock.text)}>
          {hasValue && (
            <div
              class={bemClass(nodeBlock._, nodeBlock.title)}
              part={parts.title}
            >
              {String(node.value).valueOf()}
            </div>
          )}
          {hasDescription && (
            <div
              class={bemClass(nodeBlock._, nodeBlock.subtitle)}
              part={parts.subtitle}
            >
              {node.description}
            </div>
          )}
        </span>
      </div>
    </li>
  );
};
//#endregion

//#region List FC
/**
 * LfListFC - Functional Component for List
 *
 * This is a stateless functional component that renders a list of items.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-list Web Component (thin wrapper)
 * 2. Inside other components like combobox, dropdown (composed usage)
 * 3. Via adapter wrapper for Web Component integration
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * State/Size Props:
 * - `uiState`: Controls color scheme via `data-lf` attribute
 * - `uiSize`: Controls sizing via CSS variable `--lf-fc-ui-size`
 * These are required for composed usage where CSS cascade doesn't work
 * (e.g., portaled content outside the DOM hierarchy).
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfListFC: FunctionalComponent<LfListFCProps> = ({
  className,
  enableDeletions = false,
  emptyMessage = "Empty data.",
  focusedIndex,
  framework,
  id,
  items = [],
  listRef,
  onDeleteClick,
  onItemBlur,
  onItemClick,
  onItemFocus,
  onItemPointerDown,
  onItemRef,
  selectable = true,
  selectedIndex,
  style,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_LIST_BLOCKS;
  const parts = LF_LIST_PARTS;
  const { emptyData, list } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  const isEmpty = !items || items.length === 0;

  // Render empty state
  if (isEmpty) {
    return (
      <div
        class={`${bemClass(emptyData._)}${className ? ` ${className}` : ""}`}
        data-lf={uiState}
        id={id}
        part={parts.emptyData}
        style={computedStyle}
      >
        <div class={bemClass(emptyData._, emptyData.text)}>{emptyMessage}</div>
      </div>
    );
  }

  // Render list with items
  return (
    <ul
      aria-multiselectable="false"
      class={`${bemClass(list._, null, {
        empty: isEmpty,
        selectable,
      })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.list}
      ref={listRef}
      role="listbox"
      style={computedStyle}
    >
      {items.map((node, index) => {
        const isSelected = index === selectedIndex;
        const isFocused = index === focusedIndex;

        return (
          <ListItemFC
            enableDeletions={enableDeletions}
            framework={framework}
            index={index}
            isFocused={isFocused}
            isSelected={isSelected}
            node={node}
            onDeleteClick={onDeleteClick}
            onItemBlur={onItemBlur}
            onItemClick={onItemClick}
            onItemFocus={onItemFocus}
            onItemPointerDown={onItemPointerDown}
            onItemRef={onItemRef}
            uiState={uiState}
          />
        );
      })}
    </ul>
  );
};
//#endregion
