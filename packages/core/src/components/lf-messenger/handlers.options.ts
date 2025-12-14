import {
  LF_MESSENGER_IDS,
  LfMessengerAdapter,
  LfMessengerAdapterHandlers,
} from "@lf-widgets/foundations";

export const prepOptionsHandlers = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterHandlers["options"] => {
  return {
    //#region Button
    button: async (e) => {
      const { eventType, id } = e.detail;

      const { customization } = getAdapter().controller.set.ui;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_MESSENGER_IDS.messenger.options.customize:
              customization(true);
              break;
            case LF_MESSENGER_IDS.messenger.options.back:
              customization(false);
              break;
          }
          break;
      }
    },
    //#endregion
  };
};
