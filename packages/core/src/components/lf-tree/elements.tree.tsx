import {
  LfTextfieldEventPayload,
  LfTreeAdapter,
  LfTreeAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { traverseNodes } from "./helpers.traverse";

export const createJsx = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterJsx => ({
  filter: () => {
    const { controller, handlers } = getAdapter();
    const { compInstance, manager } = controller.get;
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
          handlers.filter.input(e)
        }
        ref={(el) => (getAdapter().elements.refs.filterField = el)}
      ></lf-textfield>
    );
  },
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
      <div class={bemClass(header._)} part={parts.node + "-header"}>
        <div class={bemClass(header._, header.row)}>
          {columns.map((c, i) => (
            <div
              class={bemClass(header._, header.cell)}
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
    const { controller } = adapter;
    const { manager } = controller.get;
    const { bemClass } = manager.theme;
    const blocks = controller.get.blocks;
    const tree = blocks.tree;

    return <div class={bemClass(tree._, tree.nodesWrapper)}>{content}</div>;
  },
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
});
