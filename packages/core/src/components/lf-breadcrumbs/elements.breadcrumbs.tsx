import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterJsx,
  LfDataCell,
  LfDataNode,
  LfDataShapes,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { isTruncation, truncateBreadcrumbPath } from "./helpers.path";

//#region Constants
const PRIMITIVE_SHAPES = new Set(["text", "number", "slot"]);
//#endregion

/**
 * Prepares JSX factory functions for the breadcrumbs component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isInteractive, isExpanded, isEmpty)
 * - Uses `controller.actions` for complex operations (toggleExpand, setCurrentNode)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepBreadcrumbsJsx = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterJsx => {
  //#region Icon
  const icon = (node: LfDataNode): VNode | null => {
    const { controller, dispatcher } = getAdapter();
    const { blocks, framework, parts } = controller.get;
    const fw = framework();
    const b = blocks();
    const p = parts();
    const { bemClass } = fw.theme;

    const iconCell = node?.cells?.icon as LfDataCell<LfDataShapes> | undefined;
    if (!iconCell) {
      return null;
    }

    const iconProps = fw.data.cell.shapes.get(iconCell);
    const shape = iconProps.shape || "text";
    const isPrimitive = PRIMITIVE_SHAPES.has(shape);

    // Use cell.value as fallback for display
    const displayValue =
      "lfValue" in iconProps ? iconProps.lfValue : iconCell.value;

    return (
      <span class={bemClass(b.breadcrumbs._, b.breadcrumbs.icon)} part={p.icon}>
        {isPrimitive ? (
          fw.data.cell.stringify(displayValue as string | number | boolean)
        ) : (
          <LfShape
            cell={iconProps}
            eventDispatcher={async (e: Event) =>
              dispatcher.emit("lf-event", { originalEvent: e, node })
            }
            framework={fw}
            index={0}
            shape={shape}
          />
        )}
      </span>
    );
  };
  //#endregion

  //#region Item
  const item = (
    node: LfDataNode,
    index: number,
    totalItems: number,
  ): VNode[] => {
    const { controller, elements, handlers } = getAdapter();
    const { blocks, cyAttributes, framework, parts } = controller.get;
    const { isInteractive } = controller.computed;
    const { refs } = elements;
    const fw = framework();
    const b = blocks();
    const p = parts();
    const cy = cyAttributes();
    const { bemClass } = fw.theme;

    const isCurrent = index === totalItems - 1;
    const interactive = isInteractive();
    const isItemInteractive = interactive && !isCurrent;
    const label = fw.data.cell.stringify(node.value);

    return [
      <li
        aria-current={isCurrent ? "page" : undefined}
        class={bemClass(b.breadcrumbs._, b.breadcrumbs.item, {
          active: isCurrent,
        })}
        data-cy={cy.node}
        data-disabled={isItemInteractive ? undefined : "true"}
        key={node.id ?? `breadcrumb-${index}`}
        part={`${p.item}${isCurrent ? ` ${p.current}` : ""}`}
        ref={(el) => {
          if (!el || !node.id) {
            return;
          }
          refs.items.set(node.id, el);
        }}
        tabIndex={isItemInteractive ? 0 : undefined}
        onClick={(e) =>
          isItemInteractive && handlers.item.click(e as MouseEvent, node, index)
        }
        onKeyDown={(e) =>
          isItemInteractive &&
          handlers.item.keydown(e as KeyboardEvent, node, index)
        }
        onPointerDown={(e) =>
          isItemInteractive &&
          handlers.item.pointerdown(e as PointerEvent, node, index)
        }
      >
        <span
          class={bemClass(b.breadcrumbs._, b.breadcrumbs.label)}
          part={p.label}
        >
          {icon(node)}
          <span>{label}</span>
        </span>
      </li>,
      !isCurrent && separator(index),
    ];
  };
  //#endregion

  //#region Items
  const items = (): VNode | null => {
    const { controller } = getAdapter();
    const { blocks, compInstance, framework, parts, path } = controller.get;
    const { isExpanded } = controller.computed;
    const fw = framework();
    const b = blocks();
    const p = parts();
    const comp = compInstance();
    const { bemClass } = fw.theme;

    const pathNodes = path();

    // When expanded, show all items; otherwise apply truncation
    const renderable = isExpanded()
      ? pathNodes
      : truncateBreadcrumbPath(pathNodes, comp.lfMaxItems);

    if (!renderable.length) {
      return (
        <div
          class={bemClass(b.breadcrumbs._, b.breadcrumbs.empty)}
          part={p.empty}
        >
          {comp.lfEmpty}
        </div>
      );
    }

    const totalItems = renderable.length;

    return (
      <nav
        aria-label="Breadcrumb"
        class={bemClass(b.breadcrumbs._)}
        part={p.breadcrumbs}
      >
        <ol class={bemClass(b.breadcrumbs._, b.breadcrumbs.list)} part={p.list}>
          {renderable.map((entry, index) => {
            if (isTruncation(entry)) {
              return truncation(index, totalItems);
            }
            return item(entry, index, totalItems);
          })}
        </ol>
      </nav>
    );
  };
  //#endregion

  //#region Separator
  const separator = (index: number): VNode => {
    const { controller } = getAdapter();
    const {
      blocks,
      framework,
      parts,
      separator: getSeparator,
    } = controller.get;
    const fw = framework();
    const b = blocks();
    const p = parts();
    const { bemClass } = fw.theme;

    return (
      <span
        aria-hidden="true"
        class={bemClass(b.breadcrumbs._, b.breadcrumbs.separator)}
        key={`separator-${index}`}
        part={p.separator}
      >
        {getSeparator()}
      </span>
    );
  };
  //#endregion

  //#region Truncation
  const truncation = (index: number, totalItems: number): VNode[] => {
    const { controller, handlers } = getAdapter();
    const { blocks, framework, parts } = controller.get;
    const { isInteractive } = controller.computed;
    const fw = framework();
    const b = blocks();
    const p = parts();
    const { bemClass } = fw.theme;
    const isLast = index === totalItems - 1;
    const interactive = isInteractive();

    const dotClass = bemClass(b.breadcrumbs._, b.breadcrumbs.dot);

    return [
      <li
        class={bemClass(b.breadcrumbs._, b.breadcrumbs.truncation)}
        data-cy="truncation"
        key={`truncation-${index}`}
        onClick={(e) =>
          interactive && handlers.truncation.click(e as MouseEvent)
        }
        onKeyDown={(e) =>
          interactive && handlers.truncation.keydown(e as KeyboardEvent)
        }
        part={p.truncation}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        title={interactive ? "Click to expand all items" : undefined}
      >
        <span class={dotClass}>.</span>
        <span class={dotClass}>.</span>
        <span class={dotClass}>.</span>
      </li>,
      !isLast && separator(index),
    ];
  };
  //#endregion

  return {
    icon,
    item,
    items,
    separator,
    truncation,
  };
};
