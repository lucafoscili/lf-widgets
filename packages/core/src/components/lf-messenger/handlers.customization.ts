import {
  CHILD_ROOT_MAP,
  LfMessengerAdapter,
  LfMessengerAdapterHandlers,
  LfMessengerFilters,
} from "@lf-widgets/foundations";
import { createNode } from "./helpers.utils";

export const prepCustomizationHandlers = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterHandlers["customization"] => {
  return {
    //#region Button
    button: async (_e: MouseEvent, type, action, node = null) => {
      const adapter = getAdapter();
      const { get, set } = adapter.controller;
      const { compInstance } = get;

      const comp = compInstance();

      switch (action) {
        case "add":
          set.ui.setFormState(true, type);
          break;
        case "cancel":
          set.ui.setFormState(false, type);
          break;
        case "confirm": {
          const { title } = adapter.elements.refs.customization.form[type];

          const value = title?.value;
          if (value) {
            await createNode(adapter, type);
            set.ui.setFormState(false, type);
          }
          break;
        }
        case "delete":
          comp.deleteOption(node, type);
          break;
        case "edit":
          set.ui.setFormState(true, type, node);
          break;
      }
    },
    //#endregion

    //#region Chip
    chip: async (e) => {
      const { comp, eventType, selectedNodes } = e.detail;

      const { get, set } = getAdapter().controller;
      const { filters } = get.ui();

      switch (eventType) {
        case "click":
          const newFilters: LfMessengerFilters = {
            avatars: false,
            locations: false,
            outfits: false,
            styles: false,
            timeframes: false,
          };
          Array.from(selectedNodes).forEach((n) => {
            const id = n.id as keyof LfMessengerFilters;
            newFilters[id] = true;
          });
          set.ui.filters(newFilters);
          break;
        case "ready":
          const nodes: string[] = [];
          for (const key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key)) {
              const k = key as keyof LfMessengerFilters;
              const option = filters[k];
              if (option) {
                nodes.push(key);
              }
            }
          }
          requestAnimationFrame(() => comp.setSelectedNodes(nodes));
      }
    },
    //#endregion

    //#region Image
    image: async (_e, node, index) => {
      const { image } = getAdapter().controller.set;

      const matchedType = Object.keys(CHILD_ROOT_MAP).find((key) =>
        node.id.includes(key),
      ) as keyof typeof CHILD_ROOT_MAP;

      if (matchedType) {
        image.cover(CHILD_ROOT_MAP[matchedType], index);
      }
    },
  };
  //#endregion
};
