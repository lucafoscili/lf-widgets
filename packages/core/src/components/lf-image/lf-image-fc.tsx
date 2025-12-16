import {
  CY_ATTRIBUTES,
  LF_IMAGE_BLOCKS,
  LF_IMAGE_PARTS,
  LfIconType,
  LfImageFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * LfImageFC - Functional Component for Image
 *
 * FULLY SELF-CONTAINED rendering unit. All presentation logic lives here.
 * Computes everything it needs from props (e.g., isResourceUrl from value).
 *
 * Usage patterns:
 * 1. Inside lf-image Web Component (via thin wrapper in elements.image.tsx)
 * 2. Inside composite components like shapeeditor (direct usage)
 * 3. Via LfShape rendering (if image becomes a data shape)
 *
 * Architecture principles:
 * - FC = complete rendering logic, derives what it can from props
 * - WC = lifecycle wrapper (state, events, theme, refs)
 * - elements.*.tsx = thin prop mapper (no logic, just extraction)
 *
 * Benefits:
 * - Composite components use FC directly without duplicating logic
 * - No Shadow DOM overhead per instance in compositions
 * - Direct callbacks instead of CustomEvent dispatch
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfImageFC: FunctionalComponent<LfImageFCProps> = ({
  className,
  error = false,
  framework,
  htmlAttributes,
  icon,
  id,
  imageRef,
  isLoaded = false,
  onClick,
  onContextMenu,
  onError,
  onLoad,
  sizeX = "100%",
  sizeY = "100%",
  style,
  uiSize = "medium",
  uiState = "primary",
  value = "",
}) => {
  const { bemClass } = framework.theme;
  const { sanitizeProps } = framework;

  const blocks = LF_IMAGE_BLOCKS;
  const parts = LF_IMAGE_PARTS;

  const { image } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle: { [key: string]: string } = {
    ...style,
    "--lf_image_width": sizeX,
    "--lf_image_height": sizeY,
  };
  if (uiSize !== "medium") {
    computedStyle["--lf-fc-ui-size"] = `var(--lf-ui-size-${uiSize})`;
  }

  // Determine if value is a resource URL (FC computes this internally)
  const isResourceUrl =
    value.startsWith("http") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("/") ||
    value.startsWith("./");

  // Render image element for URL-based sources
  const renderImg = () => (
    <img
      {...sanitizeProps(htmlAttributes ?? {})}
      class={bemClass(image._, image.img)}
      data-cy={CY_ATTRIBUTES.image}
      onError={(e) => onError?.(e)}
      onLoad={(e) => onLoad?.(e)}
      part={parts.img}
      ref={imageRef}
      src={value}
    />
  );

  // Render icon element for sprite-based sources
  const renderIcon = () => {
    // For error state, use an error icon; otherwise use icon or value
    const iconToShow = error ? "circle-x" : icon || value;

    return (
      <div class={bemClass(image._, image.icon)}>
        <FIcon
          framework={framework}
          icon={iconToShow as LfIconType}
          style={{
            width: "100%",
            height: "100%",
          }}
          uiState={error ? "danger" : uiState}
        />
      </div>
    );
  };

  return (
    <div
      class={`${bemClass(image._, null)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      onClick={(e) => onClick?.(e)}
      onContextMenu={(e) => onContextMenu?.(e)}
      part={parts.image}
      style={computedStyle}
    >
      {(() => {
        // Error state - show broken image icon
        if (error) {
          return renderIcon();
        }
        // URL-based image (http, data:, blob:, or path)
        if (isResourceUrl) {
          return renderImg();
        }
        // Sprite icon (non-URL value)
        if (isLoaded && value) {
          return renderIcon();
        }
        return null;
      })()}
    </div>
  );
};
