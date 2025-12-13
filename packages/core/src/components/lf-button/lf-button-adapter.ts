import {
  LfButtonAdapter,
  LfButtonAdapterControllerGetters,
  LfButtonAdapterControllerSetters,
  LfButtonAdapterDispatcher,
  LfButtonAdapterHandlers,
  LfButtonAdapterInitializerGetters,
  LfButtonAdapterInitializerSetters,
  LfButtonAdapterJsx,
  LfButtonAdapterRefs,
} from "@lf-widgets/foundations";
import { prepButton } from "./elements.button";
import { prepButtonHandlers } from "./handlers.button";

/**
 * Creates the canonical adapter for lf-button.
 * Follows 4-domain structure: controller, elements, handlers, dispatcher.
 * @see Section 5.3 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfButtonAdapterInitializerGetters,
  setters: LfButtonAdapterInitializerSetters,
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapter => {
  return {
    controller: {
      get: createGetters(getters),
      set: createSetters(setters, getAdapter),
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
    dispatcher: createDispatcher(getAdapter),
  };
};
//#endregion

//#region Controller
export const createGetters = (
  getters: LfButtonAdapterInitializerGetters,
): LfButtonAdapterControllerGetters => {
  return getters;
};

export const createSetters = (
  setters: LfButtonAdapterInitializerSetters,
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterControllerSetters => {
  return {
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { manager } = controller.get;
      const { dropdown, list } = elements.refs;

      const { close, isInPortal, open } = manager().portal;

      switch (state) {
        case "close":
          close(list);
          break;
        case "open":
          open(list, dropdown);
          break;
        default:
          if (isInPortal(list)) {
            close(list);
          } else {
            open(list, dropdown);
          }
          break;
      }
    },
  };
};
//#endregion

//#region Dispatcher
/**
 * Creates the dispatcher for centralized event emission.
 * All events go through this single point for logging and consistency.
 * @see Section 5.3 of 4_0_0_REFACTORING.md
 */
export const createDispatcher = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterDispatcher => {
  return {
    emit: (eventType, detail) => {
      const adapter = getAdapter();
      const { compInstance, manager } = adapter.controller.get;

      const comp = compInstance();
      const framework = manager();

      // Debug logging for all events
      framework.debug?.logs.new(
        comp,
        `Event: ${eventType}`,
        "informational",
      );

      // Emit with guaranteed payload structure
      comp.lfEvent.emit({
        comp,
        eventType,
        id: comp.rootElement.id,
        originalEvent: detail?.originalEvent,
        value: detail?.value ?? (comp as unknown as { value: string }).value,
        valueAsBoolean: detail?.valueAsBoolean ?? false,
      });
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterJsx => {
  return prepButton(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return prepButtonHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_BUTTON_BLOCKS.
 * All BLOCKS elements have corresponding refs.
 */
export const createRefs = (): LfButtonAdapterRefs => {
  return {
    button: null,
    dropdown: null,
    icon: null,
    label: null,
    list: null,
    spinner: null,
  };
};
//#endregion
