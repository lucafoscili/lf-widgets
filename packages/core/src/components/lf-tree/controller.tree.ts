import {
  LfTreeAdapterControllerGetters,
  LfTreeAdapterControllerSetters,
  LfTreeAdapterInitializerGetters,
  LfTreeAdapterInitializerSetters,
} from "@lf-widgets/foundations";

export const createGetters = (
  getters: LfTreeAdapterInitializerGetters,
): LfTreeAdapterControllerGetters => ({
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
  filterValue: getters.filterValue,
});

export const createSetters = (
  setters: LfTreeAdapterInitializerSetters,
): LfTreeAdapterControllerSetters => ({
  expansion: setters.expansion,
  selection: setters.selection,
  filter: setters.filter,
});
