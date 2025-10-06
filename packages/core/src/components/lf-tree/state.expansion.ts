import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeStateCommitOptions,
} from "@lf-widgets/foundations";
import { createStateSynchronizer } from "./state.synchronizer";
import { getNodeId } from "./state.utils";

export const createExpansionState = (
  getAdapter: () => LfTreeAdapter | undefined,
) => {
  const { controller } = getAdapter();

  const sync = createStateSynchronizer(getAdapter, {
    getProp: () => controller.get.expandedProp(),
    setProp: (ids) => controller.set.state.expansion.setProp(ids),
    getDataset: () => controller.get.dataset(),
    getManager: () => controller.get.manager,
  });

  //#region getCurrentIds
  const getCurrentIds = (): string[] => {
    const expanded = controller.get.state.expansion.nodes();
    return Array.from(expanded ?? new Set<string>());
  };
  //#endregion

  //#region commit
  const commit = (
    ids: string[],
    options: LfTreeStateCommitOptions = {},
  ): void => {
    controller.set.state.expansion.setNodes(ids);
    if (options.updateProp !== false) {
      sync.syncProp(ids);
    }
  };
  //#endregion

  //#region applyIds
  const applyIds = (
    ids: string[],
    options: LfTreeStateCommitOptions = {},
  ): string[] => {
    return sync.applyIdsWithSanitization(ids, options, (sanitized, opts) => {
      commit(sanitized, opts);
    });
  };
  //#endregion

  //#region applyInitialExpansion
  const applyInitialExpansion = (previouslyExpanded?: Set<string>): void => {
    const depth = controller.get.initialExpansionDepth();
    const dataset = controller.get.dataset();
    const nodes = (dataset?.nodes as LfDataNode[]) ?? [];
    const retainedExpanded = previouslyExpanded
      ? new Set(previouslyExpanded)
      : new Set<string>();
    const nextExpanded = new Set<string>();

    const walk = (list: LfDataNode[], currentDepth: number) => {
      for (const node of list) {
        const nodeId = getNodeId(node);
        if (nodeId) {
          if (
            depth == null ||
            currentDepth < depth ||
            retainedExpanded.has(nodeId)
          ) {
            nextExpanded.add(nodeId);
          }
        }

        if (Array.isArray(node.children) && node.children.length > 0) {
          walk(node.children as LfDataNode[], currentDepth + 1);
        }
      }
    };

    walk(nodes, 0);
    commit(Array.from(nextExpanded), { emit: false });
  };
  //#endregion

  //#region reconcileAfterDatasetChange
  const reconcileAfterDatasetChange = (
    previouslyExpanded?: Set<string>,
  ): void => {
    const previousIds = previouslyExpanded
      ? Array.from(previouslyExpanded)
      : null;
    sync.reconcileAfterDatasetChange(previousIds, applyIds, () => {
      applyInitialExpansion(previouslyExpanded);
    });
  };
  //#endregion

  //#region handlePropChange
  const handlePropChange = (
    value: string[] | string | null | undefined,
  ): void => {
    sync.handlePropChange(value, applyIds);
  };
  //#endregion

  //#region toggle
  const toggle = (node: LfDataNode): void => {
    const nodeId = getNodeId(node);
    if (!nodeId) {
      return;
    }
    const next = new Set(getCurrentIds());
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    applyIds(Array.from(next), {
      emit: true,
      updateProp: true,
      node,
    });
  };
  //#endregion

  //#region initialisePersistentState
  const initialisePersistentState = (
    value: string[] | string | null | undefined,
  ): void => {
    sync.initialisePersistentState(value, applyIds, () => {
      applyInitialExpansion(new Set(getCurrentIds()));
    });
  };
  //#endregion

  return {
    applyIds,
    handlePropChange,
    applyInitialExpansion,
    reconcileAfterDatasetChange,
    handleInitialDepthChange(previouslyExpanded: Set<string>) {
      applyInitialExpansion(previouslyExpanded);
    },
    toggle,
    getIds: () => getCurrentIds(),
    initialisePersistentState,
  };
};
