import { LfProgressbarAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent } from "@stencil/core";

//#region Props
export interface ProgressbarFCProps {
  adapter: LfProgressbarAdapter;
}
//#endregion

/**
 * FC for the progressbar component.
 * Per Section 5.9 "Mirroring Rule" - mirrors elements.progressbar rendering.
 *
 * This FC receives the adapter and delegates to the JSX factory functions
 * defined in elements.progressbar.tsx to render the progressbar UI.
 * The JSX factory handles the actual structure (linear vs radial).
 */
export const ProgressbarFC: FunctionalComponent<ProgressbarFCProps> = ({
  adapter,
}) => {
  const { elements } = adapter;
  const { progressbar } = elements.jsx;

  return progressbar();
};
