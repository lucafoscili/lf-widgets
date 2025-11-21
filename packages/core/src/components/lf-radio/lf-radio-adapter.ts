import {
  LfRadioAdapter,
  LfRadioAdapterInitializerGetters,
  LfRadioAdapterInitializerSetters,
  LfRadioAdapterJsx,
  LfRadioAdapterRefs,
} from "@lf-widgets/foundations";

import { prepRadio } from "./elements.radio";
import { createHandlers } from "./handlers.radio";

//#region Elements - Refs
export const createRefs = (): LfRadioAdapterRefs => ({
  items: new Map(),
  ripples: new Map(),
  inputs: new Map(),
});
//#endregion

//#region Elements - JSX
export const createJsx = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterJsx => {
  return prepRadio(getAdapter);
};
//#endregion

export function createAdapter(
  getters: LfRadioAdapterInitializerGetters,
  setters: LfRadioAdapterInitializerSetters,
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapter {
  return {
    controller: {
      get: getters,
      set: setters,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
}
