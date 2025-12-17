import { LfCardAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfCardFC } from "../lf-card-fc";

//#region Props
export interface CardFCProps {
  adapter: LfCardAdapter;
}
//#endregion

/**
 * FC for the card component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfCardFC (pure presentational) with adapter state.
 *
 * The card component supports multiple layouts (material, debug, keywords, upload, weather).
 * This wrapper extracts layout selection and delegates to the pure presentational FC.
 */
export const CardFC: FunctionalComponent<CardFCProps> = ({ adapter }) => {
  const { controller, dispatcher, elements, handlers } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const shapes = get.shapes();
  const defaults = get.defaults();
  const blocks = get.blocks();
  const parts = get.parts();
  const { lfAttributes } = get;

  const { lfLayout, lfUiState } = compInstance;

  // Get shouldRender from computed
  const { shouldRender } = computed;
  if (!shouldRender()) {
    return null;
  }

  return (
    <LfCardFC
      blocks={blocks}
      defaults={defaults}
      dispatcher={dispatcher}
      elements={elements}
      framework={framework}
      handlers={handlers}
      layout={lfLayout}
      lfAttributes={lfAttributes}
      onClick={(e: MouseEvent) =>
        dispatcher.emit("click", { originalEvent: e })
      }
      onContextMenu={(e: MouseEvent) =>
        dispatcher.emit("contextmenu", { originalEvent: e })
      }
      onPointerDown={(e: PointerEvent) =>
        dispatcher.emit("pointerdown", { originalEvent: e })
      }
      parts={parts}
      shapes={shapes}
      uiState={lfUiState}
    />
  );
};
