import { LfChipAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface ChipFCProps {
  adapter: LfChipAdapter;
}
//#endregion

/**
 * FC for the chip item set.
 * Per Section 5.9 "Mirroring Rule" - renders the chip grid content.
 */
export const ChipFC: FunctionalComponent<ChipFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const blocks = get.blocks();
  const parts = get.parts();
  const { theme } = get.framework();
  const { bemClass } = theme;
  const { compInstance } = get;

  const { isChoice, isFilter, isInput } = computed;
  const { chip } = elements.jsx;

  const { chip: chipBlock } = blocks;
  const component = compInstance();

  return (
    <div
      class={bemClass(chipBlock._, null, {
        choice: isChoice(),
        filter: isFilter(),
        flat: component.lfFlat,
        input: isInput(),
      })}
      part={parts.chip}
      role="grid"
    >
      {chip()}
    </div>
  );
};
