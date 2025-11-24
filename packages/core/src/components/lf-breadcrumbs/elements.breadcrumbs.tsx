import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterJsx,
  LfDataCell,
  LfDataNode,
  LfDataShapes,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { isTruncation, truncateBreadcrumbPath } from "./helpers.path";

export const prepBreadcrumbsJsx = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterJsx => {
  return {
    //#region Items
    items: () => {
      //FIXME: items is too big, split in smaller elements
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        isEnabled,
        lfAttributes,
        manager,
        parts,
        path,
        separator,
      } = controller.get;
      const { refs } = elements;
      const fw = manager();
      const { bemClass } = fw.theme;

      const pathNodes = path();
      const renderable = truncateBreadcrumbPath(
        pathNodes,
        compInstance.lfMaxItems,
      );
      const interactive = isEnabled(compInstance.lfInteractive);
      const ripple = isEnabled(compInstance.lfRipple);
      const lastIndex = renderable.length - 1;

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

      const renderIcon = (node: LfDataNode) => {
        const iconCell = node?.cells?.icon as
          | LfDataCell<LfDataShapes>
          | undefined;
        if (!iconCell) {
          return null;
        }

        const iconProps = fw.data.cell.shapes.get(iconCell);
        if (!Object.prototype.hasOwnProperty.call(iconProps, "lfValue")) {
          (
            iconProps as LfDataCell<LfDataShapes> & { lfValue?: unknown }
          ).lfValue = iconCell.value;
        }

        const shape = iconProps.shape || "text";
        const simple =
          shape === "text" || shape === "number" || shape === "slot";

        return (
          <span
            class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.icon)}
            part={parts.icon}
          >
            {simple ? (
              fw.data.cell.stringify(
                ((iconProps as LfDataCell<LfDataShapes> & { lfValue?: unknown })
                  .lfValue ?? iconCell.value) as any, //FIXME: why do we have to resort to using any? antipattern? let's investigate
              )
            ) : (
              <LfShape
                framework={fw}
                shape={shape}
                index={0}
                cell={iconProps}
                eventDispatcher={async (e: Event) =>
                  compInstance.onLfEvent(e, "lf-event", { node })
                }
              ></LfShape>
            )}
          </span>
        );
      };

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
                return (
                  <li
                    class={bemClass(
                      blocks.breadcrumbs._,
                      blocks.breadcrumbs.truncation,
                    )}
                    key={`truncation-${index}`}
                    part={parts.truncation}
                  >
                    &hellip;
                    {index < lastIndex ? (
                      <span
                        aria-hidden="true"
                        class={bemClass(
                          blocks.breadcrumbs._,
                          blocks.breadcrumbs.separator,
                        )}
                        part={parts.separator}
                      >
                        {separator()}
                      </span>
                    ) : null}
                  </li>
                );
              }

              const node = entry as LfDataNode;
              const isCurrent = index === lastIndex;
              const isItemInteractive = interactive && !isCurrent;
              const label = fw.data.cell.stringify(node.value);

              return (
                <li
                  aria-current={isCurrent ? "page" : undefined}
                  class={bemClass(
                    blocks.breadcrumbs._,
                    blocks.breadcrumbs.item,
                    { active: isCurrent },
                  )}
                  data-cy={cyAttributes.node}
                  data-disabled={isItemInteractive ? undefined : "true"}
                  data-lf={
                    ripple && isItemInteractive
                      ? lfAttributes.rippleSurface
                      : undefined
                  }
                  key={node.id ?? `breadcrumb-${index}`}
                  part={`${parts.item}${isCurrent ? ` ${parts.current}` : ""}`}
                  ref={(el) => {
                    if (!el || !node.id) {
                      return;
                    }
                    refs.items.set(node.id, el);
                    if (ripple) {
                      refs.ripples.set(node.id, el);
                    }
                  }}
                  tabIndex={isItemInteractive ? 0 : undefined}
                  onClick={(e) =>
                    isItemInteractive &&
                    handlers.item.click(e as MouseEvent, node, index)
                  }
                  onKeyDown={(e) =>
                    isItemInteractive &&
                    handlers.item.keydown(e as KeyboardEvent, node, index)
                  }
                >
                  <span
                    class={bemClass(
                      blocks.breadcrumbs._,
                      blocks.breadcrumbs.label,
                    )}
                    part={parts.label}
                  >
                    {renderIcon(node)}
                    <span>{label}</span>
                  </span>
                  {index < lastIndex ? (
                    <span
                      aria-hidden="true"
                      class={bemClass(
                        blocks.breadcrumbs._,
                        blocks.breadcrumbs.separator,
                      )}
                      part={parts.separator}
                    >
                      {separator()}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      );
    },
    //#endregion

    //#region Separator
    separator: (index: number) => {
      const { blocks, manager, parts, separator } = getAdapter().controller.get;
      const { bemClass } = manager().theme;

      return (
        <span
          aria-hidden="true"
          class={bemClass(blocks.breadcrumbs._, blocks.breadcrumbs.separator)}
          key={`separator-${index}`}
          part={parts.separator}
        >
          {separator()}
        </span>
      );
    },
    //#endregion
  };
};
