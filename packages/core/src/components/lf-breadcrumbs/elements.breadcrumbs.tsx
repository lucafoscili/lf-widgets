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

export const prepBreadcrumbsJsx = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterJsx => {
  //#region Icon
  const icon = (node: LfDataNode): VNode | null => {
    const { controller } = getAdapter();
    const { blocks, compInstance, manager, parts } = controller.get;
    const fw = manager();
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
      <span
        class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.icon)}
        part={parts.icon}
      >
        {isPrimitive ? (
          fw.data.cell.stringify(displayValue as string | number | boolean)
        ) : (
          <LfShape
            cell={iconProps}
            eventDispatcher={async (e: Event) =>
              compInstance.onLfEvent(e, "lf-event", { node })
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
    const { blocks, cyAttributes, isInteractive, manager, parts } =
      controller.get;
    const { refs } = elements;
    const fw = manager();
    const { bemClass } = fw.theme;

    const isCurrent = index === totalItems - 1;
    const interactive = isInteractive();
    const isItemInteractive = interactive && !isCurrent;
    const label = fw.data.cell.stringify(node.value);

    return [
      <li
        aria-current={isCurrent ? "page" : undefined}
        class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.item, {
          active: isCurrent,
        })}
        data-cy={cyAttributes.node}
        data-disabled={isItemInteractive ? undefined : "true"}
        key={node.id ?? `breadcrumb-${index}`}
        part={`${parts.item}${isCurrent ? ` ${parts.current}` : ""}`}
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
          class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.label)}
          part={parts.label}
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
    const { blocks, compInstance, expanded, manager, parts, path } =
      controller.get;
    const fw = manager();
    const { bemClass } = fw.theme;

    const pathNodes = path();

    // When expanded, show all items; otherwise apply truncation
    const renderable = expanded()
      ? pathNodes
      : truncateBreadcrumbPath(pathNodes, compInstance.lfMaxItems);

    if (!renderable.length) {
      return (
        <div
          class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.empty)}
          part={parts.empty}
        >
          {compInstance.lfEmpty}
        </div>
      );
    }

    const totalItems = renderable.length;

    return (
      <nav
        aria-label="Breadcrumb"
        class={bemClass(blocks.breadcrumbs._)}
        part={parts.breadcrumbs}
      >
        <ol
          class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.list)}
          part={parts.list}
        >
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
    const { blocks, manager, parts, separator: getSeparator } = controller.get;
    const { bemClass } = manager().theme;

    return (
      <span
        aria-hidden="true"
        class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.separator)}
        key={`separator-${index}`}
        part={parts.separator}
      >
        {getSeparator()}
      </span>
    );
  };
  //#endregion

  //#region Truncation
  const truncation = (index: number, totalItems: number): VNode[] => {
    const { controller, handlers } = getAdapter();
    const { blocks, isInteractive, manager, parts } = controller.get;
    const { bemClass } = manager().theme;
    const isLast = index === totalItems - 1;
    const interactive = isInteractive();

    const dotClass = bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.dot);

    return [
      <li
        class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.truncation)}
        data-cy="truncation"
        key={`truncation-${index}`}
        onClick={(e) =>
          interactive && handlers.truncation.click(e as MouseEvent)
        }
        onKeyDown={(e) =>
          interactive && handlers.truncation.keydown(e as KeyboardEvent)
        }
        part={parts.truncation}
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
