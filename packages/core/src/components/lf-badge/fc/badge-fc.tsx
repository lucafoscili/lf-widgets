import { LfBadgeAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfBadgeFC } from "../lf-badge-fc";

//#region Props
export interface BadgeFCProps {
  adapter: LfBadgeAdapter;
}
//#endregion

/**
 * FC for the badge component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfBadgeFC (pure presentational) with adapter state.
 */
export const BadgeFC: FunctionalComponent<BadgeFCProps> = ({ adapter }) => {
  const { controller, dispatcher, elements } = adapter;
  const { get } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const { lfImageProps, lfLabel, lfPosition, lfUiSize, lfUiState } =
    compInstance;

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
};
