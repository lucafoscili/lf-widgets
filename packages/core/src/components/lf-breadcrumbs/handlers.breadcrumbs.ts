import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterHandlers,
  LfDataNode,
} from "@lf-widgets/foundations";

/**
 * Prepares handler functions for the breadcrumbs component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.computed` for derived predicates (isInteractive)
 * - Uses `controller.set` for simple state assignments
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepBreadcrumbsHandlers = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterHandlers => {
  return {
    item: {
      //#region Click
      click: async (e: MouseEvent, node: LfDataNode, index: number) => {
        const { controller, dispatcher } = getAdapter();
        const { isInteractive } = controller.computed;
        if (!isInteractive()) {
          return;
        }

        await controller.set.currentNode(node.id);

        dispatcher.emit("click", { originalEvent: e, node, index });
      },
      //#endregion

      //#region Keydown
      keydown: async (e: KeyboardEvent, node: LfDataNode, index: number) => {
        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const { controller, dispatcher } = getAdapter();
        const { isInteractive } = controller.computed;
        if (!isInteractive()) {
          return;
        }

        await controller.set.currentNode(node.id);

        dispatcher.emit("click", {
          originalEvent: e as unknown as MouseEvent,
          node,
          index,
        });
      },
      //#endregion

      //#region Pointerdown
      pointerdown: (e: PointerEvent, node: LfDataNode, index: number) => {
        const { controller, dispatcher } = getAdapter();
        const { isInteractive } = controller.computed;
        if (!isInteractive()) {
          return;
        }

        dispatcher.emit("pointerdown", { originalEvent: e, node, index });
      },
      //#endregion
    },
    truncation: {
      //#region Click
      click: async (e: MouseEvent) => {
        const { controller, dispatcher } = getAdapter();
        const { isInteractive, isExpanded } = controller.computed;
        if (!isInteractive()) {
          return;
        }

        await controller.set.expanded(!isExpanded());

        dispatcher.emit("expand", { originalEvent: e });
      },
      //#endregion

      //#region Keydown
      keydown: async (e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const { controller, dispatcher } = getAdapter();
        const { isInteractive, isExpanded } = controller.computed;
        if (!isInteractive()) {
          return;
        }

        await controller.set.expanded(!isExpanded());

        dispatcher.emit("expand", {
          originalEvent: e as unknown as MouseEvent,
        });
      },
      //#endregion
    },
  };
};
