import {
  LfDataColumn,
  LfDataNode,
  LfTreeAdapter,
  LfTreeNodeProps,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { TreeNode } from "./components.node";

export const traverseNodes = (adapter: LfTreeAdapter) => {
  const { controller, elements, handlers } = adapter;
  const { get } = controller;
  const comp = get.compInstance;
  const manager = get.manager;
  const blocks = get.blocks;
  const parts = get.parts;
  const dataset = get.dataset();
  const columns = get.columns();
  const isGrid = get.isGrid();
  const filterValue = get.filterValue?.() || "";

  const out: any[] = [];
  const stringify = manager.data.cell.stringify;
  const nodes: LfDataNode[] = dataset?.nodes || [];
  const { bemClass } = manager.theme;

  const renderCellShape = (
    node: LfDataNode,
    col: LfDataColumn,
    isFirst: boolean,
  ) => {
    const nodeBlock = blocks.node;
    const cell = node.cells?.[col.id as string];
    if (!cell) {
      const base = bemClass(nodeBlock._, nodeBlock.gridCell);
      const cls = isFirst ? base + " value" : base;
      return (
        <div class={cls} data-column={col.id as string}>
          {isFirst ? stringify(node.value as any) : ""}
        </div>
      );
    }
    const shape = cell.shape || "text";
    const simple = shape === "text" || shape === "number" || shape === "slot";
    const shapeProps = manager.data.cell.shapes.get(cell as any);
    if (!Object.prototype.hasOwnProperty.call(shapeProps, "lfValue")) {
      (shapeProps as any).lfValue = (cell as any).value;
    }
    return (
      <div
        class={bemClass(nodeBlock._, nodeBlock.gridCell)}
        data-column={col.id as string}
      >
        {simple ? (
          stringify((cell as any).value)
        ) : (
          <LfShape
            framework={manager}
            shape={shape as any}
            index={0}
            cell={shapeProps as any}
            eventDispatcher={async (e: any) =>
              comp.onLfEvent(e, "lf-event", { node })
            }
          ></LfShape>
        )}
      </div>
    );
  };

  const renderGridCells = (node: LfDataNode) => {
    if (!isGrid || !columns.length) return null;
    const nodeBlock = blocks.node;
    return (
      <div
        class={bemClass(nodeBlock._, nodeBlock.grid)}
        part={parts.node + "-grid"}
      >
        {columns.map((c, i) => renderCellShape(node, c, i === 0))}
      </div>
    );
  };

  const walk = (node: LfDataNode, depth: number) => {
    const isExpanded = filterValue ? true : get.isExpanded(node);
    const isHidden = get.isHidden(node);
    const isSelected = get.isSelected(node);
    const gridValue = renderGridCells(node);
    if (isHidden) return;

    const nodeBlock = blocks.node;
    const valueEl =
      comp.lfGrid && gridValue ? (
        <div class={bemClass(nodeBlock._, nodeBlock.value, { grid: true })}>
          {gridValue}
        </div>
      ) : (
        <div class={bemClass(nodeBlock._, nodeBlock.value)}>
          {stringify(node.value as any)}
        </div>
      );

    const nodeProps: LfTreeNodeProps = {
      accordionLayout: comp.lfAccordionLayout && depth === 0,
      depth,
      elements: {
        ripple: (
          <div
            data-cy={get.cyAttributes.rippleSurface}
            data-lf={get.lfAttributes.rippleSurface}
            ref={(el) => {
              if (el && comp.lfRipple) {
                elements.refs.rippleSurfaces[node.id] = el as HTMLElement;
              }
            }}
          ></div>
        ),
        value: valueEl,
      },
      events: {
        onClick: (e) => handlers.node.click(e, node),
        onClickExpand: (e) => handlers.node.expand(e, node),
        onPointerDown: (e) => handlers.node.pointerDown(e, node),
      },
      expanded: isExpanded,
      manager: manager,
      node,
      selected: isSelected,
    };
    out.push(<TreeNode {...nodeProps}></TreeNode>);
    if (isExpanded) {
      node.children?.forEach((child) => walk(child as LfDataNode, depth + 1));
    }
  };

  nodes.forEach((n) => walk(n, 0));
  if (out.length) return out;
  if (filterValue) {
    const { noMatches } = blocks;
    return (
      <div class={bemClass(noMatches._)}>
        <div class={bemClass(noMatches._, noMatches.icon)}></div>
        <div class={bemClass(noMatches._, noMatches.text)}>
          No matches found for "
          <strong class={bemClass(noMatches._, noMatches.filter)}>
            {filterValue}
          </strong>
          ".
        </div>
      </div>
    );
  }
  return out;
};
