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
  const { framework } = props;
  const { bemClass } = framework.theme;

  const {
    accordionLayout,
    depth,
    elements,
    events,
    expanded,
    node,
    nodeRef,
    selected,
  } = props || {};

  const icon = node.icon ? (
    <TreeNodeContent
      framework={framework}
      node={node}
      type="icon"
    ></TreeNodeContent>
  ) : (
    <TreeNodeContent framework={framework} type="placeholder"></TreeNodeContent>
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
        ref={nodeRef}
        title={node.description}
      >
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.content)}
        >
          {icon}
          {elements.value}
          {node.children?.length ? (
            <TreeNodeContent
              expanded={expanded}
              framework={framework}
              node={node}
              type="dropdown"
            ></TreeNodeContent>
          ) : (
            <TreeNodeContent
              framework={framework}
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
        ref={nodeRef}
        title={node.description}
      >
        <div class="node__content">
          <TreeNodeContent
            depth={depth}
            framework={framework}
            type="padding"
          ></TreeNodeContent>
          {node.children?.length ? (
            <TreeNodeContent
              expanded={expanded}
              framework={framework}
              node={node}
              onClickExpand={events.onClickExpand}
              type="expand"
            ></TreeNodeContent>
          ) : (
            <TreeNodeContent
              framework={framework}
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
