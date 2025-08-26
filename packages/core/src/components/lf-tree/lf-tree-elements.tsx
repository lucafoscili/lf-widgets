import { h } from "@stencil/core";
import { LfTreeAdapter } from "./lf-tree-adapter"; // local adapter type; migrate to foundations after full alignment
import { LfTextfieldEventPayload } from "@lf-widgets/foundations";
import { traverseNodes } from "./lf-tree-traverse";

export const createJsx = (getAdapter: () => LfTreeAdapter) => ({
  filter: () => {
    const { controller, handlers } = getAdapter();
    const { compInstance, manager } = controller.get as any;
    if (!compInstance.lfFilter) return null;
    const { theme } = manager;
    const { bemClass, get } = theme;
    const blocks = controller.get.blocks;
    const tree = blocks.tree;
    return (
      <lf-textfield
        class={bemClass(tree._, tree.filter)}
        lfStretchX={true}
        lfIcon={get.current().variables["--lf-icon-search"]}
        lfLabel={"Search..."}
        lfStyling="flat"
        onLf-textfield-event={(e: CustomEvent<LfTextfieldEventPayload>) =>
          handlers.filterInput(e as any)
        }
        ref={(el) => (getAdapter().elements.refs.filterField = el)}
      ></lf-textfield>
    );
  },
  header: () => {
    const { controller } = getAdapter();
    if (!controller.get.isGrid()) return null;
    const ds = controller.get.dataset();
    if (!ds?.columns?.length) return null;
    const parts = controller.get.parts;
    return (
      <div class="tree__header" part={parts.node + "-header"}>
        <div class="tree__header-row">
          {ds.columns.map((c: any, i: number) => (
            <div
              class={"tree__header-cell"}
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
  nodes: () => {
    const adapter = getAdapter();
    const content = traverseNodes(adapter);
    // Ensure single VNode wrapper per adapter contract
    return (<div class="tree__nodes-wrapper">{content}</div>) as any;
  },
  empty: () => {
    const { controller } = getAdapter();
    const { compInstance, manager } = controller.get as any;
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
});
