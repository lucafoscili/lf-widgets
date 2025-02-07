import {
  LfButtonAdapter,
  LfButtonAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfButton } from "./lf-button";

export const prepSideButtonHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return {
    list: (e) => {
      const { eventType } = e.detail;

      const { controller } = getAdapter();
      const { get, set } = controller;

      switch (eventType) {
        case "click":
          const comp = get.compInstance as LfButton;
          comp.onLfEvent(e, "lf-event");
          set.list("close");
          break;
      }
    },
  };
};
