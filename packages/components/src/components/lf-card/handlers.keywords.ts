import { LfCardAdapter, LfCardAdapterHandlers } from "@lf-widgets/foundations";

export const prepKeywordsHandlers = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterHandlers["layouts"]["keywords"] => {
  return {
    //#region Button
    button: async (e) => {
      const { comp, eventType } = e.detail;

      const { chip } = getAdapter().elements.refs.layouts.keywords;

      if (!chip) {
        return;
      }

      switch (eventType) {
        case "pointerdown":
          comp.setMessage();
          const selectedChips: string[] = [];
          (await chip.getSelectedNodes()).forEach((n) => {
            selectedChips.push(n.id);
          });
          navigator.clipboard.writeText(selectedChips.join(", "));
          break;
      }
    },
    //#endregion
  };
};
