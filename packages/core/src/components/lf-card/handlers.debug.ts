import {
  LF_CARD_IDS,
  LfCardAdapter,
  LfCardAdapterHandlers,
  LfListEventPayload,
} from "@lf-widgets/foundations";

export const prepDebugHandlers = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterHandlers["layouts"]["debug"] => {
  return {
    //#region Button
    button: (e) => {
      const { eventType, id, originalEvent } = e.detail;

      const { controller, handlers } = getAdapter();
      const { manager } = controller.get;
      const { layouts } = handlers;
      const { debug, theme } = manager;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_CARD_IDS.clear:
              debug.logs.dump();
              break;
            case LF_CARD_IDS.theme:
              theme.randomize();
              break;
          }
          break;
        case "lf-event":
          switch (id) {
            case LF_CARD_IDS.theme:
              layouts.debug.list(
                originalEvent as CustomEvent<LfListEventPayload>,
              );
              break;
          }
          break;
      }
    },
    //#endregion

    //#region Code
    code: (e) => {
      const { comp, eventType } = e.detail;

      const { controller } = getAdapter();
      const { manager } = controller.get;
      const { debug } = manager;

      switch (eventType) {
        case "ready":
          debug.register(comp);
          break;
        case "unmount":
          debug.unregister(comp);
          break;
      }
    },
    //#endregion

    //#region List
    list: (e) => {
      const { eventType, node } = e.detail;

      const { controller } = getAdapter();
      const { manager } = controller.get;
      const { theme } = manager;

      switch (eventType) {
        case "click":
          theme.set(node.id);
          break;
      }
    },
    //#endregion

    //#region Toggle
    toggle: (e) => {
      const { comp, eventType, value } = e.detail;

      const boolValue = value === "on" ? true : false;

      const { controller } = getAdapter();
      const { manager } = controller.get;
      const { debug } = manager;

      switch (eventType) {
        case "change":
          debug.toggle(boolValue, false);
          break;
        case "ready":
          debug.register(comp);
          break;
        case "unmount":
          debug.unregister(comp);
          break;
      }
    },
    //#endregion
  };
};
