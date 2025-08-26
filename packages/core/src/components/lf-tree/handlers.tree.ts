import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeAdapterHandlers,
} from "@lf-widgets/foundations";

export const createHandlers = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => ({
  nodeClick: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    adapter.controller.set.selection.set(node);
    const ci = adapter.controller.get.compInstance as any;
    ci.onLfEvent?.(e, "click", { node });
  },
  nodeExpand: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    adapter.controller.set.expansion.toggle(node);
    const ci = adapter.controller.get.compInstance as any;
    ci.onLfEvent?.(e, "expand", { node, expansion: true });
    ci.onLfEvent?.(e, "click", { node, expansion: true });
  },
  nodePointerDown: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    const ci = adapter.controller.get.compInstance as any;
    ci.onLfEvent?.(e, "pointerdown", { node });
  },
  filterInput: (e: CustomEvent<any>) => {
    const adapter = getAdapter();
    const value = e.detail.inputValue?.toLowerCase() || "";
    let runtime = (adapter as any)._runtime as { filterTimeout?: any };
    if (!runtime) {
      runtime = {};
      (adapter as any)._runtime = runtime;
    }
    clearTimeout(runtime.filterTimeout);
    runtime.filterTimeout = setTimeout(() => {
      adapter.controller.set.filter.setValue(value);
      adapter.controller.set.filter.apply(value);
    }, 300);
  },
});
