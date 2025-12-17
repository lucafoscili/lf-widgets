import {
  LF_CHART_BLOCKS,
  LF_CHART_PARTS,
  LfChartFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfChartFC - Functional Component for Chart
 *
 * This is a stateless functional component that renders the chart container.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * The chart component wraps ECharts library - the actual chart rendering is
 * handled by ECharts via the container ref. This FC provides:
 * - The styled container div for ECharts to render into
 * - Proper BEM class structure
 * - Part attribute for Shadow DOM styling
 *
 * Usage patterns:
 * 1. Inside lf-chart Web Component (thin wrapper)
 * 2. Inside other components that need embedded charts
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct ref access for ECharts initialization
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfChartFC: FunctionalComponent<LfChartFCProps> = ({
  chartRef,
  className,
  framework,
  id,
  sizeX = "100%",
  sizeY = "100%",
  style,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_CHART_BLOCKS;
  const parts = LF_CHART_PARTS;

  const { chart } = blocks;

  // Build style object with size variables
  const computedStyle: { [key: string]: string } = {
    ...style,
  };

  // Apply size if provided (ECharts needs explicit dimensions)
  if (sizeX) {
    computedStyle["--lf-chart-width"] = sizeX;
  }
  if (sizeY) {
    computedStyle["--lf-chart-height"] = sizeY;
  }

  return (
    <div
      class={`${bemClass(chart._)}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.chart._}
      ref={chartRef}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
    ></div>
  );
};
