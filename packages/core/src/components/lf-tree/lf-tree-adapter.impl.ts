// Internal implementation moved here to avoid .tsx shadowing issues during Rollup resolution.
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LfFrameworkInterface,
  LfDataNode,
  LfDataDataset,
  LF_TREE_BLOCKS,
  LF_TREE_PARTS,
  LfTreeAdapter,
  LfTreeAdapterControllerGetters,
  LfTreeAdapterControllerSetters,
  LfTreeAdapterHandlers,
  LfTreeAdapterInitializerGetters,
  LfTreeAdapterInitializerSetters,
  LfTreeAdapterRefs,
  LfTreeInterface,
} from "@lf-widgets/foundations";
import { createJsx } from "./lf-tree-elements";
export type { LfTreeAdapter } from "@lf-widgets/foundations";

// New standardized adapter factory (Phase 1)
export const createAdapter = (
  getters: LfTreeAdapterInitializerGetters,
  setters: LfTreeAdapterInitializerSetters,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapter => {
  return {
    controller: {
      get: createGetters(getters),
      set: createSetters(setters),
    },
    elements: { jsx: createJsx(getAdapter), refs: createRefs() },
    handlers: createHandlers(getters, getAdapter),
  };
};

// Backwards compatibility wrapper (deprecated) – remove in Phase 2 cleanup
// Accepts the old (gettersOnly, getAdapter) signature.
// eslint-disable-next-line @typescript-eslint/ban-types
export const createAdapterLegacy = (
  legacy: {
    compInstance: LfTreeInterface;
    manager: LfFrameworkInterface;
    blocks: typeof LF_TREE_BLOCKS;
    parts: typeof LF_TREE_PARTS;
  },
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapter =>
  createAdapter(
    {
      blocks: legacy.blocks,
      compInstance: legacy.compInstance,
      cyAttributes: CY_ATTRIBUTES,
      dataset: () => legacy.compInstance.lfDataset as LfDataDataset,
      columns: () => legacy.compInstance.lfDataset?.columns || [],
      isGrid: () =>
        !!(
          legacy.compInstance.lfGrid &&
          legacy.compInstance.lfDataset?.columns?.length
        ),
      lfAttributes: LF_ATTRIBUTES,
      manager: legacy.manager,
      parts: legacy.parts,
      isExpanded: (node: LfDataNode) =>
        (legacy.compInstance as any).expandedNodes?.has(node),
      isHidden: (node: LfDataNode) =>
        (legacy.compInstance as any).hiddenNodes?.has(node),
      isSelected: (node: LfDataNode) =>
        (legacy.compInstance as any).selectedNode === node,
      filterValue: () => (legacy.compInstance as any)._filterValue || "",
    },
    buildSetters(legacy, getAdapter),
    getAdapter,
  );

export const createGetters = (
  getters: LfTreeAdapterInitializerGetters,
): LfTreeAdapterControllerGetters => {
  return {
    blocks: getters.blocks,
    compInstance: getters.compInstance,
    manager: getters.manager,
    cyAttributes: getters.cyAttributes,
    dataset: getters.dataset,
    columns: getters.columns,
    isGrid: getters.isGrid,
    lfAttributes: getters.lfAttributes,
    parts: getters.parts,
    isExpanded: getters.isExpanded,
    isHidden: getters.isHidden,
    isSelected: getters.isSelected,
    filterValue: getters.filterValue(),
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

// Setters builder (legacy path) re-used by legacy wrapper to avoid code duplication
export const buildSetters = (
  legacyGetters: { compInstance: LfTreeInterface },
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterInitializerSetters => {
  const ci = legacyGetters.compInstance as any;
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

export const createSetters = (
  setters: LfTreeAdapterInitializerSetters,
): LfTreeAdapterControllerSetters => {
  return setters as unknown as LfTreeAdapterControllerSetters; // structure already matches
};

export const createHandlers = (
  _getters: LfTreeAdapterInitializerGetters | any,
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
    const ci: any = adapter.controller.get.compInstance;
    // Dual emission: explicit expand + legacy click with expansion arg
    ci.onLfEvent?.(e, "expand", { node, expansion: true });
    ci.onLfEvent?.(e, "click", { node, expansion: true });
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
    // Local runtime debounce (avoids mixing into refs shape)
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
