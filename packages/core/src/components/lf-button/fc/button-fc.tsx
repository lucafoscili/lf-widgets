import {
  CY_ATTRIBUTES,
  LF_BUTTON_BLOCKS,
  LF_BUTTON_PARTS,
  LfButtonFCProps,
  LfIconType,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

/**
 * ButtonFC - Functional Component for Button
 *
 * Per Section 5.9 "Mirroring Rule" - encapsulates button UI.
 *
 * This is a stateless functional component that renders a button.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-button Web Component (thin wrapper via elements.button.tsx)
 * 2. Inside other components like shapeeditor (composed usage)
 * 3. Via LfShape rendering (if button becomes a data shape)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * State/Size Props:
 * - `uiState`: Controls color scheme via `data-lf` attribute
 * - `uiSize`: Controls sizing via CSS variable `--lf-fc-ui-size`
 * These are required for composed usage where CSS cascade doesn't work
 * (e.g., portaled content outside the DOM hierarchy).
 *
 * @see Section 5.9 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const ButtonFC: FunctionalComponent<LfButtonFCProps> = ({
  className,
  disabled = false,
  framework,
  icon,
  id,
  label = "",
  onBlur,
  onClick,
  onFocus,
  onPointerDown,
  buttonRef,
  rippleRef,
  showSpinner = false,
  style,
  styling = "raised",
  trailingIcon = false,
  type = "button",
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_BUTTON_BLOCKS;
  const parts = LF_BUTTON_PARTS;

  const { button } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Determine modifier flags
  const hasLabel = label && label.trim() !== "";
  const isIconStyling = styling === "icon";

  // Build accessible label
  const accessibleLabel = (label || icon || id || "button").trim();

  // Icon element (if icon is provided)
  const iconElement = icon ? (
    <div class={bemClass(button._, button.icon)} part={parts.icon}>
      <FIcon framework={framework} icon={icon as LfIconType} />
    </div>
  ) : null;

  // Label element (if not icon styling)
  const labelElement = !isIconStyling ? (
    <span
      class={bemClass(button._, button.label, {
        hidden: showSpinner && !disabled,
      })}
      part={parts.label}
    >
      {label}
    </span>
  ) : null;

  // Spinner element (if showSpinner is true)
  const spinnerElement = showSpinner ? (
    <lf-spinner
      class={bemClass(button._, button.spinner)}
      lfActive={showSpinner}
      lfUiSize="xxsmall"
      lfLayout="ring"
      part={parts.spinner}
    ></lf-spinner>
  ) : null;

  // Ripple container (for external ripple effect)
  const rippleElement = (
    <div
      class={bemClass(button._, "ripple")}
      ref={rippleRef}
      aria-hidden="true"
    />
  );

  return (
    <button
      aria-label={accessibleLabel}
      class={`${bemClass(button._, null, {
        [styling]: true,
        disabled,
        "has-spinner": showSpinner,
        "no-label": !hasLabel,
      })}${className ? ` ${className}` : ""}`}
      data-cy={CY_ATTRIBUTES.button}
      data-lf={uiState}
      disabled={disabled}
      id={id}
      onBlur={(e) => onBlur?.(e)}
      onClick={(e) => onClick?.(e)}
      onFocus={(e) => onFocus?.(e)}
      onPointerDown={(e) => onPointerDown?.(e)}
      part={parts.button}
      ref={buttonRef}
      style={computedStyle}
      type={type}
    >
      {trailingIcon ? [labelElement, iconElement] : [iconElement, labelElement]}
      {spinnerElement}
      {rippleElement}
    </button>
  );
};
