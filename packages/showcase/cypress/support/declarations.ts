import { CY_ATTRIBUTES } from "@lf-widgets/foundations";

export type DataCyAttributeTransformed = {
  [K in keyof typeof CY_ATTRIBUTES]: `[data-cy="${(typeof CY_ATTRIBUTES)[K]}"]`;
};
