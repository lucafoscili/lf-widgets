/**
 * Image Editor Settings DSL - Background Tools
 *
 * Background removal and replacement configurations.
 */

import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";

import { common, control, extractDefaults } from "../../../controls";

//#region Background Remover
const backgroundRemoverControls = [
  control.toggle("bgRemover_transparent", {
    defaultValue: true,
    label: "Transparent Background",
    description:
      "Keep an alpha channel instead of filling the background with the selected color.",
  }),
  common.color({
    prefix: "bgRemover",
    defaultValue: "#000000",
    label: "Background Color",
    description:
      "Used to fill the removed background when transparency is disabled.",
  }),
];

export const IMAGE_EDITOR_BACKGROUND_REMOVER_DSL: LfShapeeditorConfigDsl = {
  controls: backgroundRemoverControls,
  layout: [
    {
      id: "bgRemover_general",
      label: "Background Remover",
      controlIds: ["bgRemover_transparent", "bgRemover_color"],
    },
  ],
  defaultSettings: extractDefaults(backgroundRemoverControls),
};
//#endregion
