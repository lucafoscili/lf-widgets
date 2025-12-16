import {
  CY_ATTRIBUTES,
  LfIconType,
  LfImageAdapter,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface ImageFCProps {
  adapter: LfImageAdapter;
}
//#endregion

/**
 * FC for the image component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates image rendering.
 */
export const ImageFC: FunctionalComponent<ImageFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const blocks = get.blocks();
  const parts = get.parts();
  const { theme, sanitizeProps, assignRef } = get.framework();
  const { bemClass } = theme;
  const { refs } = elements;

  const comp = get.compInstance();
  const { lfHtmlAttributes, lfUiState, lfValue } = comp;

  const error = get.error();
  const isLoaded = get.isLoaded();
  const icon = get.resolvedSpriteName();
  const isResourceUrl = computed.isResourceUrl();

  const { image } = blocks;

  const renderImg = () => (
    <img
      {...sanitizeProps(lfHtmlAttributes ?? {})}
      class={bemClass(image._, image.img)}
      data-cy={CY_ATTRIBUTES.image}
      onError={handlers.error}
      onLoad={handlers.load}
      part={parts.img}
      ref={(el) => {
        if (el) {
          assignRef(refs, "img")(el);
          controller.set.imageRef(el);
        }
      }}
      src={lfValue}
    />
  );

  const renderIcon = () => {
    const iconToShow = error ? "circle-x" : icon || lfValue;
    return (
      <FIcon
        framework={get.framework()}
        icon={iconToShow as LfIconType}
        wrapperClass={bemClass(image._, image.icon)}
        uiState={error ? "danger" : lfUiState}
      />
    );
  };

  return (
    <div
      class={bemClass(image._, null)}
      data-lf={lfUiState}
      onClick={handlers.click}
      onContextMenu={handlers.contextmenu}
      part={parts.image}
    >
      {error && renderIcon()}
      {!error && isResourceUrl && renderImg()}
      {!error && !isResourceUrl && isLoaded && lfValue && renderIcon()}
    </div>
  );
};
