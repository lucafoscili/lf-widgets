import {
  LF_THEME_ICONS,
  LF_TREE_BLOCKS,
  LF_TREE_CSS_VARIABLES,
  LfFrameworkInterface,
  LfDataNode,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../utils/icon";

//#region Tree node content
export const TreeNodeContent: FunctionalComponent<{
  depth?: number;
  expanded?: boolean;
  manager: LfFrameworkInterface;
  node?: LfDataNode;
  type: "dropdown" | "expand" | "icon" | "padding" | "placeholder";
  onClickExpand?: (e: MouseEvent) => void;
}> = ({ depth, expanded = false, manager, node, onClickExpand, type }) => {
  const { bemClass } = manager.theme;

  switch (type) {
    case "dropdown":
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.dropdown, {
            expanded,
          })}
        >
          <FIcon framework={manager} icon={LF_THEME_ICONS.dropdown} />
        </div>
      );
    case "expand":
      return (
        <div
          class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.expand, {
            expanded,
          })}
          onClick={onClickExpand}
        >
          <FIcon
            framework={manager}
            icon={expanded ? LF_THEME_ICONS.expanded : LF_THEME_ICONS.collapsed}
          />
        </div>
      );
    case "icon":
      return (
        <div class={bemClass(LF_TREE_BLOCKS.node._, LF_TREE_BLOCKS.node.icon)}>
          <FIcon framework={manager} icon={node.icon} />
        </div>
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
