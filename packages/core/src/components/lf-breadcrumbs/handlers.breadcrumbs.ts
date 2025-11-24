import { LfBreadcrumbsAdapter, LfDataNode } from "@lf-widgets/foundations";

//FIXME: this should be an adapter method => move it there
const isInteractive = (compInstance: { lfInteractive?: boolean | string }) => {
  return (
    compInstance.lfInteractive !== false &&
    compInstance.lfInteractive !== "false"
  );
};

export const prepBreadcrumbsHandlers = (
  getAdapter: () => LfBreadcrumbsAdapter,
) => {
  return {
    item: {
      //#region Click
      click: (e: MouseEvent, node: LfDataNode, index: number) => {
        const { compInstance } = getAdapter().controller.get;
        if (!isInteractive(compInstance)) {
          return;
        }

        compInstance.onLfEvent(e, "click", { node, index });
      },
      //#endregion

      //#region Keydown
      keydown: (e: KeyboardEvent, node: LfDataNode, index: number) => {
        if (e.key !== "Enter" && e.key !== " ") {
          return;
        }
        const { compInstance } = getAdapter().controller.get;

        e.preventDefault();
        e.stopPropagation();
        if (!isInteractive(compInstance)) {
          return;
        }

        compInstance.onLfEvent(e, "click", { node, index });
      },
      //#endregion
    },
  };
};
