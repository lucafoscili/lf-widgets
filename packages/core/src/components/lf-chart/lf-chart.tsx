import {
  LF_CHART_BLOCKS,
  LF_CHART_CSS_VARS,
  LF_CHART_PARTS,
  LF_CHART_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChartAdapter,
  LfChartAdapterThemeStyle,
  LfChartAxis,
  LfChartElement,
  LfChartEvent,
  LfChartEventData,
  LfChartEventPayload,
  LfChartInterface,
  LfChartLegendPlacement,
  LfChartPropsInterface,
  LfChartSeriesData,
  LfChartType,
  LfChartXAxis,
  LfChartYAxis,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  onFrameworkReady,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { dispose, ECharts, init } from "echarts";
import {
  prepAxis,
  prepLabel,
  prepLegend,
  prepSeries,
  prepTooltip,
} from "./helpers.utils";
import { createAdapter } from "./lf-chart-adapter";

/**
 * Represents a chart component that displays data in various formats, such as
 * bar, line, pie, scatter, and more. The component supports multiple axes,
 * series, and data types, and can be customized with various options. Implements
 * methods for managing state, retrieving component properties, refreshing the
 * component, and resizing the chart.
 *
 * @component
 * @tag lf-chart
 * @shadow true
 *
 * @remarks
 * This component uses the ECharts library to render charts based on the provided
 * data set. The component supports various chart types, including bar, line, pie,
 * scatter, and more. The chart can be customized with different axes, series, and
 * legend placements.
 *
 * @example
 * <lf-chart
 * lfAxis={['date']}
 * lfColors={['#ff0000', '#00ff00']}
 * lfDataset={dataset}
 * lfLegend="right"
 * lfSeries={['sales', 'revenue']}
 * ></lf-chart>
 *
 * @fires {CustomEvent} lf-chart-event - Emitted for various component events
 */
@Component({
  tag: "lf-chart",
  styleUrl: "lf-chart.scss",
  shadow: true,
})
export class LfChart implements LfChartInterface {
  /**
   * References the root HTML element of the component (<lf-chart>).
   */
  @Element() rootElement: LfChartElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() themeValues: LfChartAdapterThemeStyle = {
    background: null,
    border: null,
    danger: null,
    font: null,
    success: null,
    text: null,
  };
  //#endregion

  //#region Props
  /**
   * Sets the axis of the chart.
   *
   * @type {LfChartAxis}
   * @default []
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfAxis={['date']}></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfAxis: LfChartAxis = [];
  /**
   * Overrides theme's colors.
   *
   * @type {string[]}
   * @default []
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfColors={['#ff0000', '#00ff00']}></lf-chart>
   *
   */
  @Prop({ mutable: true }) lfColors: string[] = [];
  /**
   * The data set for the LF Chart component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfDataset={dataset}></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Sets the position of the legend.
   * Supported values: bottom, left, right, top, hidden.
   * Keep in mind that legend types are tied to chart types, some combinations might not work.
   *
   * @type {LfChartLegendPlacement}
   * @default "bottom"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfLegend="right"></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfLegend: LfChartLegendPlacement = "bottom";
  /**
   * The data series to be displayed. They must be of the same type.
   *
   * @type {string[]}
   * @default []
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfSeries={['sales', 'revenue']}></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfSeries: string[] = [];
  /**
   * The width of the chart, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).
   *
   * @type {string}
   * @default "100%"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfSizeX="300px"></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfSizeX: string = "100%";
  /**
   * The height of the chart, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
   *
   * @type {string}
   * @default "100%"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfSizeY="200px"></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfSizeY: string = "100%";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfStyle="#lf-component { color: red; }"></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The type of the chart.
   * Supported formats: Bar, Gaussian, Line, Pie, Map and Scatter.
   *
   * @type {LfChartType[]}
   * @default ["line"]
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfTypes={['line']}></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfTypes: LfChartType[] = ["line"];
  /**
   * Customization options for the x Axis.
   *
   * @type {LfChartXAxis}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfXAxis={{ lfType: 'category' }}></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfXAxis: LfChartXAxis = null;
  /**
   * Customization options for the y Axis.
   *
   * @type {LfChartYAxis}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chart lfYAxis={{ lfType: 'value' }}></lf-chart>
   * ```
   */
  @Prop({ mutable: true }) lfYAxis: LfChartYAxis = null;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CHART_BLOCKS;
  #p = LF_CHART_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_CHART_CSS_VARS;
  #w = LF_WRAPPER_ID;
  #container: HTMLDivElement;
  #resizeObserver: ResizeObserver;
  #resizeTimeout: NodeJS.Timeout;
  #chart: ECharts;
  #axesData: { id: string; data: string[] }[] = [];
  #seriesData: LfChartSeriesData[] = [];
  #adapter: LfChartAdapter;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-chart-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfChartEventPayload>;
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfChartEvent,
    data?: LfChartEventData,
  ) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      data,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfChartPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfChartPropsInterface> {
    const entries = LF_CHART_PROPS.map(
      (
        prop,
      ): [keyof LfChartPropsInterface, LfChartPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Resizes the chart to fit the container.
   */
  @Method()
  async resize(): Promise<void> {
    this.#chart.resize();
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #init() {
    const { debug } = this.#framework;

    if (this.#chart) {
      dispose(this.#container);
    }
    if (this.lfTypes && this.lfTypes.length > 0) {
      this.#chart = init(this.#container);
      this.#createChart();
    } else {
      debug.logs.new(
        this,
        "Can't initialize chart without specifying at least 1 type.",
        "warning",
      );
    }
  }
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        compInstance: this,
        columnById: (id: string) =>
          this.#framework.data.column.find(this.lfDataset, { id })[0],
        manager: this.#framework,
        mappedType: (type) => {
          switch (type) {
            case "area":
            case "gaussian":
              return "line";
            case "calendar":
            case "hbar":
            case "sbar":
              return "bar";
            case "bubble":
              return "scatter";
            default:
              return type;
          }
        },
        seriesColumn: (series) =>
          this.#framework.data.column.find(this.lfDataset, { title: series }),
        seriesData: () => this.#seriesData,
        style: {
          axis: () => prepAxis(() => this.#adapter),
          label: () => prepLabel(() => this.#adapter),
          legend: () => prepLegend(() => this.#adapter),
          seriesColor: (amount: number) =>
            prepSeries(() => this.#adapter, amount),
          theme: () => this.themeValues,
          tooltip: (formatter) => prepTooltip(() => this.#adapter, formatter),
        },
        xAxesData: () => this.#axesData,
      },
      {
        style: {
          theme: () => this.#updateThemeColors(),
        },
      },
      () => this.#adapter,
    );
  };
  #onFrameworkReady = async () => {
    this.#framework = await onFrameworkReady;
    this.debugInfo = this.#framework.debug.info.create();
    this.#framework.theme.register(this);
  };
  #consistencyCheck() {
    const { logs } = this.#framework.debug;

    if (typeof this.lfAxis === "string") {
      this.lfAxis = [this.lfAxis];
      logs.new(
        this,
        "Axis must be an array. Converted to array.",
        "informational",
      );
    }

    if (typeof this.lfSeries === "string") {
      this.lfSeries = [this.lfSeries];
      logs.new(
        this,
        "Series must be an array. Converted to array.",
        "informational",
      );
    }

    if (Array.isArray(this.lfSeries) && this.lfSeries.length === 0) {
      const series = new Set<string>();
      this.lfDataset.columns.forEach((column) => {
        if (column.id !== this.lfAxis[0]) {
          series.add(column.id);
        }
      });
      this.lfSeries = Array.from(series);
      logs.new(
        this,
        "No series specified. Using all columns as series.",
        "informational",
      );
    }

    if (this.lfSeries.length > 0 && this.lfTypes.length === 0) {
      logs.new(
        this,
        "Series are defined but no types are specified. Defaulting to line chart.",
        "informational",
      );
      this.lfTypes = ["line"];
    }
  }
  #createAxisData() {
    const { stringify } = this.#framework.data.cell;

    this.#axesData = [];
    const axisIds = this.lfAxis || [];
    const dataset = this.lfDataset;

    if (dataset?.nodes?.length) {
      for (const axisId of axisIds) {
        const xData: string[] = [];
        for (const node of dataset.nodes) {
          const cell = node.cells?.[axisId];
          xData.push(cell?.value != null ? stringify(cell.value) : "");
        }
        this.#axesData.push({ id: axisId, data: xData });
      }
    }
  }
  #stringToIndexMap(array: string[]): Map<string, number> {
    const map = new Map<string, number>();
    array.forEach((value, index) => map.set(value, index));
    return map;
  }
  #createSeriesData() {
    const { stringify } = this.#framework.data.cell;
    const { find } = this.#framework.data.column;

    this.#seriesData = [];
    const seriesIds = this.lfSeries || [];
    const dataset = this.lfDataset;

    if (dataset?.nodes?.length) {
      const xCategories = this.#axesData[0]?.data || [];
      const yCategories = this.#axesData[1]?.data || [];
      const xMap = this.#stringToIndexMap(xCategories);
      const yMap = this.#stringToIndexMap(yCategories);

      for (let index = 0; index < seriesIds.length; index++) {
        const seriesId = seriesIds[index];
        const seriesType = this.lfTypes?.[index] || this.lfTypes?.[0] || "line";
        const seriesValues: any[] = [];

        if (seriesType === "heatmap") {
          for (const node of dataset.nodes) {
            const xValue = stringify(node.cells[this.lfAxis[0]]?.value);
            const yValue = stringify(node.cells[this.lfAxis[1]]?.value);
            const value = parseFloat(
              stringify(node.cells[seriesId]?.value) || "0",
            );
            seriesValues.push([xMap.get(xValue), yMap.get(yValue), value]);
          }
        } else {
          const lineDataMap = new Map<string, number>();
          for (const node of dataset.nodes) {
            const xValue = stringify(node.cells[this.lfAxis[0]]?.value);
            const value = parseFloat(
              stringify(node.cells[seriesId]?.value) || "0",
            );
            lineDataMap.set(xValue, value);
          }
          for (const xValue of xCategories) {
            seriesValues.push(lineDataMap.get(xValue) ?? 0);
          }
        }

        const seriesName =
          find(dataset, { id: seriesId })?.[0]?.title || seriesId;
        const axisIndex = 0;

        this.#seriesData.push({
          name: seriesName,
          data: seriesValues,
          axisIndex,
          type: seriesType,
        });
      }
    }
  }
  async #createChart() {
    this.#createAxisData();
    this.#createSeriesData();
    const options = this.#createChartOptions();
    this.#chart.setOption(options, true);

    this.#chart.on("click", this.#adapter.handlers.onClick);
  }
  #createChartOptions() {
    const { options } = this.#adapter.controller.get;
    const {
      basic,
      bubble,
      calendar,
      candlestick,
      funnel,
      heatmap,
      pie,
      radar,
      sankey,
    } = options;

    const firstType = this.lfTypes?.[0] || "line";

    switch (firstType) {
      case "bubble":
        return bubble();
      case "calendar":
        return calendar();
      case "candlestick":
        return candlestick();
      case "funnel":
        return funnel();
      case "heatmap":
        return heatmap();
      case "pie":
        return pie();
      case "radar":
        return radar();
      case "sankey":
        return sankey();
      default:
        this.#createAxisData();
        return basic();
    }
  }
  #updateThemeColors() {
    const { themeValues } = this;
    const {
      "--lf-color-bg": bg,
      "--lf-color-border": border,
      "--lf-color-danger": danger,
      "--lf-color-success": success,
      "--lf-color-on-bg": text,
      "--lf-font-family-primary": font,
    } = this.#framework.theme.get.current().variables;

    themeValues.background = bg;
    themeValues.border = border;
    themeValues.danger = danger;
    themeValues.font = font;
    themeValues.success = success;
    themeValues.text = text;
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    await this.#onFrameworkReady();
    this.#initAdapter();

    const { logs } = this.#framework.debug;

    if (!this.lfDataset?.columns || !this.lfDataset?.nodes) {
      logs.new(
        this,
        "No data provided. Please provide a data set to render the chart.",
        "informational",
      );
    } else {
      this.#consistencyCheck();
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#resizeObserver = new ResizeObserver(() => {
      clearTimeout(this.#resizeTimeout);
      this.#resizeTimeout = setTimeout(() => {
        this.resize();
      }, 100);
    });
    this.#resizeObserver.observe(this.#container);

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    this.#adapter.controller.set.style.theme();

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug } = this.#framework;

    const { lfDataset } = this;

    if (lfDataset?.columns && lfDataset?.nodes) {
      this.#init();
    } else {
      debug.logs.new(
        this,
        "Not enough data. (" + JSON.stringify(lfDataset) + ")",
        "informational",
      );
    }
    debug.info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { lfSizeX, lfSizeY, lfStyle } = this;

    return (
      <Host>
        <style id={this.#s}>
          {`
            :host {
               ${this.#v.height}: ${lfSizeY || "100%"};
               ${this.#v.width}: ${lfSizeX || "100%"};
            }
            ${(lfStyle && setLfStyle(this)) || ""}
          `}
        </style>
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.chart._)}
            part={this.#p.chart}
            ref={(chartContainer) => (this.#container = chartContainer)}
          ></div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }

    dispose(this.#container);
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}
