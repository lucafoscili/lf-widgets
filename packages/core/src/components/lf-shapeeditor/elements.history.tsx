import { LfDataDataset, LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares the history sub-block JSX (list of snapshots).
 * Part of the preview panel, toggled via the badge button.
 */
export const prepHistory = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const adapter = getAdapter();
    const { controller, elements, handlers } = adapter;
    const { blocks, history, ids, framework, parts } = controller.get;
    const { preview } = elements.refs;
    const { historyList } = handlers.preview;

    const b = blocks();
    const i = ids();
    const p = parts();
    const mgr = framework();

    const { assignRef, theme } = mgr;
    const { bemClass } = theme;

    const historyBlock = b.preview.history;
    const historyParts = p.preview;

    const currentHistory = history.current() || [];
    const currentIndex = history.index();

    // Build dataset for the list
    const historyDataset: LfDataDataset = {
      nodes: currentHistory.map((_, index) => ({
        id: String(index),
        value: `Snapshot ${index + 1}`,
        icon: index === currentIndex ? "--lf-icon-success" : "--lf-icon-edit",
      })),
    };

    return (
      <div class={bemClass(historyBlock._)} part={historyParts.history}>
        <lf-list
          class={bemClass(historyBlock._, historyBlock.list)}
          id={i.preview.history.list}
          lfDataset={historyDataset}
          lfEnableDeletions={true}
          lfUiSize="small"
          onLf-list-event={historyList}
          ref={assignRef(preview.history, "list")}
        ></lf-list>
      </div>
    );
  };
};
