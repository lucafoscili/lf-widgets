import { LfBreadcrumbsAdapter, LfDataNode } from "@lf-widgets/foundations";

export const prepBreadcrumbsHandlers = (
  getAdapter: () => LfBreadcrumbsAdapter,
) => {
  return {
    item: {
      //#region Click
      click: async (e: MouseEvent, node: LfDataNode, index: number) => {
        const { controller } = getAdapter();
        const { compInstance, isInteractive } = controller.get;
        if (!isInteractive()) {
          return;
        }

        await controller.set.currentNode(node.id);

        compInstance.onLfEvent(e, "click", { node, index });
      },
      //#endregion

      //#region Keydown
      keydown: async (e: KeyboardEvent, node: LfDataNode, index: number) => {
        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const { controller } = getAdapter();
        const { compInstance, isInteractive } = controller.get;
        if (!isInteractive()) {
          return;
        }

        await controller.set.currentNode(node.id);

        compInstance.onLfEvent(e, "click", { node, index });
      },
      //#endregion

      //#region Pointerdown
      pointerdown: (e: PointerEvent, node: LfDataNode, index: number) => {
        const { controller } = getAdapter();
        const { compInstance, isInteractive } = controller.get;
        if (!isInteractive()) {
          return;
        }

        compInstance.onLfEvent(e, "pointerdown", { node, index });
      },
      //#endregion
    },
    truncation: {
      //#region Click
      click: async (e: MouseEvent) => {
        const { controller } = getAdapter();
        const { compInstance, expanded, isInteractive } = controller.get;
        if (!isInteractive()) {
          return;
        }

        await controller.set.expanded(!expanded());

        compInstance.onLfEvent(e, "expand");
      },
      //#endregion

      //#region Keydown
      keydown: async (e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const { controller } = getAdapter();
        const { compInstance, expanded, isInteractive } = controller.get;
        if (!isInteractive()) {
          return;
        }

        await controller.set.expanded(!expanded());

        compInstance.onLfEvent(e, "expand");
      },
      //#endregion
    },
  };
};
