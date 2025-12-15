import {
  CY_ATTRIBUTES,
  LF_SLIDER_BLOCKS,
  LF_SLIDER_PARTS,
  LfSliderFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfSliderFC - Functional Component for Slider
 *
 * This is a stateless functional component that renders a slider.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-slider Web Component (thin wrapper)
 * 2. Inside other components like shapeeditor (composed usage)
 * 3. Via LfShape rendering (if slider becomes a data shape)
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
export const LfSliderFC: FunctionalComponent<LfSliderFCProps> = ({
  className,
  disabled = false,
  framework,
  id,
  inputRef,
  label = "",
  leadingLabel = false,
  max = 100,
  min = 0,
  onBlur,
  onChange,
  onFocus,
  onInput,
  onPointerDown,
  step = 1,
  style,
  thumbRef,
  trackRef,
  uiSize = "medium",
  uiState = "primary",
  value,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_SLIDER_BLOCKS;
  const parts = LF_SLIDER_PARTS;

  const { formField, slider } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  return (
    <div
      class={`${bemClass(formField._, null, { leading: leadingLabel })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.formField}
      style={computedStyle}
    >
      <div
        class={bemClass(slider._, null, {
          "has-value": value.display > min,
          disabled,
        })}
        part={parts.slider}
      >
        <input
          type="range"
          class={bemClass(slider._, slider.nativeControl)}
          data-cy={CY_ATTRIBUTES.input}
          disabled={disabled}
          max={max}
          min={min}
          onBlur={(e) => onBlur?.(e)}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            onChange?.(parseFloat(target.value), e);
          }}
          onFocus={(e) => onFocus?.(e)}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            onInput?.(parseFloat(target.value), e);
          }}
          onPointerDown={(e) => onPointerDown?.(e)}
          part={parts.nativeControl}
          ref={inputRef}
          step={step}
          value={value.real}
        />
        <div class={bemClass(slider._, slider.track)} ref={trackRef}>
          <div class={bemClass(slider._, slider.thumbUnderlay)}>
            <div
              class={bemClass(slider._, slider.thumb)}
              part={parts.thumb}
              ref={thumbRef}
            ></div>
          </div>
        </div>
        <span class={bemClass(slider._, slider.value)} part={parts.value}>
          {value.display}
        </span>
      </div>
      <label class={bemClass(formField._, formField.label)} part={parts.label}>
        {label}
      </label>
    </div>
  );
};
