import {
  LfDataNode,
  LfTextfieldEventPayload,
  LfTreeAdapter,
  LfTreeAdapterHandlers,
} from "@lf-widgets/foundations";

export const createHandlers = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => ({
  node: {
    click: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const comp = controller.get.compInstance;

      controller.set.selection.set(node);
      const nowSelected = controller.get.isSelected(node);

      comp.onLfEvent?.(e, "click", { node, selected: nowSelected });
    },
    expand: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const comp = controller.get.compInstance;

      controller.set.expansion.toggle(node);

      comp.onLfEvent?.(e, "click", { node, expansion: true });
    },
    pointerDown: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const comp = controller.get.compInstance;

      comp.onLfEvent?.(e, "pointerdown", { node });
    },
  },
  filter: {
    input: (e: CustomEvent<LfTextfieldEventPayload>) => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const comp = controller.get.compInstance;
      const value = e.detail.inputValue?.toLowerCase() || "";

      clearTimeout(comp._filterTimeout);

      comp._filterTimeout = setTimeout(() => {
        controller.set.filter.setValue(value);
        controller.set.filter.apply(value);
      }, 300);
    },
  },
});
