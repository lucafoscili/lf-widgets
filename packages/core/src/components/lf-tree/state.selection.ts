import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeStateCommitOptions,
} from "@lf-widgets/foundations";
import { createStateSynchronizer } from "./state.synchronizer";
import {
  extractIdCandidates,
  normalizeIdInput,
  normalizeTargetInput,
} from "./state.utils";

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
    const candidates = normalizeIdInput(ids);
    const framework = controller.get.manager;

    if (!framework) {
      // Framework not ready - store as pending
      selectionIds = controller.get.allowsMultiSelect()
        ? [...candidates]
        : candidates.slice(0, 1);
      controller.set.state.selection.setNode(null);
      if (options.updateProp !== false) {
        sync.syncProp(selectionIds);
      }
      return selectionIds;
    }

    if (!controller.get.selectable()) {
      return clearSelection(options);
    }

    const result = framework.data.node.sanitizeIds(
      controller.get.dataset(),
      candidates,
      {
        predicate: (node: LfDataNode) => controller.get.canSelectNode(node),
        limit: controller.get.allowsMultiSelect() ? undefined : 1,
      },
    );

    return commit(result.ids, result.nodes, options);
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
