import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeStateCommitOptions,
} from "@lf-widgets/foundations";
import { createStateSynchronizer } from "./state.synchronizer";
import { extractIdCandidates, normalizeTargetInput } from "./state.utils";

export const createSelectionState = (
  getAdapter: () => LfTreeAdapter | undefined,
) => {
  const { controller } = getAdapter();

  const sync = createStateSynchronizer(getAdapter, {
    getProp: () => controller.get.selectedProp(),
    setProp: (ids) => controller.set.state.selection.setProp(ids),
    getDataset: () => controller.get.dataset(),
    getManager: () => controller.get.manager,
  });

  let selectionIds: string[] = [];

  //#region commit
  const commit = (
    ids: string[],
    nodes: LfDataNode[],
    options: LfTreeStateCommitOptions = {},
  ): string[] => {
    const nextIds = controller.get.allowsMultiSelect() ? ids : ids.slice(0, 1);
    selectionIds = [...nextIds];
    const nextNode = selectionIds.length ? (nodes[0] ?? null) : null;
    controller.set.state.selection.setNode(nextNode);
    if (options.updateProp !== false) {
      sync.syncProp(selectionIds);
    }
    return selectionIds;
  };
  //#endregion

  //#region clearSelection
  const clearSelection = (options: LfTreeStateCommitOptions = {}): string[] => {
    sync.clearPendingIds();
    selectionIds = [];
    controller.set.state.selection.setNode(null);
    if (options.updateProp !== false) {
      sync.syncProp([]);
    }
    return selectionIds;
  };
  //#endregion

  //#region applyIds
  const applyIds = (
    ids: string[],
    options: LfTreeStateCommitOptions = {},
  ): string[] => {
    if (!controller.get.selectable()) {
      return clearSelection(options);
    }

    let finalIds: string[] = [];

    sync.applyIdsWithSanitization(ids, options, (sanitized, opts) => {
      const framework = controller.get.manager;
      const dataset = controller.get.dataset();

      if (framework && dataset) {
        const result = framework.data.node.sanitizeIds(dataset, sanitized, {
          predicate: (node: LfDataNode) => controller.get.canSelectNode(node),
          limit: controller.get.allowsMultiSelect() ? undefined : 1,
        });
        finalIds = commit(result.ids, result.nodes, opts);
      } else {
        const pendingIds = controller.get.allowsMultiSelect()
          ? sanitized
          : sanitized.slice(0, 1);
        finalIds = commit(pendingIds, [], opts);
      }
    });

    return finalIds;
  };
  //#endregion

  //#region handlePropChange
  const handlePropChange = (
    value: string[] | string | null | undefined,
  ): void => {
    sync.handlePropChange(value, applyIds);
  };
  //#endregion

  //#region applyTargets
  const applyTargets = (
    target: string | LfDataNode | Array<string | LfDataNode> | null,
    options: LfTreeStateCommitOptions = {},
  ): string[] => {
    if (target == null) {
      return applyIds([], options);
    }
    const targets = normalizeTargetInput(target);
    const ids = extractIdCandidates(targets);
    return applyIds(ids, options);
  };
  //#endregion

  //#region reconcileAfterDatasetChange
  const reconcileAfterDatasetChange = (
    previousSelectedId?: string | null,
  ): void => {
    const previousIds = previousSelectedId ? [previousSelectedId] : null;
    sync.reconcileAfterDatasetChange(previousIds, applyIds, () => {
      clearSelection({ emit: false, updateProp: true });
    });
  };
  //#endregion

  //#region initialisePersistentState
  const initialisePersistentState = (
    value: string[] | string | null | undefined,
  ): void => {
    sync.initialisePersistentState(value, applyIds, () => {
      clearSelection({ emit: false, updateProp: true });
    });
  };
  //#endregion

  //#region handleSelectableChange
  const handleSelectableChange = (selectable: boolean): void => {
    if (!selectable) {
      clearSelection({ emit: true, updateProp: true });
    }
  };
  //#endregion

  return {
    applyIds,
    applyTargets,
    handlePropChange,
    reconcileAfterDatasetChange,
    initialisePersistentState,
    handleSelectableChange,
    getIds: () => [...selectionIds],
    clearSelection,
  };
};
