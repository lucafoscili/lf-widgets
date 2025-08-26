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
  LfTreeInterface,
} from "@lf-widgets/foundations";
import { createJsx } from "./lf-tree-elements";
export type { LfTreeAdapter } from "@lf-widgets/foundations";

interface CreateAdapterGetters {
  compInstance: LfTreeInterface;
  manager: LfFrameworkInterface;
  blocks: typeof LF_TREE_BLOCKS;
  parts: typeof LF_TREE_PARTS;
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
): LfTreeAdapterControllerGetters => {
  const ci = getters.compInstance as any; // limited to internal fields without widening public type
  return {
    blocks: getters.blocks,
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
    parts: getters.parts,
    isExpanded: (node: LfDataNode) => ci.expandedNodes.has(node),
    isHidden: (node: LfDataNode) => ci.hiddenNodes.has(node),
    isSelected: (node: LfDataNode) => ci.selectedNode === node,
    filterValue: ci._filterValue || "",
  };
};

export const createRefs = (): LfTreeAdapterRefs => ({
  rippleSurfaces: {},
  filterField: null,
  // local ephemeral state (not exposed in foundations types)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _filterTimeout: undefined,
});

export const buildSetters = (
  _getters: CreateAdapterGetters,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterControllerSetters => {
  const ci = _getters.compInstance as any;
  return {
    expansion: {
      toggle: (node: LfDataNode) => {
        if (ci.expandedNodes.has(node)) ci.expandedNodes.delete(node);
        else ci.expandedNodes.add(node);
        ci.expandedNodes = new Set(ci.expandedNodes);
      },
    },
    selection: {
      set: (node: LfDataNode) => {
        ci.selectedNode = node;
      },
    },
    filter: {
      setValue: (value: string) => {
        ci._filterValue = value;
      },
      apply: (value: string) => {
        const { manager } = getAdapter().controller.get;
        const { filter } = manager.data.node;
        if (!value) {
          ci.hiddenNodes = new Set();
          return;
        }
        const { ancestorNodes, remainingNodes } = filter(
          ci.lfDataset,
          { value },
          true,
        );
        const hidden = new Set(remainingNodes);
        if (ancestorNodes)
          ancestorNodes.forEach((a: LfDataNode) => hidden.delete(a));
        ci.hiddenNodes = hidden;
      },
    },
  };
};

export const createHandlers = (
  _getters: CreateAdapterGetters,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => ({
  nodeClick: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    adapter.controller.set.selection.set(node);
    (adapter.controller.get.compInstance as any).onLfEvent?.(e, "click", {
      node,
    });
  },
  nodeExpand: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    adapter.controller.set.expansion.toggle(node);
    (adapter.controller.get.compInstance as any).onLfEvent?.(e, "click", {
      expansion: true,
      node,
    });
  },
  nodePointerDown: (e: Event, node: LfDataNode) => {
    const adapter = getAdapter();
    (adapter.controller.get.compInstance as any).onLfEvent?.(e, "pointerdown", {
      node,
    });
  },
  filterInput: (e: CustomEvent<any>) => {
    const adapter = getAdapter();
    const value = e.detail.inputValue?.toLowerCase() || "";
    const refs: any = adapter.elements.refs;
    clearTimeout(refs._filterTimeout);
    refs._filterTimeout = setTimeout(() => {
      adapter.controller.set.filter.setValue(value);
      adapter.controller.set.filter.apply(value);
    }, 300);
  },
});
