import { LfPhotoframeAdapter } from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface PhotoframeFCProps {
  adapter: LfPhotoframeAdapter;
}
//#endregion

/**
 * FC for the photoframe component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates photoframe UI.
 * Renders the overlay and photoframe elements.
 */
export const PhotoframeFC: FunctionalComponent<PhotoframeFCProps> = ({
  adapter,
}) => {
  const { elements } = adapter;
  const { overlay, photoframe } = elements.jsx;

  return (
    <Fragment>
      {overlay()}
      {photoframe()}
    </Fragment>
  );
};
