import { LfChartAdapterJsx } from "@lf-widgets/foundations";

/**
 * Prepares JSX factories for the chart adapter.
 * Note: The main chart rendering is now handled by ChartFC (fc/chart-fc.tsx).
 * This function is kept for adapter interface compliance.
 */
export const prepChartJsx = (): LfChartAdapterJsx => {
  return {
    // Chart rendering is handled by ChartFC in render()
    // This placeholder satisfies the adapter interface
    chart: () => null,
  };
};
