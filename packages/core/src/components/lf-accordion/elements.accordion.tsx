import {
  LF_THEME_ICONS,
  LfAccordionAdapter,
  LfAccordionAdapterJsx,
  LfDataNode,
  LfIconType,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { LfShape } from "../../utils/shapes";

/**
 * Prepares JSX factory functions for the accordion component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isExpanded, isExpandible, isSelected)
 * - Uses `controller.actions` for complex operations (toggle)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepAccordion = (
  getAdapter: () => LfAccordionAdapter,
): LfAccordionAdapterJsx => {
  return {
    //#region Accordion
    accordion: () => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { compInstance } = controller.get;

      const comp = compInstance();
      const { lfDataset } = comp;

      if (!lfDataset || !lfDataset.nodes) {
        return [];
      }

      const nodes: VNode[] = [];
      for (let i = 0; i < lfDataset.nodes.length; i++) {
        nodes.push(prepNode(adapter, lfDataset.nodes[i]));
      }
      return nodes;
    },
    //#endregion
  };
};

//#region Helpers
const prepNode = (adapter: LfAccordionAdapter, node: LfDataNode): VNode => {
  const { controller, dispatcher, elements } = adapter;
  const { blocks, compInstance, cyAttributes, framework, lfAttributes, parts } =
    controller.get;
  const { isExpanded, isExpandible, isSelected } = controller.computed;
  const { toggle } = controller.actions;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();
  const cy = cyAttributes();
  const lf = lfAttributes();

  const { lfUiState } = comp;
  const { theme } = mgr;
  const { bemClass } = theme;
  const { refs } = elements;

  const expanded = isExpanded(node);
  const expandible = isExpandible(node);
  const selected = isSelected(node);

  return (
    <div class={bemClass(b.node._)} data-cy={cy.node} data-lf={lf[lfUiState]}>
      <div
        class={bemClass(b.node._, b.node.header, {
          expanded: expandible && expanded,
          selected: !expandible && selected,
        })}
        data-cy={!expandible && cy.button}
        onClick={(e) => toggle(node, e)}
        onPointerDown={(e) =>
          dispatcher.emit("pointerdown", { originalEvent: e })
        }
        part={p.header}
        tabindex="1"
        title={node.description}
        ref={(el) => {
          if (el) {
            refs.headers.set(node.id, el);
          }
        }}
      >
        {node.icon ? prepIcon(adapter, node.icon) : null}
        <span class={bemClass(b.node._, b.node.text)} part={p.text}>
          {node.value}
        </span>
        {expandible && (
          <div
            class={bemClass(b.node._, b.node.expand, {
              expanded: expanded,
            })}
            data-cy={cy.dropdownButton}
            data-lf={lf.icon}
            part={p.icon}
          >
            <FIcon framework={mgr} icon={LF_THEME_ICONS.dropdown} />
          </div>
        )}
      </div>
      {expanded && (
        <div
          class={bemClass(b.node._, b.node.content, {
            selected: selected,
          })}
          data-lf={lf.fadeIn}
          part={p.content}
        >
          {prepCell(adapter, node)}
        </div>
      )}
    </div>
  );
};

const prepIcon = (adapter: LfAccordionAdapter, icon: LfIconType): VNode => {
  const { controller } = adapter;
  const { blocks, framework, parts } = controller.get;

  const mgr = framework();
  const b = blocks();
  const p = parts();

  const { bemClass } = mgr.theme;

  return (
    <div class={bemClass(b.node._, b.node.icon)} part={p.icon}>
      <FIcon framework={mgr} icon={icon} />
    </div>
  );
};

const prepCell = (adapter: LfAccordionAdapter, node: LfDataNode): VNode => {
  const { controller, dispatcher } = adapter;
  const { framework } = controller.get;

  const mgr = framework();

  const { cells } = node;
  const key = cells && Object.keys(cells)[0];
  const cell = cells?.[key];

  return (
    <LfShape
      cell={cell}
      index={0}
      shape={cell.shape}
      eventDispatcher={async (e) =>
        dispatcher.emit("lf-event", { originalEvent: e })
      }
      framework={mgr}
    ></LfShape>
  );
};
//#endregion
