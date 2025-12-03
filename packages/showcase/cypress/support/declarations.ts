import {
  CY_ATTRIBUTES,
  LF_EFFECTS_LAYER_ATTRIBUTES,
} from "@lf-widgets/foundations";
import { CY_EFFECT_LAYERS } from "./constants";

export type DataCyAttributeTransformed = {
  [K in keyof typeof CY_ATTRIBUTES]: `[data-cy="${(typeof CY_ATTRIBUTES)[K]}"]`;
};

export type EffectLayerTransformed = {
  [K in keyof typeof CY_EFFECT_LAYERS]: `[${(typeof LF_EFFECTS_LAYER_ATTRIBUTES)["layer"]}="${(typeof CY_EFFECT_LAYERS)[K]}"]`;
};
