import {
  LfTreeAdapter,
  LfTreeStateCommitOptions,
} from "@lf-widgets/foundations";
import { arraysEqual, normalizeIdInput } from "./state.utils";

/**
 * Configuration paths for accessing state through the adapter.
 * Different state types (expansion/selection) use different adapter paths.
 */
export interface StateSyncPaths {
  /**
   * Gets the current prop value from the component.
   * @returns The current prop value (string[], string, null, or undefined)
   */
  getProp: () => string[] | string | null | undefined;

  /**
   * Sets the component prop value.
   * @param ids - The IDs to set as the prop value
   */
  setProp: (ids: string[]) => void;

  /**
   * Gets the dataset for sanitization.
   * @returns The current dataset
   */
  getDataset: () => any;

  /**
   * Gets the framework manager for utilities.
   * @returns The framework manager instance
   */
  getManager: () => any;
}

/**
 * Creates a unified state synchronizer that handles common patterns across
 * expansion and selection state managers.
 *
 * This synchronizer encapsulates:
 * - Bidirectional prop/state synchronization
 * - suppressPropChange flag management
 * - ID sanitization via framework utilities
 * - Array equality checks before updates
 *
 * @param getAdapter - Function to get the adapter instance
 * @param paths - Configuration paths for accessing state through adapter
 * @returns Object with common state synchronization methods
 */
export const createStateSynchronizer = (
  _getAdapter: () => LfTreeAdapter | undefined,
  paths: StateSyncPaths,
) => {
  let suppressPropChange = false;
  let pendingIds: string[] | undefined;

  /**
   * Synchronizes the component prop with the given IDs.
   * Only updates if the IDs have changed (array equality check).
   * Uses suppressPropChange flag to prevent circular updates.
   *
   * @param ids - The IDs to sync to the prop
   */
  const syncProp = (ids: string[]): void => {
    const current = normalizeIdInput(paths.getProp());
    if (arraysEqual(current, ids)) {
      return;
    }
    suppressPropChange = true;
    paths.setProp([...ids]);
    suppressPropChange = false;
  };

  /**
   * Applies IDs with sanitization via framework utilities.
   * If framework is not available, stores IDs as pending.
   *
   * @param ids - The IDs to apply
   * @param options - Commit options (updateProp, emit, etc.)
   * @param commitFn - The state-specific commit function
   * @returns The sanitized IDs
   */
  const applyIdsWithSanitization = (
    ids: string[],
    options: LfTreeStateCommitOptions,
    commitFn: (sanitized: string[], options: LfTreeStateCommitOptions) => void,
  ): string[] => {
    const candidates = normalizeIdInput(ids);
    const framework = paths.getManager();

    if (!framework) {
      pendingIds = [...candidates];
      commitFn(candidates, options);
      return candidates;
    }

    const { ids: sanitized } = framework.data.node.sanitizeIds(
      paths.getDataset(),
      candidates,
    );

    pendingIds = undefined;
    commitFn(sanitized, options);
    return sanitized;
  };

  /**
   * Handles prop changes from parent component.
   * Skips processing if change was initiated by this synchronizer.
   *
   * @param value - The new prop value
   * @param applyFn - The state-specific apply function
   */
  const handlePropChange = (
    value: string[] | string | null | undefined,
    applyFn: (ids: string[], options: LfTreeStateCommitOptions) => string[],
  ): void => {
    if (suppressPropChange) {
      return;
    }
    const candidates = normalizeIdInput(value);
    const sanitized = applyFn(candidates, {
      emit: false,
      updateProp: false,
    });
    syncProp(sanitized);
  };

  /**
   * Initializes persistent state on component load.
   * Tries prop value first, then pending IDs, then falls back to default.
   *
   * @param value - The initial prop value
   * @param applyFn - The state-specific apply function
   * @param defaultFn - Optional default initialization function
   */
  const initialisePersistentState = (
    value: string[] | string | null | undefined,
    applyFn: (ids: string[], options: LfTreeStateCommitOptions) => string[],
    defaultFn?: () => void,
  ): void => {
    const propCandidates = normalizeIdInput(value);
    if (propCandidates.length) {
      applyFn(propCandidates, { emit: false, updateProp: true });
      pendingIds = undefined;
      return;
    }

    if (pendingIds && pendingIds.length) {
      applyFn(pendingIds, { emit: false, updateProp: true });
      pendingIds = undefined;
      return;
    }

    if (defaultFn) {
      defaultFn();
    }
  };

  /**
   * Reconciles state after dataset changes.
   * Tries to restore persisted prop value, then previous state, then clears.
   *
   * @param previousState - The previous state to try restoring
   * @param applyFn - The state-specific apply function
   * @param clearFn - Optional function to clear state if reconciliation fails
   */
  const reconcileAfterDatasetChange = (
    previousState: string[] | null,
    applyFn: (ids: string[], options: LfTreeStateCommitOptions) => string[],
    clearFn?: () => void,
  ): void => {
    // First priority: persisted prop value
    const persisted = normalizeIdInput(paths.getProp());
    if (persisted.length) {
      const sanitized = applyFn(persisted, {
        emit: false,
        updateProp: false,
      });
      syncProp(sanitized);
      return;
    }

    // Second priority: previous state
    if (previousState && previousState.length) {
      const sanitized = applyFn(previousState, {
        emit: false,
        updateProp: false,
      });
      syncProp(sanitized);
      if (sanitized.length) {
        return;
      }
    }

    // Fallback: clear or apply default
    if (clearFn) {
      clearFn();
    }
  };

  return {
    syncProp,
    applyIdsWithSanitization,
    handlePropChange,
    initialisePersistentState,
    reconcileAfterDatasetChange,
    getPendingIds: () => pendingIds,
    clearPendingIds: () => {
      pendingIds = undefined;
    },
  };
};
