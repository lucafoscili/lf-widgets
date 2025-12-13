import {
  LfDataNode,
  LfTextfieldEventPayload,
  LfTreeAdapter,
  LfTreeAdapterHandlers,
} from "@lf-widgets/foundations";

export const createHandlers = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => ({
  //#region filter
  filter: {
    input: (e: CustomEvent<LfTextfieldEventPayload>) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const comp = controller.get.compInstance();
      const value = e.detail.inputValue?.toLowerCase() || "";

      clearTimeout(comp._filterTimeout);

      comp._filterTimeout = setTimeout(() => {
        controller.set.filter.setValue(value);
        controller.set.filter.apply(value);
      }, 300);

      dispatcher.emit("lf-event", { originalEvent: e });
    },
  },
  //#endregion

  //#region node
  node: {
    click: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;

      controller.set.state.selection.set(node);

      dispatcher.emit("click", {
        originalEvent: e,
        node,
      });
    },
    expand: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;

      controller.set.state.expansion.toggle(node);

      dispatcher.emit("click", { originalEvent: e, node });
    },
    pointerDown: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;

      dispatcher.emit("pointerdown", { originalEvent: e, node });
    },
  },
  //#endregion
});
