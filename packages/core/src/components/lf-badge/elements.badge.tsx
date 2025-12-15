import {
  LF_BADGE_CSS_VARS,
  LfBadgeAdapter,
  LfBadgeAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfBadge } from "./lf-badge";
import { LfBadgeFC } from "./lf-badge-fc";

export const prepBadgeJsx = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterJsx => {
  return {
    //#region Badge
    badge: () => {
      const adapter = getAdapter();
      const { controller, dispatcher, elements } = adapter;
      const { get } = controller;

      // v4.0.0: ALL getters are functions
      const compInstance = get.compInstance();
      const framework = get.framework();

      const { lfImageProps, lfLabel, lfPosition, lfUiSize, lfUiState } =
        compInstance;
      const { assignRef } = framework;
      const { refs } = elements;

      return (
        <LfBadgeFC
          badgeRef={assignRef(refs, "badge")}
          framework={framework}
          imageProps={lfImageProps}
          label={lfLabel}
          onClick={(e) => dispatcher.emit("click", { originalEvent: e })}
          position={lfPosition}
          uiSize={lfUiSize}
          uiState={lfUiState}
        />
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
