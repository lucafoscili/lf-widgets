import {
  LF_BADGE_CSS_VARS,
  LfBadgeAdapter,
  LfBadgeAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfBadge } from "./lf-badge";

export const prepBadgeJsx = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterJsx => {
  return {
    //#region Badge
    badge: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { get } = controller;

      // v4.0.0: ALL getters are functions
      const blocks = get.blocks();
      const compInstance = get.compInstance();
      const lfAttributes = get.lfAttributes();
      const framework = get.framework();
      const parts = get.parts();

      const { lfImageProps, lfLabel, lfPosition } = compInstance;
      const { assignRef, sanitizeProps, theme } = framework;
      const { bemClass } = theme;
      const { refs } = elements;

      const comp = compInstance as LfBadge;

      return (
        <div
          class={bemClass(blocks.badge._, undefined, { [lfPosition]: true })}
          data-lf={lfAttributes.fadeIn}
          onClick={(e) => comp.onLfEvent(e, "click")}
          part={parts.badge}
          ref={assignRef(refs, "badge")}
        >
          {lfLabel ? (
            <span
              class={bemClass(blocks.badge._, blocks.badge.label)}
              part={parts.label}
            >
              {lfLabel}
            </span>
          ) : lfImageProps ? (
            <lf-image
              class={bemClass(blocks.badge._, blocks.badge.image)}
              part={parts.image}
              {...sanitizeProps(lfImageProps, "LfImage")}
            ></lf-image>
          ) : null}
        </div>
      );
    },
    //#endregion
  };
};

//#region Helpers
export const computeBadgeStyles = (
  lfPosition: string,
  lfStyle: string,
  setLfStyle: (comp: LfBadge) => string,
  comp: LfBadge,
): string => {
  const styles: Record<string, string> = {};
  const { transform } = LF_BADGE_CSS_VARS;
  const isInline = lfPosition === "inline";

  if (!isInline) {
    const [ver, hor] = lfPosition.split("-");
    const y = ver === "bottom" ? "bottom" : "top";
    const x = hor === "right" ? "right" : "left";
    const translateX = hor === "right" ? "50%" : "-50%";
    const translateY = ver === "bottom" ? "50%" : "-50%";

    styles[y] = "0";
    styles[x] = "0";
    styles[transform] = `translate(${translateX}, ${translateY})`;
  } else {
    styles[transform] = "none";
  }

  const hostStyles = Object.entries(styles)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join("; ");

  const customStyles = (lfStyle && setLfStyle(comp)) || "";

  return `:host { ${hostStyles} }\n${customStyles}`;
};
//#endregion
