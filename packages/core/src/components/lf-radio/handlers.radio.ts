import {
  LfDataNode,
  LfRadioAdapter,
  LfRadioAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the radio component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (select, clear, focusNext, focusPrevious)
 * - Uses `controller.computed` for state derivation (selectedId, isSelected)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepRadioHandlers = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterHandlers => {
  return {
    //#region Blur
    blur: (e: FocusEvent, node: LfDataNode) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;

      dispatcher.emit("blur", {
        originalEvent: e,
        node,
      });
    },
    //#endregion

    //#region Click
    click: (e: MouseEvent, node: LfDataNode) => {
      const adapter = getAdapter();
      const { actions } = adapter.controller;
      const { dispatcher } = adapter;

      actions.select(node.id);
      dispatcher.emit("click", {
        originalEvent: e,
        node,
      });
    },
    //#endregion

    //#region Change
    change: (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { actions } = adapter.controller;
      const { dispatcher } = adapter;

      actions.select(node.id);
      dispatcher.emit("change", {
        originalEvent: e,
        node,
      });
    },
    //#endregion

    //#region Focus
    focus: (e: FocusEvent, node: LfDataNode) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;

      dispatcher.emit("focus", {
        originalEvent: e,
        node,
      });
    },
    //#endregion

    //#region Key Down
    keyDown: (e: KeyboardEvent) => {
      const adapter = getAdapter();
      const { actions, computed } = adapter.controller;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          actions.focusNext();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          actions.focusPrevious();
          break;
        case " ":
        case "Enter":
          // Space or Enter on focused item selects it
          if (e.target instanceof HTMLInputElement) {
            const nodeId = e.target.value;
            if (!computed.isSelected(nodeId)) {
              actions.select(nodeId);
            }
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    //#endregion

    //#region Pointer Down
    pointerDown: (e: PointerEvent, node: LfDataNode) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;

      dispatcher.emit("pointerdown", {
        originalEvent: e,
        node,
      });
    },
    //#endregion
  };
};
//#endregion
