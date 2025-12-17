import {
  LF_ATTRIBUTES,
  LF_PROGRESSBAR_BLOCKS,
  LF_PROGRESSBAR_PARTS,
  LfIconType,
  LfProgressbarAdapter,
  LfProgressbarFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Adapter-based FC (LEGACY)
export interface ProgressbarFCProps {
  adapter: LfProgressbarAdapter;
}

/**
 * FC for the progressbar component (adapter-based).
 * Per Section 5.9 "Mirroring Rule" - mirrors elements.progressbar rendering.
 *
 * This FC receives the adapter and delegates to the JSX factory functions
 * defined in elements.progressbar.tsx to render the progressbar UI.
 * The JSX factory handles the actual structure (linear vs radial).
 *
 * @deprecated Use LfProgressbarFC for new implementations
 */
export const ProgressbarFC: FunctionalComponent<ProgressbarFCProps> = ({
  adapter,
}) => {
  const { elements } = adapter;
  const { progressbar } = elements.jsx;

  return progressbar();
};
//#endregion

//#region Props-based FC (NEW)
/**
 * LfProgressbarFC - Functional Component for Progressbar
 *
 * This is a stateless functional component that renders a progress bar.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-progressbar Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfProgressbarFC: FunctionalComponent<LfProgressbarFCProps> = ({
  animated = false,
  centeredLabel = false,
  className,
  framework,
  icon = "",
  id,
  isRadial = false,
  label = "",
  style,
  uiSize = "medium",
  uiState = "primary",
  value = 0,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_PROGRESSBAR_BLOCKS;
  const parts = LF_PROGRESSBAR_PARTS;
  const lf = LF_ATTRIBUTES;

  const { pie, progressbar } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Render icon element
  const renderIcon = (): VNode => (
    <div class={bemClass(progressbar._, progressbar.icon)} part={parts.icon}>
      <FIcon framework={framework} icon={icon as LfIconType} />
    </div>
  );

  // Render label element
  const renderLabel = (): VNode => {
    const labelContent: VNode[] = label
      ? [
          <div
            class={bemClass(progressbar._, progressbar.text)}
            part={parts.text}
          >
            {label}
          </div>,
        ]
      : [
          <div
            class={bemClass(progressbar._, progressbar.text)}
            part={parts.text}
          >
            {value}
          </div>,
          <div class={bemClass(progressbar._, progressbar.mu)} part={parts.mu}>
            %
          </div>,
        ];

    return (
      <div class={bemClass(progressbar._, progressbar.label)}>
        {icon && renderIcon()}
        {labelContent}
      </div>
    );
  };

  // Render linear progress bar
  const renderLinearBar = (): VNode => (
    <div
      class={`${bemClass(progressbar._, null, { animated })}${className ? ` ${className}` : ""}`}
      data-lf={lf[uiState]}
      id={id}
      part={parts.progressbar}
      style={computedStyle}
    >
      <div
        class={bemClass(progressbar._, progressbar.percentage)}
        part={parts.percentage}
      >
        {!centeredLabel && renderLabel()}
      </div>
      {centeredLabel && renderLabel()}
    </div>
  );

  // Render radial progress bar
  const renderRadialBar = (): VNode => (
    <div
      class={`${bemClass(progressbar._)}${className ? ` ${className}` : ""}`}
      data-lf={lf[uiState]}
      id={id}
      part={parts.progressbar}
      style={computedStyle}
    >
      {renderLabel()}
      <div
        class={bemClass(pie._, null, {
          empty: value <= 50,
          full: value > 50,
          "has-value": Boolean(value),
        })}
      >
        <div
          class={bemClass(pie._, pie.halfCircle, {
            left: true,
          })}
        ></div>
        <div
          class={bemClass(pie._, pie.halfCircle, {
            right: true,
          })}
        ></div>
      </div>
      <div class={bemClass(pie._, pie.track)} part={parts.track}></div>
    </div>
  );

  return isRadial ? renderRadialBar() : renderLinearBar();
};
//#endregion
