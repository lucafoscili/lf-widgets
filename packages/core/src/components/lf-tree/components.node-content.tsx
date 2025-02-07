import {
  CY_ATTRIBUTES,
  LF_TREE_BLOCKS,
  LF_TREE_CSS_VARIABLES,
  LfFrameworkInterface,
  LfDataNode,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Tree node content
export const TreeNodeContent: FunctionalComponent<{
  depth?: number;
  expanded?: boolean;
  manager: LfFrameworkInterface;
  node?: LfDataNode;
  type: "dropdown" | "expand" | "icon" | "padding" | "placeholder";
  onClickExpand?: (e: MouseEvent) => void;
}> = ({ depth, expanded = false, manager, node, onClickExpand, type }) => {
  const { get } = manager.assets;
  const { bemClass } = manager.theme;

  switch (type) {
    case "dropdown":
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.dropdown, {
            expanded,
          })}
          data-cy={CY_ATTRIBUTES.maskedSvg}
        ></div>
      );
    case "expand":
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.expand, {
            expanded,
          })}
          data-cy={CY_ATTRIBUTES.maskedSvg}
          onClick={onClickExpand}
        ></div>
      );
    case "icon":
      const { style } = get(`./assets/svg/${node.icon}.svg`);
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.icon)}
          data-cy={CY_ATTRIBUTES.maskedSvg}
          style={style}
        ></div>
      );
    case "padding":
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.padding)}
          style={{
            [LF_TREE_CSS_VARIABLES.multiplier]: depth.toString(),
          }}
        ></div>
      );
    default:
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.expand, {
            hidden: true,
          })}
        ></div>
      );
  }
};
//#endregion
