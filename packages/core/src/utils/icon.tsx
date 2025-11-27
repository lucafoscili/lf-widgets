import { CY_ATTRIBUTES, FIconPropsInterface } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * CSS variable prefix used for icon references.
 */
const CSS_VAR_PREFIX = "--lf-icon-";

/**
 * Resolves an icon name from either a CSS variable reference or a direct sprite name.
 *
 * The icon parameter can be:
 * - A CSS variable from LF_THEME_ICONS (e.g., "--lf-icon-clear") - resolved via theme variables
 * - A direct sprite name from LF_ICONS_REGISTRY (e.g., "account") - used as-is
 *
 * @param icon - The icon identifier (CSS variable or sprite name)
 * @param variables - Theme variables containing icon mappings
 * @returns The resolved icon name for the sprite
 */
const resolveIconName = (
  icon: string,
  variables: Record<string, string | number>,
): string => {
  // If it's a CSS variable reference, resolve it via theme variables
  if (icon.startsWith(CSS_VAR_PREFIX)) {
    const resolved = variables[icon];
    return typeof resolved === "string"
      ? resolved
      : icon.replace(CSS_VAR_PREFIX, "");
  }
  // Direct sprite icon name (from LF_ICONS_REGISTRY)
  return icon;
};

/**
 * Functional component for rendering sprite-based SVG icons.
 *
 * This component renders icons using the SVG sprite system, which provides:
 * - Single HTTP request for all icons (sprite is cached)
 * - Consistent coloring via `currentColor` (inherits from CSS `color` property)
 * - Better performance than mask-based icons
 * - Full SVG animation capabilities
 *
 * The component renders a `<div>` wrapper with an inline `<svg>` that references
 * the sprite. Use the `wrapperClass` prop to apply styles via the `f-icon` SCSS mixin.
 *
 * Icon sources:
 * - Theme icons via `LF_THEME_ICONS.xxx` (e.g., `LF_THEME_ICONS.clear` → "--lf-icon-clear")
 * - Sprite icons via `LF_ICONS_REGISTRY.xxx` (e.g., `LF_ICONS_REGISTRY.account` → "account")
 *
 * @example
 * ```tsx
 * // Theme icon (resolved via CSS variables)
 * <FIcon framework={framework} icon={LF_THEME_ICONS.clear} />
 *
 * // With wrapper class for styling (recommended)
 * <FIcon framework={framework} icon={LF_THEME_ICONS.warning} wrapperClass={bemClass(blocks.icon)} />
 *
 * // Direct sprite icon
 * <FIcon framework={framework} icon={LF_ICONS_REGISTRY.account} />
 *
 * // With click handler
 * <FIcon framework={framework} icon={LF_THEME_ICONS.delete} onClick={(e) => handleClose(e)} />
 * ```
 *
 * @param props - The icon properties
 * @param props.framework - Runtime framework instance for theme access
 * @param props.icon - Icon from LF_THEME_ICONS or LF_ICONS_REGISTRY
 * @param props.wrapperClass - Optional CSS class for wrapper div (use with f-icon mixin)
 * @param props.iconClass - Optional CSS class for SVG element
 * @param props.onClick - Optional click handler
 * @param props.style - Optional inline styles (prefer SCSS when possible)
 *
 * @returns Wrapped SVG element with sprite reference
 */
export const FIcon: FunctionalComponent<FIconPropsInterface> = ({
  framework,
  icon,
  wrapperClass,
  iconClass,
  onClick,
  style,
}) => {
  const { theme } = framework;
  const { variables } = theme.get.current();

  // Resolve the icon name from CSS variable or direct name
  const resolvedIcon = resolveIconName(icon, variables);

  // Get the sprite path
  const spritePath = theme.get.sprite.path();
  const href = `${spritePath}#${resolvedIcon}`;

  // Build wrapper class - always include f-icon base class
  const wrapperClasses = wrapperClass ? `f-icon ${wrapperClass}` : "f-icon";

  // Convert style values to strings if provided
  const wrapperStyle = style
    ? Object.fromEntries(Object.entries(style).map(([k, v]) => [k, String(v)]))
    : undefined;

  return (
    <div
      class={wrapperClasses}
      data-cy={CY_ATTRIBUTES.fIcon}
      onClick={onClick}
      style={wrapperStyle}
    >
      <svg aria-hidden="true" class={iconClass} viewBox="0 0 24 24">
        <use href={href}></use>
      </svg>
    </div>
  );
};
