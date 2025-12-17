import { LfMultiInputAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface MultiinputFCProps {
  adapter: LfMultiInputAdapter;
}
//#endregion

/**
 * FC for the multiinput component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes chips and textfield JSX elements with adapter state.
 */
export const MultiinputFC: FunctionalComponent<MultiinputFCProps> = ({
  adapter,
}) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const parts = get.parts();
  const { theme } = get.framework();
  const { bemClass } = theme;

  const { chips, textfield } = elements.jsx;

  return (
    <div class={bemClass(blocks._)} part={parts.multiinput}>
      {chips()}
      {textfield()}
    </div>
  );
};
