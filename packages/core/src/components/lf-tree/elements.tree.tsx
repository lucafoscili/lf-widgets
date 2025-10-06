import type {
  LfDataCell,
  LfDataColumn,
  LfDataNode,
  LfDataShapes,
} from "@lf-widgets/foundations";
import {
  LfTextfieldEventPayload,
  LfTreeAdapter,
  LfTreeAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { TreeNode } from "./components.node";

export const createJsx = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterJsx => ({
  //#region filter
  filter: () => {
    const { controller, handlers } = getAdapter();
    const { compInstance, manager } = controller.get;
    const { theme } = manager;
    const { bemClass, get } = theme;
    const blocks = controller.get.blocks;
    const tree = blocks.tree;

    if (!compInstance.lfFilter) {
      return null;
    }

    return (
      <lf-textfield
        class={bemClass(tree._, tree.filter)}
        lfStretchX={true}
        lfIcon={get.current().variables["--lf-icon-search"]}
        lfLabel={"Search..."}
        lfStyling="flat"
        onLf-textfield-event={(e: CustomEvent<LfTextfieldEventPayload>) =>
          handlers.filter.input(e)
        }
        ref={(el) => (getAdapter().elements.refs.filterField = el)}
      ></lf-textfield>
    );
  },
  //#endregion

  //#region header
  header: () => {
    const { controller } = getAdapter();
    const columns = controller.get.columns();
    const { blocks, isGrid, manager, parts } = controller.get;
    const renderGrid = isGrid() && columns.length > 0;

    if (!renderGrid) {
      return null;
    }

    const { bemClass } = manager.theme;
    const header = blocks.header;

    return (
      <div class={bemClass(header._)} part={parts.header}>
        <div class={bemClass(header._, header.row)}>
          {columns.map((c, i) => (
            <div
              class={bemClass(header._, header.cell)}
              part={i === 0 ? parts.headerRow : undefined}
              data-column={c.id as string}
              data-index={i.toString()}
              key={c.id as string}
            >
              {c.title}
            </div>
          ))}
        </div>
      </div>
    );
  },
  //#endregion

  //#region nodes
  nodes: () => {
    const adapter = getAdapter();
    const { controller, elements, handlers } = adapter;
    const { get } = controller;
    const { blocks, manager, parts } = get;
    const { bemClass } = manager.theme;
    const { tree } = blocks;
    const stringify = manager.data.cell.stringify;

    const filterValue = get.filterValue() || "";
    const columns = get.columns();
    const isGrid = get.isGrid();
    const dataset = get.dataset();
    const visible = get.manager.data.node.traverseVisible(dataset?.nodes, {
      isExpanded: get.isExpanded,
      isHidden: get.isHidden,
      isSelected: get.isSelected,
      forceExpand: !!filterValue,
    }) as ReturnType<typeof get.manager.data.node.traverseVisible>;
    const hasNodes = visible.length > 0;

    const renderCellShape = (
      node: LfDataNode,
      col: LfDataColumn,
      isFirst: boolean,
    ) => {
      const nodeBlock = blocks.node;
      const cell = node.cells?.[col.id as string] as LfDataCell | undefined;
      if (!cell) {
        const base = bemClass(nodeBlock._, nodeBlock.gridCell);
        const cls = isFirst ? base + " value" : base;
        return (
          <div class={cls} data-column={col.id as string}>
            {isFirst
              ? stringify(node.value as LfDataCell<LfDataShapes>["value"])
              : ""}
          </div>
        );
      }
      const shape = cell.shape || "text";
      const simple = shape === "text" || shape === "number" || shape === "slot";
      const shapeProps: LfDataCell<LfDataShapes> & { lfValue?: unknown } =
        manager.data.cell.shapes.get(
          cell as LfDataCell<LfDataShapes>,
        ) as LfDataCell<LfDataShapes> & { lfValue?: unknown };

      if (!Object.prototype.hasOwnProperty.call(shapeProps, "lfValue")) {
        shapeProps.lfValue = cell.value;
      }

      const displayValue = (shapeProps.lfValue ??
        cell.value) as LfDataCell<LfDataShapes>["value"];

      return (
        <div
          class={bemClass(nodeBlock._, nodeBlock.gridCell)}
          data-column={col.id as string}
        >
          {simple ? (
            stringify(displayValue)
          ) : (
            <LfShape
              framework={manager}
              shape={shape}
              index={0}
              cell={shapeProps}
              eventDispatcher={async (e: Event) =>
                get.compInstance.onLfEvent(e, "lf-event", { node })
              }
            ></LfShape>
          )}
        </div>
      );
    };

    const renderGridCells = (node: LfDataNode) => {
      if (!isGrid || !columns.length) {
        return null;
      }

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

    const nodeVNodes = visible.map(({ node, depth, expanded, selected }) => {
      const nodeBlock = blocks.node;
      const gridValue = renderGridCells(node);
      const valueVNode =
        get.compInstance.lfGrid && gridValue ? (
          <div class={bemClass(nodeBlock._, nodeBlock.value, { grid: true })}>
            {gridValue}
          </div>
        ) : (
          <div class={bemClass(nodeBlock._, nodeBlock.value)}>
            {stringify(node.value as LfDataCell<LfDataShapes>["value"])}
          </div>
        );

      return (
        <TreeNode
          accordionLayout={get.compInstance.lfAccordionLayout && depth === 0}
          depth={depth}
          elements={{
            ripple: (
              <div
                data-cy={get.cyAttributes.rippleSurface}
                data-lf={get.lfAttributes.rippleSurface}
                ref={(el) => {
                  if (el && get.compInstance.lfRipple) {
                    elements.refs.rippleSurfaces[node.id] = el as HTMLElement;
                  }
                }}
              ></div>
            ),
            value: valueVNode,
          }}
          events={{
            onClick: (e) => handlers.node.click(e, node),
            onClickExpand: (e) => handlers.node.expand(e, node),
            onPointerDown: (e) => handlers.node.pointerDown(e, node),
          }}
          expanded={expanded}
          manager={manager}
          node={node}
          selected={selected}
        ></TreeNode>
      );
    });

    if (hasNodes) {
      return (
        <div class={bemClass(tree._, tree.nodesWrapper)}>{nodeVNodes}</div>
      );
    }

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

    return <div class={bemClass(tree._, tree.nodesWrapper)}></div>;
  },
  //#endregion

  //#region empty
  empty: () => {
    const { controller } = getAdapter();
    const { compInstance, manager } = controller.get;
    const { theme } = manager;
    const { bemClass } = theme;
    const blocks = controller.get.blocks;
    const { emptyData } = blocks;
    const parts = controller.get.parts;

    return (
      <div class={bemClass(emptyData._)} part={parts.emptyData}>
        <div class={bemClass(emptyData._, emptyData.text)}>
          {compInstance.lfEmpty}
        </div>
      </div>
    );
  },
  //#endregion
});
