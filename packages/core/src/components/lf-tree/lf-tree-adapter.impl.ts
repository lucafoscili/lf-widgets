// Internal implementation moved here to avoid .tsx shadowing issues during Rollup resolution.
import {
  LfFrameworkInterface,
  LfDataNode,
  LfDataDataset,
  LF_TREE_BLOCKS,
  LF_TREE_PARTS,
  LfTreeAdapter,
  LfTreeAdapterControllerGetters,
  LfTreeAdapterControllerSetters,
  LfTreeAdapterHandlers,
  LfTreeAdapterRefs,
} from "@lf-widgets/foundations";
import { createJsx } from "./lf-tree-elements";
export type { LfTreeAdapter } from "@lf-widgets/foundations";

interface CreateAdapterGetters {
  compInstance: any;
  manager: LfFrameworkInterface;
  blocks: any;
  parts: any;
}

export const createAdapter = (
  getters: CreateAdapterGetters,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapter => ({
  controller: {
    get: createGetters(getters),
    set: buildSetters(getters, getAdapter),
  },
  elements: { jsx: createJsx(getAdapter), refs: createRefs() },
  handlers: createHandlers(getters, getAdapter),
});

export const createGetters = (
  getters: CreateAdapterGetters,
): LfTreeAdapterControllerGetters => ({
  blocks: getters.blocks as typeof LF_TREE_BLOCKS,
  compInstance: getters.compInstance,
  manager: getters.manager,
  cyAttributes: undefined as any,
  dataset: () => getters.compInstance.lfDataset as LfDataDataset,
  columns: () => getters.compInstance.lfDataset?.columns || [],
  isGrid: () =>
    !!(
      getters.compInstance.lfGrid &&
      getters.compInstance.lfDataset?.columns?.length
    ),
  lfAttributes: undefined as any,
  parts: getters.parts as typeof LF_TREE_PARTS,
  isExpanded: (node: LfDataNode) =>
    getters.compInstance.expandedNodes.has(node),
  isHidden: (node: LfDataNode) => getters.compInstance.hiddenNodes.has(node),
  isSelected: (node: LfDataNode) => getters.compInstance.selectedNode === node,
});

export const createRefs = (): LfTreeAdapterRefs => ({
  rippleSurfaces: {},
  filterField: null,
});

export const buildSetters = (
  _getters: any,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterControllerSetters => ({
  expansion: {
    toggle: (node: LfDataNode) => {
      const { compInstance } = getAdapter().controller.get;
      const ci = compInstance as any;
      if (ci.expandedNodes.has(node)) ci.expandedNodes.delete(node);
      else ci.expandedNodes.add(node);
      ci.expandedNodes = new Set(ci.expandedNodes);
    },
  },
  selection: {
    set: (node: LfDataNode) => {
      const { compInstance } = getAdapter().controller.get;
      (compInstance as any).selectedNode = node;
    },
  },
  filter: {
    setValue: (value: string) => {
      const { compInstance } = getAdapter().controller.get;
      (compInstance as any)._filterValue = value;
    },
    apply: (value: string) => {
      const { compInstance, manager } = getAdapter().controller.get as any;
      const { filter } = manager.data.node;
      if (!value) {
        (compInstance as any).hiddenNodes = new Set();
        return;
      }
      const { ancestorNodes, remainingNodes } = filter(
        (compInstance as any).lfDataset,
        { value },
        true,
      );
      const hidden = new Set(remainingNodes);
      if (ancestorNodes)
        ancestorNodes.forEach((a: LfDataNode) => hidden.delete(a));
      (compInstance as any).hiddenNodes = hidden;
    },
  },
});

export const createHandlers = (
  _getters: any,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => ({
  nodeClick: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    adapter.controller.set.selection.set(node);
    (adapter.controller.get.compInstance as any).onLfEvent(e, "click", {
      node,
    });
  },
  nodeExpand: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    adapter.controller.set.expansion.toggle(node);
    (adapter.controller.get.compInstance as any).onLfEvent(e, "click", {
      expansion: true,
      node,
    });
  },
  nodePointerDown: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    (adapter.controller.get.compInstance as any).onLfEvent(e, "pointerdown", {
      node,
    });
  },
  filterInput: (e: CustomEvent<any>) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const value = e.detail.inputValue?.toLowerCase() || "";
    const ci = compInstance as any;
    clearTimeout(ci._filterTimeout);
    ci._filterTimeout = setTimeout(() => {
      adapter.controller.set.filter.setValue(value);
      adapter.controller.set.filter.apply(value);
    }, 300);
  },
});
