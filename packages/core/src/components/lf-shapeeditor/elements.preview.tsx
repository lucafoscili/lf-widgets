import {
  LfDataCell,
  LfDataShapes,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { prepHistory } from "./elements.history";

/**
 * Prepares the preview panel JSX functions.
 * Contains history sidebar, shape display and spinner overlay.
 */
export const prepPreview = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx["preview"] => {
  return {
    //#region History
    history: prepHistory(getAdapter),
    //#endregion

    //#region Shape
    shape: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, framework, previewValue } =
        controller.get;
      const { history } = controller.computed;
      const { preview } = elements.refs;
      const { shape } = handlers.preview;

      const b = blocks();
      const lf = lfAttributes();
      const mgr = framework();
      const comp = compInstance();

      const { lfShape } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      const previewBlock = b.preview;

      const snapshot = history.currentSnapshot();
      if (!snapshot) {
        return;
      }

      // Use previewValue when set (live preview), otherwise use snapshot value
      const displayValue = previewValue() ?? snapshot.value;

      // Use the original cell from the snapshot (contains full props like lfDataset, lfSeries, etc.)
      // Fall back to a minimal cell with just value for backwards compatibility
      const originalCell = snapshot.shape?.shape;
      const cell = (
        originalCell
          ? {
              ...originalCell,
              shape: lfShape,
              value: displayValue,
              lfValue: displayValue,
            }
          : {
              shape: lfShape,
              value: displayValue,
              lfValue: displayValue,
            }
      ) as LfDataCell<LfDataShapes>;

      return (
        <div
          class={bemClass(previewBlock._, previewBlock.shape)}
          data-lf={lf.fadeIn}
          ref={assignRef(preview, "shape")}
        >
          <LfShape
            cell={cell}
            eventDispatcher={async (e) => shape(e)}
            framework={mgr}
            index={snapshot.shape?.index ?? 0}
            shape={lfShape}
          />
        </div>
      );
    },
    //#endregion

    //#region Spinner
    spinner: () => {
      const { controller, elements } = getAdapter();
      const { blocks, ids, framework, spinnerStatus } = controller.get;
      const { preview } = elements.refs;

      const b = blocks();
      const i = ids();
      const mgr = framework();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      const previewBlock = b.preview;

      return (
        <lf-spinner
          class={bemClass(previewBlock._, previewBlock.spinner)}
          id={i.preview.spinner}
          lfActive={spinnerStatus()}
          lfDimensions="16px"
          lfFader={true}
          lfFaderTimeout={125}
          lfLayout={14}
          ref={assignRef(preview, "spinner")}
        ></lf-spinner>
      );
    },
    //#endregion
  };
};
