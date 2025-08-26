import { h } from "@stencil/core";
import { LfTreeAdapter } from "./lf-tree-adapter";
import { LfShape } from "../../utils/shapes";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LfDataNode,
  LfTreeNodeProps,
} from "@lf-widgets/foundations";
import { TreeNode } from "./components.node";

export const traverseNodes = (adapter: LfTreeAdapter) => {
  const { compInstance, manager } = adapter.controller.get as any;
  const out: any[] = [];
  const stringify = manager.data.cell.stringify;
  const nodes: LfDataNode[] = compInstance.lfDataset?.nodes || [];
  const initialDepth = compInstance.lfInitialExpansionDepth;
  const filterValue = (compInstance as any)._filterValue;
  const blocks = adapter.controller.get.blocks;
  const { noMatches } = blocks;
  const { bemClass } = manager.theme;

  const ensureInitial = (node: LfDataNode, depth: number) => {
    if (!compInstance.debugInfo?.endTime) {
      if (
        initialDepth === null ||
        initialDepth === undefined ||
        initialDepth > depth
      ) {
        (compInstance as any).expandedNodes.add(node);
      }
    }
  };

  const renderCellShape = (
    node: LfDataNode,
    colId: string,
    isFirst: boolean,
  ) => {
    const { cell: cellOps } = manager.data;
    const cell = node.cells?.[colId];
    if (!cell) {
      return (
        <div
          class={"node__grid-cell" + (isFirst ? " node__grid-cell--value" : "")}
          data-column={colId}
        >
          {isFirst ? stringify(node.value) : ""}
        </div>
      );
    }
    const shape = cell.shape || "text";
    const simple = shape === "text" || shape === "number" || shape === "slot";
    const shapeProps = cellOps.shapes.get(cell);
    if (!Object.prototype.hasOwnProperty.call(shapeProps, "lfValue")) {
      (shapeProps as any).lfValue = cell.value;
    }
    return (
      <div class="node__grid-cell" data-column={colId}>
        {simple ? (
          stringify(cell.value as any)
        ) : (
          <LfShape
            framework={manager}
            shape={shape as any}
            index={0}
            cell={shapeProps as any}
            eventDispatcher={async (e: any) => {
              (compInstance as any).onLfEvent(e, "lf-event", { node });
            }}
          ></LfShape>
        )}
      </div>
    );
  };

  const gridCells = (node: LfDataNode) => {
    if (!(compInstance.lfGrid && compInstance.lfDataset?.columns?.length))
      return null;
    const parts = adapter.controller.get.parts;
    return (
      <div class="node__grid" part={parts.node + "-grid"}>
        {compInstance.lfDataset.columns.map((c: any, i: number) =>
          renderCellShape(node, c.id as string, i === 0),
        )}
      </div>
    );
  };

  const walk = (node: LfDataNode, depth: number) => {
    ensureInitial(node, depth);
    const ci = compInstance as any;
    const isExpanded = filterValue ? true : ci.expandedNodes.has(node);
    const isHidden = ci.hiddenNodes.has(node);
    const isSelected = ci.selectedNode === node;
    const gridValue = gridCells(node);
    if (!isHidden) {
      const nodeProps: LfTreeNodeProps = {
        accordionLayout: compInstance.lfAccordionLayout && depth === 0,
        depth,
        elements: {
          ripple: (
            <div
              data-cy={CY_ATTRIBUTES.rippleSurface}
              data-lf={LF_ATTRIBUTES.rippleSurface}
              ref={(el) => {
                if (el && compInstance.lfRipple) {
                  adapter.elements.refs.rippleSurfaces[node.id] =
                    el as HTMLElement;
                }
              }}
            ></div>
          ),
          value:
            compInstance.lfGrid && gridValue ? (
              <div class="node__value node__value--grid">{gridValue}</div>
            ) : (
              <div class="node__value">{stringify(node.value)}</div>
            ),
        },
        events: {
          onClick: (e) => adapter.handlers.nodeClick(e, node),
          onClickExpand: (e) => adapter.handlers.nodeExpand(e, node),
          onPointerDown: (e) => adapter.handlers.nodePointerDown(e, node),
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
    }
  };

  nodes.forEach((n) => walk(n, 0));
  if (out.length) return out;
  if (filterValue) {
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
