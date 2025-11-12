import { LfListAdapter, LfListAdapterHandlers } from "@lf-widgets/foundations";

export const prepListHandlers = (
  getAdapter: () => LfListAdapter,
): LfListAdapterHandlers => {
  return {
    filter: async (event: CustomEvent) => {
      const { detail } = event;
      const { eventType } = detail;

      const { controller } = getAdapter();
      const { set } = controller;

      switch (eventType) {
        case "input":
          const { value } = detail;
          set.filter.apply(value);
          break;
      }
    },
  };
};
