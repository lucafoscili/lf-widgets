import { LfAccordionAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfAccordionFC } from "../lf-accordion-fc";

//#region Props
export interface AccordionFCProps {
  adapter: LfAccordionAdapter;
}
//#endregion

/**
 * FC for the accordion component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfAccordionFC (pure presentational) with adapter state.
 */
export const AccordionFC: FunctionalComponent<AccordionFCProps> = ({
  adapter,
}) => {
  const { controller, dispatcher, elements } = adapter;
  const { get, actions } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const { lfDataset, lfUiSize, lfUiState, expandedNodeIds, selectedNodeIds } =
    compInstance;

  const items = lfDataset?.nodes ?? [];

  return (
    <LfAccordionFC
      accordionRef={assignRef(refs, "accordion")}
      expandedIds={expandedNodeIds}
      framework={framework}
      items={items}
      onLfEvent={(e) => dispatcher.emit("lf-event", { originalEvent: e })}
      onPointerDown={(e) =>
        dispatcher.emit("pointerdown", { originalEvent: e })
      }
      onToggle={(node, e) => actions.toggle(node, e)}
      refs={refs}
      selectedIds={selectedNodeIds}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
