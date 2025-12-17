import {
  LF_THEME_ICONS,
  LF_TREE_BLOCKS,
  LF_TREE_CSS_VARIABLES,
  LF_TREE_PARTS,
  LfDataCell,
  LfDataColumn,
  LfDataNode,
  LfDataShapes,
  LfFrameworkInterface,
  LfIconType,
  LfTreeFCProps,
  VNode,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";
import { FIcon } from "../../utils/icon";
import { LfShape } from "../../utils/shapes";

// Re-export LfTreeFCProps for external consumers
export type { LfTreeFCProps };

//#region Node Content Component
interface TreeNodeContentFCProps {
  depth?: number;
  expanded?: boolean;
  framework: LfFrameworkInterface;
  node?: LfDataNode;
  type: "dropdown" | "expand" | "icon" | "padding" | "placeholder";
  onClickExpand?: (e: MouseEvent) => void;
}

const TreeNodeContentFC: FunctionalComponent<TreeNodeContentFCProps> = ({
  depth,
  expanded = false,
  framework,
  node,
  onClickExpand,
  type,
}) => {
  const { bemClass } = framework.theme;
  const nodeBlock = LF_TREE_BLOCKS.node;

  switch (type) {
    case "dropdown":
      return (
        <div
          class={bemClass(nodeBlock._, nodeBlock.dropdown, {
            expanded,
          })}
        >
          <FIcon framework={framework} icon={LF_THEME_ICONS.dropdown} />
        </div>
      );
    case "expand":
      return (
        <div
          class={bemClass(nodeBlock._, nodeBlock.expand, {
            expanded,
          })}
          onClick={onClickExpand}
        >
          <FIcon
            framework={framework}
            icon={expanded ? LF_THEME_ICONS.expanded : LF_THEME_ICONS.collapsed}
          />
        </div>
      );
    case "icon":
      return (
        <div class={bemClass(nodeBlock._, nodeBlock.icon)}>
          <FIcon framework={framework} icon={node.icon} />
        </div>
      );
    case "padding":
      return (
        <div
          class={bemClass(nodeBlock._, nodeBlock.padding)}
          style={{
            [LF_TREE_CSS_VARIABLES.multiplier]: depth.toString(),
          }}
        ></div>
      );
    default:
      return (
        <div
          class={bemClass(nodeBlock._, nodeBlock.expand, {
            hidden: true,
          })}
        ></div>
      );
  }
};
//#endregion

//#region Tree Node Component
interface TreeNodeFCProps {
  accordionLayout: boolean;
  depth: number;
  elements: { value: VNode };
  events: {
    onClick: (event: MouseEvent) => void;
    onClickExpand: (event: MouseEvent) => void;
    onPointerDown: (event: MouseEvent) => void;
  };
  expanded: boolean;
  framework: LfFrameworkInterface;
  node: LfDataNode;
  nodeRef: (el: HTMLElement | null) => void;
  selectable: boolean;
  selected: boolean;
}

const TreeNodeFC: FunctionalComponent<TreeNodeFCProps> = ({
  accordionLayout,
  depth,
  elements,
  events,
  expanded,
  framework,
  node,
  nodeRef,
  selectable,
  selected,
}) => {
  const { bemClass } = framework.theme;
  const nodeBlock = LF_TREE_BLOCKS.node;

  const icon = node.icon ? (
    <TreeNodeContentFC framework={framework} node={node} type="icon" />
  ) : (
    <TreeNodeContentFC framework={framework} type="placeholder" />
  );

  // Accordion layout - uses data-depth="0" + :host([lf-accordion-layout]) CSS
  if (accordionLayout) {
    return (
      <div
        class={bemClass(nodeBlock._, null, {
          expanded,
          selectable,
          selected,
        })}
        data-depth={depth.toString()}
        key={node.id}
        onClick={events.onClickExpand}
        onPointerDown={events.onPointerDown}
        part={LF_TREE_PARTS.node}
        ref={nodeRef}
        title={node.description}
      >
        <div class={bemClass(nodeBlock._, nodeBlock.content)}>
          {icon}
          {elements.value}
          {node.children?.length ? (
            <TreeNodeContentFC
              expanded={expanded}
              framework={framework}
              node={node}
              type="dropdown"
            />
          ) : (
            <TreeNodeContentFC framework={framework} type="placeholder" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      class={bemClass(nodeBlock._, null, {
        expanded,
        selectable,
        selected,
      })}
      data-depth={depth.toString()}
      key={node.id}
      onClick={events.onClick}
      onPointerDown={events.onPointerDown}
      ref={nodeRef}
      title={node.description}
    >
      <div class={bemClass(nodeBlock._, nodeBlock.content)}>
        <TreeNodeContentFC depth={depth} framework={framework} type="padding" />
        {node.children?.length ? (
          <TreeNodeContentFC
            expanded={expanded}
            framework={framework}
            node={node}
            onClickExpand={events.onClickExpand}
            type="expand"
          />
        ) : (
          <TreeNodeContentFC framework={framework} type="placeholder" />
        )}
        {icon}
        {elements.value}
      </div>
    </div>
  );
};
//#endregion

//#region Main Component
/**
 * LfTreeFC - Functional Component for Tree
 *
 * This is a stateless functional component that renders a hierarchical tree.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-tree Web Component (thin wrapper)
 * 2. Inside other components like shapeeditor (composed usage)
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
export const LfTreeFC: FunctionalComponent<LfTreeFCProps> = ({
  accordionLayout = true,
  blocks,
  className,
  columns,
  computed,
  dataset,
  elements,
  emptyText = "Empty data.",
  filterValue = "",
  framework,
  grid = false,
  handlers,
  id,
  isEmpty = true,
  parts,
  refs,
  selectable = true,
  showFilter = true,
  style,
  uiSize = "medium",
}) => {
  const { bemClass } = framework.theme;
  const { tree, emptyData, noMatches, header, node: nodeBlock } = blocks;
  const stringify = framework.data.cell.stringify;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  //#region Filter JSX
  const renderFilter = () => {
    if (!showFilter) {
      return null;
    }

    // Use adapter's JSX factory if available
    if (elements?.jsx?.filter) {
      return elements.jsx.filter();
    }

    const iconSearch = framework.theme.get.current().variables[
      "--lf-icon-search"
    ] as LfIconType;

    return (
      <LfTextfieldFC
        className={bemClass(tree._, tree.filter)}
        framework={framework}
        icon={iconSearch}
        inputRef={(el) => refs?.filter?.(el)}
        label="Search..."
        onInput={(value, e) => handlers?.filter?.input(e, value)}
        styling="flat"
        style={{ width: "100%" }}
        value=""
      />
    );
  };
  //#endregion

  //#region Header JSX (Grid Mode)
  const renderHeader = () => {
    const renderGrid = grid && columns.length > 0;

    if (!renderGrid) {
      return null;
    }

    // Use adapter's JSX factory if available
    if (elements?.jsx?.header) {
      return elements.jsx.header();
    }

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
  };
  //#endregion

  //#region Grid Cell Rendering
  const renderCellShape = (
    node: LfDataNode,
    col: LfDataColumn,
    isFirst: boolean,
  ) => {
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
      framework.data.cell.shapes.get(
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
            framework={framework}
            shape={shape}
            index={0}
            cell={shapeProps}
            eventDispatcher={async () => {}}
          ></LfShape>
        )}
      </div>
    );
  };

  const renderGridCells = (node: LfDataNode) => {
    if (!grid || !columns.length) {
      return null;
    }

    return (
      <div
        class={bemClass(nodeBlock._, nodeBlock.grid)}
        part={parts.node + "-grid"}
      >
        {columns.map((c, i) => renderCellShape(node, c, i === 0))}
      </div>
    );
  };
  //#endregion

  //#region Nodes JSX
  const renderNodes = () => {
    // Use adapter's JSX factory if available
    if (elements?.jsx?.nodes) {
      return elements.jsx.nodes();
    }

    const visible = framework.data.node.traverseVisible(dataset?.nodes, {
      isExpanded: computed.isExpanded,
      isHidden: computed.isHidden,
      isSelected: computed.isSelected,
      forceExpand: !!filterValue,
    }) as ReturnType<typeof framework.data.node.traverseVisible>;

    const hasNodes = visible.length > 0;

    const nodeVNodes = visible.map(({ node, depth, expanded, selected }) => {
      const gridValue = renderGridCells(node);
      const valueVNode =
        grid && gridValue ? (
          <div class={bemClass(nodeBlock._, nodeBlock.value, { grid: true })}>
            {gridValue}
          </div>
        ) : (
          <div class={bemClass(nodeBlock._, nodeBlock.value)}>
            {stringify(node.value as LfDataCell<LfDataShapes>["value"])}
          </div>
        );

      return (
        <TreeNodeFC
          accordionLayout={accordionLayout && depth === 0}
          depth={depth}
          elements={{
            value: valueVNode,
          }}
          events={{
            onClick: (e) => handlers?.node?.click(e, node),
            onClickExpand: (e) => handlers?.node?.expand(e, node),
            onPointerDown: (e) => handlers?.node?.pointerDown(e, node),
          }}
          expanded={expanded}
          framework={framework}
          node={node}
          nodeRef={(el) => {
            if (el && refs?.nodeElements) {
              refs.nodeElements[node.id] = el;
            }
            if (el && elements?.refs?.nodeElements) {
              elements.refs.nodeElements[node.id] = el;
            }
          }}
          selectable={selectable}
          selected={selected}
        />
      );
    });

    if (hasNodes) {
      return (
        <div class={bemClass(tree._, tree.nodesWrapper)}>{nodeVNodes}</div>
      );
    }

    if (filterValue) {
      return (
        <div class={bemClass(noMatches._)}>
          <div class={bemClass(noMatches._, noMatches.icon)}>
            <FIcon framework={framework} icon={LF_THEME_ICONS.warning} />
          </div>
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
  };
  //#endregion

  //#region Empty JSX
  const renderEmpty = () => {
    // Use adapter's JSX factory if available
    if (elements?.jsx?.empty) {
      return elements.jsx.empty();
    }

    return (
      <div class={bemClass(emptyData._)} part={parts.emptyData}>
        <div class={bemClass(emptyData._, emptyData.text)}>{emptyText}</div>
      </div>
    );
  };
  //#endregion

  return (
    <div
      class={`${bemClass(tree._)}${grid ? " tree--grid" : ""}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.tree}
      ref={(el) => refs?.tree?.(el)}
      style={computedStyle}
    >
      {renderFilter()}
      {renderHeader()}
      {isEmpty ? renderEmpty() : renderNodes()}
    </div>
  );
};
//#endregion
