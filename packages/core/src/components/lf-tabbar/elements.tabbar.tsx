import {
  LfDataNode,
  LfTabbarAdapter,
  LfTabbarAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the tabbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isSelected, hasNodes)
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepTabbarElements = (
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterJsx => {
  return {
    //#region Tabbar
    tabbar: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;
      const { hasNodes } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { lfDataset, lfNavigation, lfUiSize } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass, get } = theme;
      const { "--lf-icon-next": next, "--lf-icon-previous": prev } =
        get.current().variables;
      const { refs } = elements;

      if (!hasNodes()) {
        return null;
      }

      const nodes = lfDataset.nodes;

      return (
        <div class={bemClass(b.tabbar._)} part={p.tabbbar} role="tablist">
          {lfNavigation && (
            <lf-button
              lfIcon={prev}
              lfStretchY={true}
              lfStyling="flat"
              lfUiSize={lfUiSize}
              onLf-button-event={(e) => {
                e.stopPropagation();
                handlers.navigation(undefined, "left");
              }}
            ></lf-button>
          )}
          <div
            class={bemClass(b.tabbar._, b.tabbar.scroll)}
            ref={assignRef(refs, "scrollContainer")}
          >
            {nodes.map((node: LfDataNode, index: number) =>
              prepTab(adapter, node, index),
            )}
          </div>
          {lfNavigation && (
            <lf-button
              lfIcon={next}
              lfStretchY={true}
              lfStyling="flat"
              lfUiSize={lfUiSize}
              onLf-button-event={(e) => {
                e.stopPropagation();
                handlers.navigation(undefined, "right");
              }}
            ></lf-button>
          )}
        </div>
      );
    },
    //#endregion
  };
};

//#region Tab
const prepTab = (
  adapter: LfTabbarAdapter,
  node: LfDataNode,
  index: number,
): VNode => {
  const { controller, elements, handlers } = adapter;
  const { blocks, compInstance, cyAttributes, framework, lfAttributes, parts } =
    controller.get;
  const { isSelected } = controller.computed;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();
  const cy = cyAttributes();
  const lf = lfAttributes();

  const { lfAriaLabel, lfUiState, rootElement } = comp;
  const { theme } = mgr;
  const { bemClass } = theme;
  const { refs } = elements;

  const selected = isSelected(index);

  return (
    <button
      aria-selected={selected}
      aria-label={(lfAriaLabel && node.value
        ? `${lfAriaLabel} ${node.value}`
        : node.value || lfAriaLabel || node.icon || rootElement.id || "tab"
      )
        .toString()
        .trim()}
      class={bemClass(b.tab._, null, {
        active: selected,
      })}
      data-cy={cy.button}
      data-lf={lf[lfUiState]}
      onClick={(e) => handlers.tab(e, "click", index, node)}
      onPointerDown={(e) => handlers.tab(e, "pointerdown", index, node)}
      part={p.tab}
      role="tab"
      tabIndex={index}
      title={node?.description || ""}
      ref={(el) => {
        if (el) {
          refs.tabs.set(index.toString(), el);
        }
      }}
    >
      <span class={bemClass(b.tab._, b.tab.content)} data-cy={cy.node}>
        {node.icon && prepIcon(adapter, node)}
        {node.value && (
          <span class={bemClass(b.tab._, b.tab.label)}>{node.value}</span>
        )}
      </span>
      <span
        class={bemClass(b.tab._, b.tab.indicator, {
          active: selected,
        })}
      >
        <span
          class={bemClass(b.tab._, b.tab.indicatorContent, {
            active: true,
          })}
        ></span>
      </span>
    </button>
  );
};
//#endregion

//#region Icon
const prepIcon = (adapter: LfTabbarAdapter, node: LfDataNode): VNode => {
  const { controller } = adapter;
  const { blocks, framework } = controller.get;

  const mgr = framework();
  const b = blocks();

  const { theme } = mgr;
  const { bemClass } = theme;

  return (
    <div class={bemClass(b.tab._, b.tab.icon)}>
      <FIcon framework={mgr} icon={node.icon} />
    </div>
  );
};
//#endregion
