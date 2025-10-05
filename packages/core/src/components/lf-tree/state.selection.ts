import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeStateCommitOptions,
} from "@lf-widgets/foundations";
import {
  arraysEqual,
  extractIdCandidates,
  normalizeIdInput,
  normalizeTargetInput,
} from "./state.utils";

export const createSelectionState = (
  getAdapter: () => LfTreeAdapter | undefined,
) => {
  const { controller } = getAdapter();

  let suppressPropChange = false;
  let pendingIds: string[] | undefined;
  let selectionIds: string[] = [];

  //#region syncProp
  const syncProp = (ids: string[]) => {
    const current = normalizeIdInput(controller.get.selectedProp());
    if (arraysEqual(current, ids)) {
      return;
    }
    suppressPropChange = true;
    controller.set.state.selection.setProp([...ids]);
    suppressPropChange = false;
  };
  //#endregion

  //#region commit
  const commit = (
    ids: string[],
    nodes: LfDataNode[],
    options: LfTreeStateCommitOptions = {},
  ): string[] => {
    const nextIds = controller.get.allowsMultiSelect() ? ids : ids.slice(0, 1);
    const changed = !arraysEqual(selectionIds, nextIds);
    selectionIds = [...nextIds];
    const nextNode = selectionIds.length ? (nodes[0] ?? null) : null;
    controller.set.state.selection.setNode(nextNode);
    if (options.updateProp !== false) {
      syncProp(selectionIds);
    }
    if (options.emit !== false && changed) {
      controller.set.state.selection.emitChange(
        options.event ?? null,
        options.node ?? nextNode,
        [...selectionIds],
      );
    }
    return selectionIds;
  };
  //#endregion

  //#region clearSelection
  const clearSelection = (options: LfTreeStateCommitOptions = {}): string[] => {
    pendingIds = undefined;
    selectionIds = [];
    controller.set.state.selection.setNode(null);
    if (options.updateProp !== false) {
      syncProp([]);
    }
    if (options.emit !== false) {
      controller.set.state.selection.emitChange(
        options.event ?? null,
        options.node ?? null,
        [],
      );
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
      pendingIds = [...candidates];
      selectionIds = controller.get.allowsMultiSelect()
        ? [...candidates]
        : candidates.slice(0, 1);
      controller.set.state.selection.setNode(null);
      if (options.updateProp !== false) {
        syncProp(selectionIds);
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

    pendingIds = undefined;
    return commit(result.ids, result.nodes, options);
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
    const persisted = normalizeIdInput(controller.get.selectedProp());
    if (persisted.length) {
      const sanitized = applyIds(persisted, {
        emit: false,
        updateProp: false,
      });
      syncProp(sanitized);
      return;
    }

    if (previousSelectedId) {
      const sanitized = applyIds([previousSelectedId], {
        emit: false,
        updateProp: false,
      });
      syncProp(sanitized);
      if (sanitized.length) {
        return;
      }
    }

    clearSelection({ emit: false, updateProp: true });
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

    clearSelection({ emit: false, updateProp: true });
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
