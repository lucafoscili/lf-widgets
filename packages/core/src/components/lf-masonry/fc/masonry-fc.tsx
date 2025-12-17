import { LfMasonryAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfMasonryFC } from "../lf-masonry-fc";

//#region Props
export interface MasonryFCProps {
  adapter: LfMasonryAdapter;
}
//#endregion

/**
 * FC for the masonry component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfMasonryFC (pure presentational) with adapter state.
 */
export const MasonryFC: FunctionalComponent<MasonryFCProps> = ({ adapter }) => {
  const { controller, dispatcher, elements } = adapter;
  const { get } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const { lfActions, lfSelectable, lfShape, lfView } = compInstance;

  const shapes = get.shapes();
  const selectedShape = get.selectedShape();
  const currentColumns = get.currentColumns();

  return (
    <LfMasonryFC
      actions={lfActions}
      adapter={adapter}
      columns={currentColumns}
      framework={framework}
      masonryRef={assignRef(refs, "masonry")}
      onItemClick={(
        e: MouseEvent | PointerEvent,
        index: number,
        _refKey: string,
      ) => {
        if (lfSelectable) {
          const currentSelected = selectedShape?.index;
          if (currentSelected !== index) {
            controller.set.selectedIndex(index);
          } else {
            controller.set.selectedIndex(undefined);
          }
        }
        dispatcher.emit("click", {
          originalEvent: e,
          selectedShape: get.selectedShape(),
        });
      }}
      onShapeEvent={(e: CustomEvent, _refKey: string) => {
        dispatcher.emit("lf-event", {
          originalEvent: e,
          selectedShape: get.selectedShape(),
        });
      }}
      selectable={lfSelectable}
      selectedShape={selectedShape}
      shape={lfShape}
      shapes={shapes}
      view={lfView}
    />
  );
};
