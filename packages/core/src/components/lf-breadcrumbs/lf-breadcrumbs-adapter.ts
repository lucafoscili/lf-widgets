import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterInitializerGetters,
  LfBreadcrumbsAdapterInitializerSetters,
  LfBreadcrumbsAdapterRefs,
} from "@lf-widgets/foundations";
import { prepBreadcrumbsJsx } from "./elements.breadcrumbs";
import { prepBreadcrumbsHandlers } from "./handlers.breadcrumbs";

//#region Adapter
export const createAdapter = (
  getters: LfBreadcrumbsAdapterInitializerGetters,
  setters: LfBreadcrumbsAdapterInitializerSetters,
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapter => {
  return {
    controller: {
      get: getters,
      set: setters,
    },
    elements: {
      jsx: prepBreadcrumbsJsx(getAdapter),
      refs: prepRefs(),
    },
    handlers: prepBreadcrumbsHandlers(getAdapter),
  };
};

export const prepRefs = (): LfBreadcrumbsAdapterRefs => ({
  items: new Map(),
});
//#endregion
