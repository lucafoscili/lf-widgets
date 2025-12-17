import {
  CY_ATTRIBUTES,
  LF_CHECKBOX_BLOCKS,
  LF_CHECKBOX_PARTS,
  LfCheckboxFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfCheckboxFC - Functional Component for Checkbox
 *
 * This is a stateless functional component that renders a checkbox.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-checkbox Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via LfShape rendering (if checkbox becomes a data shape)
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
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfCheckboxFC: FunctionalComponent<LfCheckboxFCProps> = ({
  ariaLabel,
  checked = false,
  className,
  disabled = false,
  framework,
  id,
  indeterminate = false,
  inputRef,
  label = "",
  labelRef,
  leadingLabel = false,
  onBlur,
  onChange,
  onFocus,
  onLabelClick,
  onPointerDown,
  part,
  style,
  surfaceRef,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_CHECKBOX_BLOCKS;
  const parts = LF_CHECKBOX_PARTS;

  const { checkbox, formField } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Compute accessible label with fallback chain
  const accessibleLabel = (ariaLabel || label || id || "checkbox").trim();

  return (
    <div
      class={`${bemClass(formField._, null, { leading: leadingLabel })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={part}
      style={computedStyle}
    >
      <div
        class={bemClass(checkbox._)}
        onClick={(e) => {
          if (!disabled) {
            // Toggle: indeterminate/off -> on, on -> off
            const newChecked = indeterminate || !checked;
            onChange?.(newChecked, false, e);
          }
        }}
        onPointerDown={(e) => onPointerDown?.(e)}
        ref={surfaceRef}
      >
        <div
          class={bemClass(checkbox._, checkbox.surface, {
            checked,
            indeterminate,
            disabled,
          })}
          part={parts.checkbox}
        >
          <input
            aria-label={accessibleLabel}
            aria-checked={indeterminate ? "mixed" : checked}
            class={bemClass(checkbox._, checkbox.nativeControl)}
            checked={checked}
            data-cy={CY_ATTRIBUTES.input}
            disabled={disabled}
            indeterminate={indeterminate}
            onBlur={(e) => onBlur?.(e)}
            onFocus={(e) => onFocus?.(e)}
            part={parts.nativeControl}
            ref={inputRef}
            type="checkbox"
            value={indeterminate ? "indeterminate" : checked ? "on" : "off"}
          />
          <div
            class={bemClass(checkbox._, checkbox.background)}
            part={parts.background}
          >
            <svg
              class={bemClass(checkbox._, checkbox.checkmark)}
              viewBox="0 0 24 24"
              part={parts.checkmark}
            >
              <path
                class={bemClass(checkbox._, "checkmark-path")}
                fill="none"
                d="M4.1,12.7 9,17.6 20.3,6.3"
                stroke="currentColor"
              />
            </svg>
            <div
              class={bemClass(checkbox._, checkbox.mixedmark)}
              part={parts.mixedmark}
            />
          </div>
        </div>
      </div>
      {label && (
        <label
          class={bemClass(formField._, formField.label)}
          onClick={(e) => {
            if (!disabled) {
              const newChecked = indeterminate || !checked;
              onLabelClick?.(e);
              onChange?.(newChecked, false, e);
            }
          }}
          part={parts.label}
          ref={labelRef}
        >
          {label}
        </label>
      )}
    </div>
  );
};
