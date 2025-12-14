import {
  CSS_VAR_PREFIX,
  LfIconType,
  LfImageAdapter,
  LfImageAdapterJsx,
  LfThemeIconVariable,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the image component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isResourceUrl, resolvedSource)
 * - Uses `controller.actions` for complex operations (resolveSprite)
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepImageJsx = (
  getAdapter: () => LfImageAdapter,
): LfImageAdapterJsx => {
  return {
    //#region Image
    image: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, lfAttributes, parts } =
        controller.get;
      const { isResourceUrl } = controller.computed;
      const { actions } = controller;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const lf = lfAttributes();

      const { error, isLoaded, lfValue } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      const isUrl = isResourceUrl();

      return (
        <div
          class={bemClass(b.image._, null)}
          data-lf={lf.fadeIn}
          onClick={handlers.click}
          onContextMenu={handlers.contextmenu}
          part={p.image}
          ref={assignRef(refs, "image")}
        >
          {(() => {
            // Error state - show broken image icon
            if (error) {
              return prepSpriteIcon(adapter);
            }
            // URL-based image
            if (isUrl) {
              return prepImg(adapter);
            }
            // Sprite icon (non-URL value)
            if (isLoaded) {
              // Trigger sprite resolution
              actions.resolveSprite(lfValue as LfThemeIconVariable);
              return prepSpriteIcon(adapter, lfValue as LfThemeIconVariable);
            }

            return null;
          })()}
        </div>
      );
    },
    //#endregion
  };
};

//#region Helpers
/**
 * Renders the <img> element for URL-based images.
 */
const prepImg = (adapter: LfImageAdapter): VNode => {
  const { controller, elements, handlers } = adapter;
  const { blocks, compInstance, cyAttributes, framework, parts } =
    controller.get;
  const { set } = controller;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();
  const cy = cyAttributes();

  const { lfHtmlAttributes, lfValue } = comp;
  const { assignRef, sanitizeProps, theme } = mgr;
  const { bemClass } = theme;
  const { refs } = elements;

  return (
    <img
      {...sanitizeProps(lfHtmlAttributes)}
      class={bemClass(b.image._, b.image.img)}
      data-cy={cy.image}
      onError={handlers.error}
      onLoad={handlers.load}
      part={p.img}
      ref={(el) => {
        if (el) {
          assignRef(refs, "img")(el);
          set.imageRef(el);
        }
      }}
      src={lfValue}
    ></img>
  );
};

/**
 * Renders the sprite icon for non-URL values.
 */
const prepSpriteIcon = (
  adapter: LfImageAdapter,
  value?: LfThemeIconVariable,
): VNode => {
  const { controller, elements } = adapter;
  const { blocks, compInstance, framework } = controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();

  const { lfUiState, resolvedSpriteName } = comp;
  const { assignRef, theme } = mgr;
  const { bemClass } = theme;
  const { variables } = theme.get.current();
  const { refs } = elements;

  // Resolve the icon name
  const resolved = !value
    ? variables["--lf-icon-broken-image"]
    : value.indexOf(CSS_VAR_PREFIX) > -1
      ? variables[value]
      : value;

  const effectiveName = resolvedSpriteName ?? resolved;

  return (
    <div
      class={bemClass(b.image._, b.image.icon)}
      ref={assignRef(refs, "icon")}
    >
      <FIcon
        framework={mgr}
        icon={effectiveName as LfIconType}
        style={{
          width: "100%",
          height: "100%",
        }}
        uiState={lfUiState}
      />
    </div>
  );
};
//#endregion
