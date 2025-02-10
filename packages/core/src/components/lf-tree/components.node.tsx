import {
  CY_ATTRIBUTES,
  LF_TREE_BLOCKS,
  LF_TREE_PARTS,
  LfTreeNodeProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { TreeNodeContent } from "./components.node-content";

//#region Tree node
export const TreeNode: FunctionalComponent<LfTreeNodeProps> = (
  props: LfTreeNodeProps,
) => {
  const { manager } = props;
  const { bemClass } = manager.theme;

  const { accordionLayout, depth, elements, events, expanded, node, selected } =
    props || {};

  const icon = node.icon ? (
    <TreeNodeContent
      manager={manager}
      node={node}
      type="icon"
    ></TreeNodeContent>
  ) : (
    <TreeNodeContent manager={manager} type="placeholder"></TreeNodeContent>
  );

  if (accordionLayout) {
    return (
      <div
        class={bemClass(LF_TREE_BLOCKS.node._, null, {
          expanded,
          selected,
        })}
        data-cy={CY_ATTRIBUTES.node}
        data-depth={depth.toString()}
        key={node.id}
        onClick={events.onClickExpand}
        onPointerDown={events.onPointerDown}
        part={LF_TREE_PARTS.node}
        title={node.description}
      >
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.content)}
        >
          {elements.ripple}
          {icon}
          {elements.value}
          {node.children?.length ? (
            <TreeNodeContent
              expanded={expanded}
              manager={manager}
              node={node}
              type="dropdown"
            ></TreeNodeContent>
          ) : (
            <TreeNodeContent
              manager={manager}
              type="placeholder"
            ></TreeNodeContent>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div
        class={bemClass(LF_TREE_BLOCKS.node._, null, {
          expanded,
          selected,
        })}
        data-cy={CY_ATTRIBUTES.node}
        data-depth={depth.toString()}
        key={node.id}
        onClick={events.onClick}
        onPointerDown={events.onPointerDown}
        title={node.description}
      >
        <div class="node__content">
          {elements.ripple}
          <TreeNodeContent
            depth={depth}
            manager={manager}
            type="padding"
          ></TreeNodeContent>
          {node.children?.length ? (
            <TreeNodeContent
              expanded={expanded}
              manager={manager}
              node={node}
              onClickExpand={events.onClickExpand}
              type="expand"
            ></TreeNodeContent>
          ) : (
            <TreeNodeContent
              manager={manager}
              type="placeholder"
            ></TreeNodeContent>
          )}
          {icon}
          {elements.value}
        </div>
      </div>
    );
  }
};
//#endregion
