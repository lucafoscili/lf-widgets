import {
  LfAccordionEventPayload,
  LfCheckboxEventPayload,
  LfMultiInputEventPayload,
  LfSelectEventPayload,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterHandlers,
  LfSliderEventPayload,
  LfTextfieldEventPayload,
  LfToggleEventPayload,
} from "@lf-widgets/foundations";
import {
  clearHistory,
  deleteShape,
  parseConfigDslFromNode,
  redo,
  resetControls,
  save,
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
    actionsButton: async (e: MouseEvent, buttonId: string) => {
      const adapter = getAdapter();
      const { compInstance, currentShape, ids } = adapter.controller.get;

      const i = ids();
      const c = compInstance() as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      switch (buttonId) {
        case i.settings.actions.delete:
          await deleteShape(adapter);
          break;
        case i.settings.actions.badge:
          // Toggle history column visibility in preview panel
          adapter.controller.actions.history.toggle();
          break;
        case i.settings.actions.clear:
          const index = currentShape().shape.index;
          await clearHistory(adapter, index);
          break;
        case i.settings.actions.undo:
          await undo(adapter);
          break;
        case i.settings.actions.redo:
          await redo(adapter);
          break;
        case i.settings.actions.commit:
          await save(adapter);
          break;
      }
    },
    //#endregion

    //#region Tree handler (DSL selector)
    tree: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const comp = compInstance() as LfShapeeditor;

      const { eventType, node } = e.detail;

      switch (eventType) {
        case "click":
          const dsl = parseConfigDslFromNode(node);

          if (dsl) {
            const { set } = adapter.controller;

            set.config.controls(dsl.controls || []);
            set.config.layout(dsl.layout);
            set.config.settings(dsl.defaultSettings || {});
            // Behavioral metadata
            set.config.behavior(dsl.behavior);
            set.config.commitTrigger(dsl.commitTrigger);
            set.config.showApplyButton(dsl.showApplyButton);
            set.config.showResetButton(dsl.showResetButton ?? true);
            set.config.enablePreview(dsl.enablePreview);
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

      const comp = compInstance() as LfShapeeditor;

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
    controlActionsButton: async (e: MouseEvent, buttonId: string) => {
      const adapter = getAdapter();
      const { compInstance, ids } = adapter.controller.get;

      const i = ids();
      const c = compInstance() as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      switch (buttonId) {
        case i.settings.controls.controlActions.apply:
          c.onLfEvent(null, "apply");
          break;
        case i.settings.controls.controlActions.reset:
          await resetControls(adapter);
          c.onLfEvent(null, "reset");
          break;
      }
    },
    //#endregion

    //#region Control-specific handlers
    controls: {
      checkbox: (e, controlId) => {
        const { eventType, valueAsBoolean } =
          e.detail as LfCheckboxEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        if (eventType === "change") {
          controlChange(e, controlId, valueAsBoolean, "change");
        }
      },

      colorpicker: (e, controlId) => {
        const { eventType, inputValue, value } =
          e.detail as LfTextfieldEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        switch (eventType) {
          case "change":
            controlChange(e, controlId, value, "change");
            break;
          case "input":
            controlChange(e, controlId, inputValue, "input");
            break;
        }
      },

      multiinput: (e, controlId) => {
        const { eventType, value } = e.detail as LfMultiInputEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        if (eventType === "change") {
          controlChange(e, controlId, value, "change");
        }
      },

      number: (e, controlId) => {
        const { eventType, inputValue, value } =
          e.detail as LfTextfieldEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        switch (eventType) {
          case "change":
            controlChange(e, controlId, parseFloat(value) || 0, "change");
            break;
          case "input":
            controlChange(e, controlId, parseFloat(inputValue) || 0, "input");
            break;
        }
      },

      select: (e, controlId) => {
        const { eventType, value } = e.detail as LfSelectEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        if (eventType === "change") {
          controlChange(e, controlId, value, "change");
        }
      },

      slider: (e, controlId) => {
        const { eventType, value } = e.detail as LfSliderEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        switch (eventType) {
          case "change":
            controlChange(e, controlId, value.real, "change");
            break;
          case "input":
            controlChange(e, controlId, value.display, "input");
            break;
        }
      },

      textfield: (e, controlId) => {
        const { eventType, inputValue, value } =
          e.detail as LfTextfieldEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        switch (eventType) {
          case "change":
            controlChange(e, controlId, value, "change");
            break;
          case "input":
            controlChange(e, controlId, inputValue, "input");
            break;
        }
      },

      toggle: (e, controlId) => {
        const { eventType, valueAsBoolean } = e.detail as LfToggleEventPayload;
        const { controlChange } = getAdapter().handlers.settings;

        if (eventType === "change") {
          controlChange(e, controlId, valueAsBoolean, "change");
        }
      },
    },
    //#endregion
  };
};
