import {
  CY_ATTRIBUTES,
  LfPhotoframeAdapter,
  LfPhotoframeAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares JSX factory functions for the photoframe component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isInViewport, shouldReplace, etc.)
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepPhotoframeJsx = (
  getAdapter: () => LfPhotoframeAdapter,
): LfPhotoframeAdapterJsx => {
  return {
    //#region Overlay
    overlay: (): VNode | null => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const { refs } = elements;

      const { lfOverlay } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      if (!lfOverlay || typeof lfOverlay !== "object") {
        return null;
      }

      const { overlay } = b;
      const { description, hideOnClick, icon, title } = lfOverlay;

      return (
        <div
          class={bemClass(overlay._, null, {
            "has-actions": hideOnClick,
          })}
          onClick={hideOnClick ? handlers.overlay.click : undefined}
          part={p.overlay}
          ref={assignRef(refs, "overlay")}
        >
          <div class={bemClass(overlay._, overlay.content)}>
            {icon && (
              <lf-image
                class={bemClass(overlay._, overlay.icon)}
                lfSizeX="3em"
                lfSizeY="3em"
                lfValue={icon}
                part={p.icon}
              ></lf-image>
            )}
            {title && (
              <div class={bemClass(overlay._, overlay.title)} part={p.title}>
                {title}
              </div>
            )}
            {description && (
              <div
                class={bemClass(overlay._, overlay.description)}
                part={p.description}
              >
                {description}
              </div>
            )}
          </div>
        </div>
      );
    },
    //#endregion

    //#region Photoframe
    photoframe: (): VNode => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;
      const { isInViewport, shouldReplace } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const { refs } = elements;

      const { imageOrientation, lfPlaceholder, lfValue } = comp;
      const { assignRef, sanitizeProps, theme } = mgr;
      const { bemClass } = theme;

      const { photoframe } = b;
      const cy = CY_ATTRIBUTES;

      const replace = shouldReplace();

      return (
        <div class={bemClass(photoframe._)}>
          <img
            class={bemClass(photoframe._, photoframe.placeholder, {
              loaded: Boolean(imageOrientation),
              hidden: replace,
            })}
            data-cy={cy.image}
            onLoad={handlers.load.placeholder}
            part={p.placeholder}
            ref={assignRef(refs, "placeholder")}
            {...sanitizeProps(lfPlaceholder)}
          ></img>
          {isInViewport() && (
            <img
              class={bemClass(photoframe._, photoframe.image, {
                active: replace,
              })}
              data-cy={cy.image}
              onLoad={handlers.load.image}
              part={p.image}
              ref={assignRef(refs, "image")}
              {...sanitizeProps(lfValue)}
            ></img>
          )}
        </div>
      );
    },
    //#endregion
  };
};
