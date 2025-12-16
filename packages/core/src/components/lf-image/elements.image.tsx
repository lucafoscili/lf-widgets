import { LfImageAdapter, LfImageAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfImageFC } from "./lf-image-fc";

/**
 * Prepares JSX factory functions for the image component.
 *
 * "Adapter as Core" Architecture - THIN WRAPPER PATTERN:
 * - The FC (LfImageFC) contains ALL rendering logic
 * - This elements file is a THIN WRAPPER that maps adapter → FC props
 * - NO duplicate JSX logic - FC is the single source of truth
 * - State is read from adapter's closure via controller.get.*
 *
 * Benefits:
 * - Single source of truth for rendering (the FC)
 * - elements.*.tsx becomes a simple adapter → props mapper
 * - FC can be used standalone in compositions (shapeeditor, etc.)
 * - WC uses same FC via this thin wrapper
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 * @see WC_FC_MIGRATION_GUIDE.md Section 2 (The Mirroring Rule)
 */
export const prepImageJsx = (
  getAdapter: () => LfImageAdapter,
): LfImageAdapterJsx => {
  return {
    //#region Image
    image: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { compInstance, error, framework, isLoaded, resolvedSpriteName } =
        controller.get;

      const comp = compInstance();
      const mgr = framework();
      const { refs } = elements;

      const { lfHtmlAttributes, lfSizeX, lfSizeY, lfUiState, lfValue } = comp;

      // Map adapter state → FC props (thin wrapper pattern)
      // State is read from adapter's closure via getters
      return (
        <LfImageFC
          error={error()}
          framework={mgr}
          htmlAttributes={lfHtmlAttributes}
          icon={resolvedSpriteName()}
          isLoaded={isLoaded()}
          onClick={handlers.click}
          onContextMenu={handlers.contextmenu}
          onError={handlers.error}
          onLoad={handlers.load}
          imageRef={(el) => {
            if (el) {
              mgr.assignRef(refs, "img")(el);
              controller.set.imageRef(el);
            }
          }}
          sizeX={lfSizeX}
          sizeY={lfSizeY}
          uiState={lfUiState}
          value={lfValue}
        />
      );
    },
    //#endregion
  };
};
