import { LfMessengerAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent } from "@stencil/core";

//#region Props
export interface MessengerListFCProps {
  adapter: LfMessengerAdapter;
}
//#endregion

/**
 * FC for the messenger list item.
 * Displays a single image option in the customization list.
 * Note: The actual list rendering is done in MessengerExtraContextFC.
 * This file exists for completeness but the logic is inline.
 */
export const MessengerListFC: FunctionalComponent<MessengerListFCProps> = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props,
) => {
  // The list rendering is handled inline in MessengerExtraContextFC
  // because it requires complex iteration over image types and nodes.
  // This stub exists for the index.ts exports.
  return null;
};
