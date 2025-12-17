import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_TABBAR_BLOCKS,
  LF_TABBAR_PARTS,
  LfDataNode,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

//#region Props Interface
/**
 * Props interface for the `LfTabbarFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfTabbarFCProps {
  /** Explicit accessible label prefix for tabs */
  ariaLabel?: string;
  /** Assigned class for custom styling */
  className?: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Dataset nodes representing the tabs */
  nodes: LfDataNode[];
  /** Whether to show navigation arrows for overflow */
  navigation?: boolean;
  /** Callback fired on tab click event */
  onTabClick?: (e: MouseEvent, index: number, node: LfDataNode) => void;
  /** Callback fired on tab pointer down event (for ripple) */
  onTabPointerDown?: (e: PointerEvent, index: number, node: LfDataNode) => void;
  /** Callback fired on navigation button click */
  onNavigationClick?: (direction: "left" | "right") => void;
  /** Reference callback for the scroll container */
  scrollContainerRef?: (el: HTMLDivElement | null) => void;
  /** Index of the currently selected tab */
  selectedIndex?: number;
  /** Custom CSS styles to apply */
  style?: { [key: string]: string };
  /** Reference callback for individual tab buttons */
  tabRef?: (el: HTMLButtonElement | null, index: number) => void;
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
//#endregion

//#region Blocks and Parts
const blocks = LF_TABBAR_BLOCKS;
const parts = LF_TABBAR_PARTS;
//#endregion

/**
 * LfTabbarFC - Functional Component for Tabbar
 *
 * This is a stateless functional component that renders a tabbar.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-tabbar Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via LfShape rendering (if tabbar becomes a data shape)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfTabbarFC: FunctionalComponent<LfTabbarFCProps> = ({
  ariaLabel = "",
  className,
  framework,
  id,
  nodes,
  navigation = false,
  onTabClick,
  onTabPointerDown,
  onNavigationClick,
  scrollContainerRef,
  selectedIndex = 0,
  style,
  tabRef,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass, get } = framework.theme;
  const { "--lf-icon-next": next, "--lf-icon-previous": prev } =
    get.current().variables;

  const { tabbar } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <div
      class={`${bemClass(tabbar._)}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.tabbbar}
      role="tablist"
      style={computedStyle}
    >
      {navigation && (
        <lf-button
          lfIcon={prev}
          lfStretchY={true}
          lfStyling="flat"
          lfUiSize={uiSize}
          onLf-button-event={(e: CustomEvent) => {
            e.stopPropagation();
            onNavigationClick?.("left");
          }}
        ></lf-button>
      )}
      <div class={bemClass(tabbar._, tabbar.scroll)} ref={scrollContainerRef}>
        {nodes.map((node: LfDataNode, index: number) =>
          renderTab({
            ariaLabel,
            framework,
            index,
            node,
            onTabClick,
            onTabPointerDown,
            selectedIndex,
            tabRef,
            uiState,
          }),
        )}
      </div>
      {navigation && (
        <lf-button
          lfIcon={next}
          lfStretchY={true}
          lfStyling="flat"
          lfUiSize={uiSize}
          onLf-button-event={(e: CustomEvent) => {
            e.stopPropagation();
            onNavigationClick?.("right");
          }}
        ></lf-button>
      )}
    </div>
  );
};

//#region Tab Renderer
interface TabProps {
  ariaLabel: string;
  framework: LfFrameworkInterface;
  index: number;
  node: LfDataNode;
  onTabClick?: (e: MouseEvent, index: number, node: LfDataNode) => void;
  onTabPointerDown?: (e: PointerEvent, index: number, node: LfDataNode) => void;
  selectedIndex: number;
  tabRef?: (el: HTMLButtonElement | null, index: number) => void;
  uiState: LfThemeUIState;
}

const renderTab = ({
  ariaLabel,
  framework,
  index,
  node,
  onTabClick,
  onTabPointerDown,
  selectedIndex,
  tabRef,
  uiState,
}: TabProps): VNode => {
  const { bemClass } = framework.theme;
  const { tab } = blocks;

  const cy = CY_ATTRIBUTES;
  const lf = LF_ATTRIBUTES;
  const selected = index === selectedIndex;

  return (
    <button
      aria-selected={selected}
      aria-label={(ariaLabel && node.value
        ? `${ariaLabel} ${node.value}`
        : node.value || ariaLabel || node.icon || "tab"
      )
        .toString()
        .trim()}
      class={bemClass(tab._, null, {
        active: selected,
      })}
      data-cy={cy.button}
      data-lf={lf[uiState]}
      onClick={(e) => onTabClick?.(e, index, node)}
      onPointerDown={(e) => onTabPointerDown?.(e, index, node)}
      part={parts.tab}
      role="tab"
      tabIndex={index}
      title={node?.description || ""}
      ref={(el) => tabRef?.(el, index)}
    >
      <span class={bemClass(tab._, tab.content)} data-cy={cy.node}>
        {node.icon && renderIcon(framework, node)}
        {node.value && (
          <span class={bemClass(tab._, tab.label)}>{node.value}</span>
        )}
      </span>
      <span
        class={bemClass(tab._, tab.indicator, {
          active: selected,
        })}
      >
        <span
          class={bemClass(tab._, tab.indicatorContent, {
            active: true,
          })}
        ></span>
      </span>
    </button>
  );
};
//#endregion

//#region Icon Renderer
const renderIcon = (
  framework: LfFrameworkInterface,
  node: LfDataNode,
): VNode => {
  const { bemClass } = framework.theme;
  const { tab } = blocks;

  return (
    <div class={bemClass(tab._, tab.icon)}>
      <FIcon framework={framework} icon={node.icon} />
    </div>
  );
};
//#endregion
