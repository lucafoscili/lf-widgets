import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeAdapterHandlers,
} from "@lf-widgets/foundations";

export const createHandlers = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => ({
  //#region filter
  filter: {
    /**
     * FC-compatible filter input handler.
     * Called directly by LfTextfieldFC's onInput callback.
     */
    input: (e: Event, value: string) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const comp = controller.get.compInstance();
      const filterValue = value?.toLowerCase() || "";

      clearTimeout(comp._filterTimeout);

      comp._filterTimeout = setTimeout(() => {
        controller.set.filter.setValue(filterValue);
        controller.set.filter.apply(filterValue);
      }, 300);

      dispatcher.emit("lf-event", {
        originalEvent: e as unknown as CustomEvent,
      });
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
