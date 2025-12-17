import {
  LF_BREADCRUMBS_BLOCKS,
  LF_BREADCRUMBS_PARTS,
  LfBreadcrumbsFCProps,
  LfDataCell,
  LfDataNode,
  LfDataShapes,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { isTruncation, truncateBreadcrumbPath } from "./helpers.path";

//#region Constants
const PRIMITIVE_SHAPES = new Set(["text", "number", "slot"]);
//#endregion

/**
 * LfBreadcrumbsFC - Functional Component for Breadcrumbs
 *
 * This is a stateless functional component that renders breadcrumb navigation.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-breadcrumbs Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via direct import for custom implementations
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
export const LfBreadcrumbsFC: FunctionalComponent<LfBreadcrumbsFCProps> = ({
  breadcrumbsRef,
  className,
  cyAttributes,
  empty = "Empty data.",
  framework,
  id,
  isExpanded = false,
  isInteractive = true,
  maxItems,
  onItemClick,
  onItemKeydown,
  onItemPointerdown,
  onTruncationClick,
  onTruncationKeydown,
  path,
  refItems,
  separator = ">",
  style,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_BREADCRUMBS_BLOCKS;
  const parts = LF_BREADCRUMBS_PARTS;

  const { breadcrumbs } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // When expanded, show all items; otherwise apply truncation
  const renderable = isExpanded ? path : truncateBreadcrumbPath(path, maxItems);

  //#region Icon Renderer
  const renderIcon = (node: LfDataNode): VNode | null => {
    const iconCell = node?.cells?.icon as LfDataCell<LfDataShapes> | undefined;
    if (!iconCell) {
      return null;
    }

    const iconProps = framework.data.cell.shapes.get(iconCell);
    const shape = iconProps.shape || "text";
    const isPrimitive = PRIMITIVE_SHAPES.has(shape);

    const displayValue =
      "lfValue" in iconProps ? iconProps.lfValue : iconCell.value;

    return (
      <span class={bemClass(breadcrumbs._, breadcrumbs.icon)} part={parts.icon}>
        {isPrimitive ? (
          framework.data.cell.stringify(
            displayValue as string | number | boolean,
          )
        ) : (
          <LfShape
            cell={iconProps}
            eventDispatcher={async () => {}}
            framework={framework}
            index={0}
            shape={shape}
          />
        )}
      </span>
    );
  };
  //#endregion

  //#region Separator Renderer
  const renderSeparator = (index: number): VNode => {
    return (
      <span
        aria-hidden="true"
        class={bemClass(breadcrumbs._, breadcrumbs.separator)}
        key={`separator-${index}`}
        part={parts.separator}
      >
        {separator}
      </span>
    );
  };
  //#endregion

  //#region Item Renderer
  const renderItem = (
    node: LfDataNode,
    index: number,
    totalItems: number,
  ): VNode[] => {
    const isCurrent = index === totalItems - 1;
    const isItemInteractive = isInteractive && !isCurrent;
    const label = framework.data.cell.stringify(node.value);

    return [
      <li
        aria-current={isCurrent ? "page" : undefined}
        class={bemClass(breadcrumbs._, breadcrumbs.item, {
          active: isCurrent,
        })}
        data-cy={cyAttributes?.node}
        data-disabled={isItemInteractive ? undefined : "true"}
        key={node.id ?? `breadcrumb-${index}`}
        part={`${parts.item}${isCurrent ? ` ${parts.current}` : ""}`}
        ref={(el) => {
          if (!el || !node.id || !refItems) {
            return;
          }
          refItems.set(node.id, el);
        }}
        tabIndex={isItemInteractive ? 0 : undefined}
        onClick={(e) =>
          isItemInteractive && onItemClick?.(e as MouseEvent, node, index)
        }
        onKeyDown={(e) =>
          isItemInteractive && onItemKeydown?.(e as KeyboardEvent, node, index)
        }
        onPointerDown={(e) =>
          isItemInteractive &&
          onItemPointerdown?.(e as PointerEvent, node, index)
        }
      >
        <span
          class={bemClass(breadcrumbs._, breadcrumbs.label)}
          part={parts.label}
        >
          {renderIcon(node)}
          <span>{label}</span>
        </span>
      </li>,
      !isCurrent && renderSeparator(index),
    ];
  };
  //#endregion

  //#region Truncation Renderer
  const renderTruncation = (index: number, totalItems: number): VNode[] => {
    const isLast = index === totalItems - 1;

    const dotClass = bemClass(breadcrumbs._, breadcrumbs.dot);

    return [
      <li
        class={bemClass(breadcrumbs._, breadcrumbs.truncation)}
        data-cy="truncation"
        key={`truncation-${index}`}
        onClick={(e) => isInteractive && onTruncationClick?.(e as MouseEvent)}
        onKeyDown={(e) =>
          isInteractive && onTruncationKeydown?.(e as KeyboardEvent)
        }
        part={parts.truncation}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        title={isInteractive ? "Click to expand all items" : undefined}
      >
        <span class={dotClass}>.</span>
        <span class={dotClass}>.</span>
        <span class={dotClass}>.</span>
      </li>,
      !isLast && renderSeparator(index),
    ];
  };
  //#endregion

  //#region Empty State
  if (!renderable.length) {
    return (
      <div
        class={`${bemClass(breadcrumbs._, breadcrumbs.empty)}${className ? ` ${className}` : ""}`}
        data-lf={uiState}
        id={id}
        part={parts.empty}
        ref={breadcrumbsRef}
        style={computedStyle}
      >
        {empty}
      </div>
    );
  }
  //#endregion

  //#region Main Render
  const totalItems = renderable.length;

  return (
    <nav
      aria-label="Breadcrumb"
      class={`${bemClass(breadcrumbs._)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.breadcrumbs}
      ref={breadcrumbsRef}
      style={computedStyle}
    >
      <ol class={bemClass(breadcrumbs._, breadcrumbs.list)} part={parts.list}>
        {renderable.map((entry, index) => {
          if (isTruncation(entry)) {
            return renderTruncation(index, totalItems);
          }
          return renderItem(entry, index, totalItems);
        })}
      </ol>
    </nav>
  );
  //#endregion
};
