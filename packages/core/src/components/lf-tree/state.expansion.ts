import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeStateCommitOptions,
} from "@lf-widgets/foundations";
import { arraysEqual, getNodeId, normalizeIdInput } from "./state.utils";

export const createExpansionState = (
  getAdapter: () => LfTreeAdapter | undefined,
) => {
  const { controller } = getAdapter();

  let suppressPropChange = false;
  let pendingIds: string[] | undefined;

  //#region getCurrentIds
  const getCurrentIds = (): string[] => {
    const expanded = controller.get.state.expansion.nodes();
    return Array.from(expanded ?? new Set<string>());
  };
  //#endregion

  //#region syncProp
  const syncProp = (ids: string[]) => {
    const current = normalizeIdInput(controller.get.expandedProp());
    if (arraysEqual(current, ids)) {
      return;
    }
    suppressPropChange = true;
    controller.set.state.expansion.setProp([...ids]);
    suppressPropChange = false;
  };
  //#endregion

  //#region commit
  const commit = (
    ids: string[],
    options: LfTreeStateCommitOptions = {},
  ): void => {
    controller.set.state.expansion.setNodes(ids);
    if (options.updateProp !== false) {
      syncProp(ids);
    }
  };
  //#endregion

  //#region applyIds
  const applyIds = (
    ids: string[],
    options: LfTreeStateCommitOptions = {},
  ): string[] => {
    const candidates = normalizeIdInput(ids);
    const framework = controller.get.manager;
    if (!framework) {
      pendingIds = [...candidates];
      controller.set.state.expansion.setNodes(candidates);
      if (options.updateProp !== false) {
        syncProp(candidates);
      }
      return candidates;
    }

    const { ids: sanitized } = framework.data.node.sanitizeIds(
      controller.get.dataset(),
      candidates,
    );
    pendingIds = undefined;
    commit(sanitized, options);
    return sanitized;
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
    const persisted = normalizeIdInput(controller.get.expandedProp());
    if (persisted.length) {
      const sanitized = applyIds(persisted, {
        emit: false,
        updateProp: false,
      });
      syncProp(sanitized);
      return;
    }

    const retained = previouslyExpanded ? Array.from(previouslyExpanded) : [];
    if (retained.length) {
      const sanitized = applyIds(retained, {
        emit: false,
        updateProp: false,
      });
      syncProp(sanitized);
      if (sanitized.length) {
        return;
      }
    }

    applyInitialExpansion(previouslyExpanded);
  };
  //#endregion

  //#region handlePropChange
  const handlePropChange = (
    value: string[] | string | null | undefined,
  ): void => {
    if (suppressPropChange) {
      return;
    }
    const candidates = normalizeIdInput(value);
    const sanitized = applyIds(candidates, {
      emit: false,
      updateProp: false,
    });
    syncProp(sanitized);
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
    const propCandidates = normalizeIdInput(value);
    if (propCandidates.length) {
      applyIds(propCandidates, { emit: false, updateProp: true });
      pendingIds = undefined;
      return;
    }

    if (pendingIds && pendingIds.length) {
      applyIds(pendingIds, { emit: false, updateProp: true });
      pendingIds = undefined;
      return;
    }

    applyInitialExpansion(new Set(getCurrentIds()));
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
