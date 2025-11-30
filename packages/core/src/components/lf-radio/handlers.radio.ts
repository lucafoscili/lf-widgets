import {
  LfDataNode,
  LfRadioAdapter,
  LfRadioAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfRadio } from "./lf-radio";

export const createHandlers = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterHandlers => {
  return {
    //#region Blur
    blur: async (e: FocusEvent, nodeId: string) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const node = adapter.controller.get.data.nodeById(nodeId);
      const comp = compInstance as LfRadio;

      if (!node) {
        return;
      }

      comp.onLfEvent(e, "blur", undefined, node);
    },
    //#endregion

    //#region Click
    click: async (e: MouseEvent, nodeId: string) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const node = adapter.controller.get.data.nodeById(nodeId);
      const comp = compInstance as LfRadio;

      if (!node) {
        return;
      }

      comp.onLfEvent(e, "click", undefined, node);
    },
    //#endregion

    //#region Change
    change: async (e: Event, nodeId: string) => {
      const adapter = getAdapter();
      const { compInstance, data } = adapter.controller.get;
      const node = data.nodeById(nodeId);
      const comp = compInstance as LfRadio;

      if (!node) {
        return;
      }

      comp.onLfEvent(e, "change", undefined, node);
    },
    //#endregion

    //#region Focus
    focus: async (e: FocusEvent, nodeId: string) => {
      const adapter = getAdapter();
      const { compInstance, data } = adapter.controller.get;
      const node = data.nodeById(nodeId);
      const comp = compInstance as LfRadio;

      if (!node) {
        return;
      }

      comp.onLfEvent(e, "focus", undefined, node);
    },
    //#endregion

    //#region Key Down
    keyDown: async (e: KeyboardEvent) => {
      const adapter = getAdapter();
      const nodes = adapter.controller.get.data.nodes();
      const currentId = adapter.controller.get.state.selectedId();

      if (!nodes || nodes.length === 0) {
        return;
      }

      const currentIndex = currentId
        ? nodes.findIndex((n: LfDataNode) => n.id === currentId)
        : -1;

      let nextIndex = -1;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          nextIndex =
            currentIndex === -1 ? 0 : (currentIndex + 1) % nodes.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          nextIndex =
            currentIndex === -1
              ? nodes.length - 1
              : (currentIndex - 1 + nodes.length) % nodes.length;
          break;
        case " ":
        case "Enter":
          // Space or Enter on focused item selects it
          if (e.target instanceof HTMLInputElement) {
            const nodeId = e.target.value;
            await adapter.controller.set.selection.select(nodeId);
          }
          e.preventDefault();
          return;
        default:
          return;
      }

      if (nextIndex !== -1) {
        const nextNode = nodes[nextIndex];
        await adapter.controller.set.selection.select(nextNode.id);

        const inputEl = adapter.elements.refs.inputs.get(nextNode.id);
        if (inputEl) {
          inputEl.focus();
        }
      }
    },
    //#endregion

    //#region Pointer Down
    pointerDown: async (e: Event, node: LfDataNode) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const comp = compInstance as LfRadio;

      comp.onLfEvent(e, "pointerdown", undefined, node);
    },
    //#endregion
  };
};
//#endregion
