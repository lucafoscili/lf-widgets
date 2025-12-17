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
    button: async (e: MouseEvent, id: string) => {
      const { customization } = getAdapter().controller.set.ui;

      switch (id) {
        case LF_MESSENGER_IDS.messenger.options.customize:
          customization(true);
          break;
        case LF_MESSENGER_IDS.messenger.options.back:
          customization(false);
          break;
      }
    },
    //#endregion
  };
};
