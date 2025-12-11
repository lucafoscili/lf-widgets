import {
  LfAccordionEventPayload,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterHandlers,
} from "@lf-widgets/foundations";
import {
  clearHistory,
  deleteShape,
  parseConfigDslFromNode,
  redo,
  resetControls,
  save,
  toggleButtonSpinner,
  undo,
} from "./helpers.utils";
import { LfShapeeditor } from "./lf-shapeeditor";

/**
 * Prepares the settings panel event handlers.
 */
export const prepSettingsHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers["settings"] => {
  return {
    //#region Actions button handler (delete, badge, clear, redo, undo, commit)
    actionsButton: async (e) => {
      const { comp, eventType, id } = e.detail;

      const adapter = getAdapter();
      const { compInstance, currentShape, ids } = adapter.controller.get;

      const c = compInstance as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      switch (eventType) {
        case "click":
          switch (id) {
            case ids.settings.actions.delete:
              toggleButtonSpinner(comp, () => deleteShape(adapter));
              break;
            case ids.settings.actions.badge:
              // Toggle history column visibility in preview panel
              adapter.controller.set.history.togglePopup();
              break;
            case ids.settings.actions.clear:
              const index = currentShape().shape.index;
              const cb = async () => clearHistory(adapter, index);
              toggleButtonSpinner(comp, cb);
              break;
            case ids.settings.actions.undo:
              toggleButtonSpinner(comp, () => undo(adapter));
              break;
            case ids.settings.actions.redo:
              toggleButtonSpinner(comp, () => redo(adapter));
              break;
            case ids.settings.actions.commit:
              toggleButtonSpinner(comp, () => save(adapter));
              break;
          }
      }
    },
    //#endregion

    //#region Tree handler (DSL selector)
    tree: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const comp = compInstance as LfShapeeditor;

      const { eventType, node } = e.detail;

      switch (eventType) {
        case "click":
          const dsl = parseConfigDslFromNode(node);

          if (dsl) {
            const { set } = adapter.controller;

            set.config.controls(dsl.controls || []);
            set.config.layout(dsl.layout);
            set.config.settings(dsl.defaultSettings || {});
          }
          break;
      }

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Accordion toggle handler
    accordionToggle: async (e) => {
      const { eventType } = e.detail;

      if (eventType !== "expand") {
        return;
      }

      const adapter = getAdapter();
      const accordion = (e.detail as LfAccordionEventPayload).comp;
      const expanded = await accordion.getExpandedNodes();

      adapter.controller.set.config.expandedGroups(Array.from(expanded));
    },
    //#endregion

    //#region Control change handler
    controlChange: (e, controlId, value, eventType) => {
      const adapter = getAdapter();
      const { compInstance, config } = adapter.controller.get;

      const comp = compInstance as LfShapeeditor;

      const currentSettings = {
        ...(config?.settings?.() || {}),
        [controlId]: value as string | number | boolean,
      };

      adapter.controller.set.config.settings(currentSettings);

      // Emit different event types based on control interaction:
      // - "input" → "preview" (real-time preview without snapshot)
      // - "change" → "change" (commit value, may capture snapshot)
      const shapeeditorEventType = eventType === "input" ? "preview" : "change";
      comp.onLfEvent(e, shapeeditorEventType);
    },
    //#endregion

    //#region Control actions button handler (reset/apply)
    controlActionsButton: async (e) => {
      const { comp, eventType, id } = e.detail;

      const adapter = getAdapter();
      const { compInstance, ids } = adapter.controller.get;

      const c = compInstance as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      switch (eventType) {
        case "click":
          switch (id) {
            case ids.settings.controls.controlActions.apply:
              toggleButtonSpinner(comp, async () => {
                c.onLfEvent(e, "apply");
              });
              break;
            case ids.settings.controls.controlActions.reset:
              toggleButtonSpinner(comp, async () => {
                await resetControls(adapter);
                c.onLfEvent(e, "reset");
              });
              break;
          }
      }
    },
    //#endregion
  };
};
