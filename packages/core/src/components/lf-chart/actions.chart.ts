import {
  LfChartAdapter,
  LfChartAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Prepares the actions domain for the lf-chart adapter.
 * Contains multi-step operations that trigger ECharts or manage lifecycle.
 *
 * @param getAdapter - Factory function to retrieve the adapter instance
 * @returns The actions controller interface
 */
export const prepChartActions = (
  getAdapter: () => LfChartAdapter,
): LfChartAdapterControllerActions => {
  return {
    /**
     * Disposes the ECharts instance and cleans up resources.
     */
    dispose: () => {
      const adapter = getAdapter() as any;
      if (adapter._disposeChart) {
        adapter._disposeChart();
      }
    },

    /**
     * Triggers a data refresh and re-render of the chart.
     */
    refresh: () => {
      const adapter = getAdapter() as any;
      if (adapter._refresh) {
        adapter._refresh();
      }
    },

    /**
     * Re-renders the chart with current data and options.
     */
    render: () => {
      const adapter = getAdapter() as any;
      if (adapter._render) {
        adapter._render();
      }
    },

    /**
     * Resizes the chart to fit its container.
     */
    resize: () => {
      const adapter = getAdapter() as any;
      if (adapter._resize) {
        adapter._resize();
      }
    },
  };
};
