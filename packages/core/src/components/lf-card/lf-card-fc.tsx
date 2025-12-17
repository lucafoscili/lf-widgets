import {
  LF_CARD_BLOCKS,
  LF_CARD_PARTS,
  LfButtonElement,
  LfCardAdapter,
  LfCardAdapterDefaults,
  LfCardAdapterDispatcher,
  LfCardLayout,
  LfChipElement,
  LfCodeElement,
  LfDataShapesMap,
  LfFrameworkInterface,
  LfThemeUIState,
  LfToggleElement,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

//#region Props Interface
/**
 * LfCardFCProps - Props interface for the Card Functional Component
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * The card component supports multiple layouts (material, debug, keywords, upload, weather).
 * Each layout renders a different visual structure based on the shapes data.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfCardFCProps {
  /** Block names for BEM class generation */
  blocks: typeof LF_CARD_BLOCKS;
  /** Assigned class for custom styling */
  className?: string;
  /** Defaults for shapes data */
  defaults: LfCardAdapterDefaults;
  /** Dispatcher for events */
  dispatcher: LfCardAdapterDispatcher;
  /** Elements adapter for refs and handlers */
  elements: LfCardAdapter["elements"];
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Handlers for layout-specific events */
  handlers?: LfCardAdapter["handlers"];
  /** Unique identifier for the component */
  id?: string;
  /** Layout type to render */
  layout: LfCardLayout;
  /** LF attributes accessor function */
  lfAttributes: () => Record<string, string>;
  /** Callback fired on click event */
  onClick?: (e: MouseEvent | PointerEvent) => void;
  /** Callback fired on context menu event */
  onContextMenu?: (e: MouseEvent) => void;
  /** Callback fired on pointer down event */
  onPointerDown?: (e: PointerEvent) => void;
  /** Part names for shadow DOM styling */
  parts: typeof LF_CARD_PARTS;
  /** Shapes data for rendering content */
  shapes: LfDataShapesMap;
  /** Custom CSS styles to apply */
  style?: { [key: string]: string };
  /**
   * UI state for theming (primary, success, warning, danger, etc.).
   * Controls color scheme via data-lf attribute.
   * @default "primary"
   */
  uiState?: LfThemeUIState;
}
//#endregion

/**
 * LfCardFC - Functional Component for Card
 *
 * This is a stateless functional component that renders a card with various layouts.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-card Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 *
 * Supported layouts:
 * - material: Standard material design card with cover image, text, and actions
 * - debug: Debug info card with toggle, code viewer, and buttons
 * - keywords: Keywords/tags card with chart, chip, and button
 * - upload: File upload card with upload area and button
 * - weather: Weather information card with temperature and conditions
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfCardFC: FunctionalComponent<LfCardFCProps> = ({
  blocks,
  className,
  defaults,
  dispatcher,
  elements,
  framework,
  handlers,
  id,
  layout = "material",
  lfAttributes,
  onClick,
  onContextMenu,
  onPointerDown,
  parts,
  shapes,
  style,
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  // Render the appropriate layout based on the layout prop
  const renderLayout = (): VNode => {
    switch (layout.toLowerCase()) {
      case "material":
        return renderMaterialLayout();
      case "debug":
        return renderDebugLayout();
      case "keywords":
        return renderKeywordsLayout();
      case "upload":
        return renderUploadLayout();
      case "weather":
        return renderWeatherLayout();
      default:
        return renderMaterialLayout();
    }
  };

  //#region Material Layout
  const renderMaterialLayout = (): VNode => {
    const { material } = defaults;
    const { materialLayout, textContent } = blocks;
    const lf = lfAttributes();

    const { button, image, text } = shapes;

    // Buttons
    const buttons: VNode[] = [];
    const buttonsDef = material?.button?.() || [];
    for (let index = 0; index < button.length; index++) {
      buttons.push(
        <LfShape
          shape="button"
          cell={
            buttonsDef[index]
              ? Object.assign(buttonsDef[index], button[index])
              : button[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
        />,
      );
    }
    const hasButton = Boolean(buttons?.length);

    // Images
    const images: VNode[] = [];
    const imagesDef = material?.image?.() || [];
    for (let index = 0; index < image.length; index++) {
      images.push(
        <LfShape
          shape="image"
          cell={
            imagesDef[index]
              ? Object.assign(imagesDef[index], image[index])
              : image[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
        />,
      );
    }
    const hasImage = Boolean(images?.length);

    // Text content
    const hasText = Boolean(text?.length);
    const title = (hasText && text?.[0]?.value) || null;
    const subtitle = (hasText && text?.[1]?.value) || null;
    const description = (hasText && text?.[2]?.value) || null;

    return (
      <div
        class={bemClass(materialLayout._, null, {
          "has-actions": hasButton,
        })}
        data-lf={lf[uiState]}
        part={parts.materialLayout}
        ref={(el: HTMLDivElement) => {
          if (el && elements.refs.layouts) {
            elements.refs.layouts.material = el;
          }
        }}
      >
        {hasImage && (
          <div class={bemClass(materialLayout._, materialLayout.coverSection)}>
            {images[0]}
          </div>
        )}
        <div class={bemClass(materialLayout._, materialLayout.textSection)}>
          {title && (
            <div class={bemClass(textContent._, textContent.title)}>
              {title}
            </div>
          )}
          {subtitle && (
            <div class={bemClass(textContent._, textContent.subtitle)}>
              {subtitle}
            </div>
          )}
          {description && (
            <div class={bemClass(textContent._, textContent.description)}>
              {description}
            </div>
          )}
        </div>
        {hasButton && (
          <div
            class={bemClass(materialLayout._, materialLayout.actionsSection)}
          >
            {buttons}
          </div>
        )}
      </div>
    );
  };
  //#endregion

  //#region Debug Layout
  const renderDebugLayout = (): VNode => {
    const { debug } = defaults;
    const { debugLayout } = blocks;

    const { button, code, toggle } = shapes;

    // Buttons
    const buttons: VNode[] = [];
    const buttonsDef = debug?.button?.() || [];
    for (let index = 0; index < button.length; index++) {
      buttons.push(
        <LfShape
          shape="button"
          cell={
            buttonsDef[index]
              ? Object.assign(buttonsDef[index], button[index])
              : button[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
          defaultCb={handlers?.layouts?.debug?.button}
          refCallback={(r: LfButtonElement) => {
            if (elements.refs.layouts?.debug) {
              elements.refs.layouts.debug.button = r;
            }
          }}
        />,
      );
    }
    const hasButton = Boolean(buttons?.length);
    const hasMoreButtons = Boolean(buttons?.length > 1);

    // Codes
    const codes: VNode[] = [];
    const codesDef = debug?.code?.() || [];
    for (let index = 0; index < code.length; index++) {
      codes.push(
        <LfShape
          shape="code"
          cell={
            codesDef[index]
              ? Object.assign(codesDef[index], code[index])
              : code[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
          defaultCb={handlers?.layouts?.debug?.code}
          refCallback={(r: LfCodeElement) => {
            if (elements.refs.layouts?.debug) {
              elements.refs.layouts.debug.code = r;
            }
          }}
        />,
      );
    }
    const hasCode = Boolean(codes?.length);

    // Toggles
    const toggles: VNode[] = [];
    const togglesDef = debug?.toggle?.() || [];
    for (let index = 0; index < toggle.length; index++) {
      toggles.push(
        <LfShape
          shape="toggle"
          cell={
            togglesDef[index]
              ? Object.assign(togglesDef[index], toggle[index])
              : toggle[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
          defaultCb={handlers?.layouts?.debug?.toggle}
          refCallback={(r: LfToggleElement) => {
            if (elements.refs.layouts?.debug) {
              elements.refs.layouts.debug.toggle = r;
            }
          }}
        />,
      );
    }
    const hasToggle = Boolean(toggles?.length);

    return (
      <div class={bemClass(debugLayout._)} part={parts.debugLayout}>
        {hasToggle && (
          <div class={bemClass(debugLayout._, debugLayout.section1)}>
            {toggles[0]}
          </div>
        )}
        {hasCode && (
          <div class={bemClass(debugLayout._, debugLayout.section2)}>
            {codes[0]}
          </div>
        )}
        {hasButton && (
          <div class={bemClass(debugLayout._, debugLayout.section3)}>
            {buttons[0]}
          </div>
        )}
        {hasMoreButtons && (
          <div class={bemClass(debugLayout._, debugLayout.section4)}>
            {buttons[1]}
          </div>
        )}
      </div>
    );
  };
  //#endregion

  //#region Keywords Layout
  const renderKeywordsLayout = (): VNode => {
    const { keywords } = defaults;
    const { keywordsLayout } = blocks;

    const { button, chart, chip } = shapes;

    // Buttons
    const buttons: VNode[] = [];
    const buttonsDef = keywords?.button?.() || [];
    for (let index = 0; index < button.length; index++) {
      buttons.push(
        <LfShape
          shape="button"
          cell={
            buttonsDef[index]
              ? Object.assign(buttonsDef[index], button[index])
              : button[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
          defaultCb={handlers?.layouts?.keywords?.button}
          refCallback={(r: LfButtonElement) => {
            if (elements.refs.layouts?.keywords) {
              elements.refs.layouts.keywords.button = r;
            }
          }}
        />,
      );
    }
    const hasButton = Boolean(buttons?.length);

    // Charts
    const charts: VNode[] = [];
    const chartsDef = keywords?.chart?.() || [];
    for (let index = 0; index < chart.length; index++) {
      charts.push(
        <LfShape
          shape="chart"
          cell={
            chartsDef[index]
              ? Object.assign(chartsDef[index], chart[index])
              : chart[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
        />,
      );
    }
    const hasChart = Boolean(charts?.length);

    // Chips
    const chips: VNode[] = [];
    const chipsDef = keywords?.chip?.() || [];
    for (let index = 0; index < chip.length; index++) {
      chips.push(
        <LfShape
          shape="chip"
          cell={
            chipsDef[index]
              ? Object.assign(chipsDef[index], chip[index])
              : chip[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
          refCallback={(r: LfChipElement) => {
            if (elements.refs.layouts?.keywords) {
              elements.refs.layouts.keywords.chip = r;
            }
          }}
        />,
      );
    }
    const hasChip = Boolean(chips?.length);

    return (
      <div class={bemClass(keywordsLayout._)} part={parts.keywordsLayout}>
        {hasChart && (
          <div class={bemClass(keywordsLayout._, keywordsLayout.section1)}>
            {charts[0]}
          </div>
        )}
        {hasChip && (
          <div class={bemClass(keywordsLayout._, keywordsLayout.section2)}>
            {chips[0]}
          </div>
        )}
        {hasButton && (
          <div class={bemClass(keywordsLayout._, keywordsLayout.section3)}>
            {buttons[0]}
          </div>
        )}
      </div>
    );
  };
  //#endregion

  //#region Upload Layout
  const renderUploadLayout = (): VNode => {
    const { upload: uploadDefs } = defaults;
    const { uploadLayout } = blocks;

    const { button, upload } = shapes;

    // Buttons
    const buttons: VNode[] = [];
    const buttonsDef = uploadDefs?.button?.() || [];
    for (let index = 0; index < button.length; index++) {
      buttons.push(
        <LfShape
          shape="button"
          cell={
            buttonsDef[index]
              ? Object.assign(buttonsDef[index], button[index])
              : button[index]
          }
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
        />,
      );
    }
    const hasButton = Boolean(buttons?.length);

    // Uploads
    const uploads: VNode[] = [];
    for (let index = 0; index < upload.length; index++) {
      uploads.push(
        <LfShape
          shape="upload"
          cell={upload[index]}
          index={index}
          eventDispatcher={async (e) =>
            dispatcher.emit("lf-event", { originalEvent: e })
          }
          framework={framework}
        />,
      );
    }
    const hasUpload = Boolean(uploads?.length);

    return (
      <div class={bemClass(uploadLayout._)} part={parts.uploadLayout}>
        {hasUpload && (
          <div class={bemClass(uploadLayout._, uploadLayout.section1)}>
            {uploads[0]}
          </div>
        )}
        {hasButton && (
          <div class={bemClass(uploadLayout._, uploadLayout.section2)}>
            {buttons[0]}
          </div>
        )}
      </div>
    );
  };
  //#endregion

  //#region Weather Layout
  const renderWeatherLayout = (): VNode => {
    const { weatherLayout, textContent } = blocks;

    const { image, text } = shapes;

    // Extract weather data from text cells
    const location = text[0]?.value || "Unknown Location";
    const tempC = text[1]?.value || "—";
    const tempF = text[2]?.value || "—";
    const conditions = text[3]?.value || "—";
    const feelsLikeC = text[4]?.value || "—";
    const feelsLikeF = text[5]?.value || "—";
    const humidity = text[6]?.value || "—";
    const windSpeed = text[7]?.value || "—";
    const windDir = text[8]?.value || "—";

    // Optional background image
    const backgroundImage = image[0]?.value || "";

    // Determine weather condition for gradient
    const conditionsLower = conditions.toLowerCase();
    let weatherCondition = "default";
    if (
      conditionsLower.includes("clear") ||
      conditionsLower.includes("sunny")
    ) {
      weatherCondition = "sunny";
    } else if (conditionsLower.includes("partly")) {
      weatherCondition = "partly-cloudy";
    } else if (
      conditionsLower.includes("cloud") ||
      conditionsLower.includes("overcast")
    ) {
      weatherCondition = "cloudy";
    } else if (
      conditionsLower.includes("rain") ||
      conditionsLower.includes("drizzle")
    ) {
      weatherCondition = "rainy";
    } else if (
      conditionsLower.includes("storm") ||
      conditionsLower.includes("thunder")
    ) {
      weatherCondition = "stormy";
    } else if (conditionsLower.includes("snow")) {
      weatherCondition = "snowy";
    } else if (
      conditionsLower.includes("fog") ||
      conditionsLower.includes("mist")
    ) {
      weatherCondition = "foggy";
    }

    // Get weather icon
    const getWeatherIcon = (): string => {
      if (conditions.includes("☀") || conditionsLower.includes("clear"))
        return "☀️";
      if (conditions.includes("⛅") || conditionsLower.includes("partly"))
        return "⛅";
      if (conditions.includes("☁") || conditionsLower.includes("cloud"))
        return "☁️";
      if (conditions.includes("🌧") || conditionsLower.includes("rain"))
        return "🌧️";
      if (conditions.includes("⛈") || conditionsLower.includes("storm"))
        return "⛈️";
      if (conditions.includes("❄") || conditionsLower.includes("snow"))
        return "❄️";
      if (
        conditions.includes("🌫") ||
        conditionsLower.includes("fog") ||
        conditionsLower.includes("mist")
      )
        return "🌫️";
      return "🌤️";
    };

    const hasBackground = Boolean(backgroundImage);

    return (
      <div
        class={bemClass(weatherLayout._)}
        data-has-background={String(hasBackground)}
        data-weather-condition={weatherCondition}
        part={parts.weatherLayout}
        style={
          hasBackground
            ? { "--weather-bg-image": `url(${backgroundImage})` }
            : undefined
        }
      >
        {/* Header */}
        <div class={bemClass(weatherLayout._, weatherLayout.header)}>
          <div class={bemClass(weatherLayout._, weatherLayout.location)}>
            📍 {location}
          </div>
        </div>

        {/* Main Section */}
        <div class={bemClass(weatherLayout._, weatherLayout.mainSection)}>
          <div class={bemClass(weatherLayout._, weatherLayout.icon)}>
            {getWeatherIcon()}
          </div>
          <div class={bemClass(weatherLayout._, weatherLayout.temperature)}>
            <div class={bemClass(textContent._, textContent.title)}>
              {tempC}°C
            </div>
            <div class={bemClass(textContent._, textContent.subtitle)}>
              {tempF}°F
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div class={bemClass(weatherLayout._, weatherLayout.detailsGrid)}>
          {/* Conditions */}
          <div class={bemClass(weatherLayout._, weatherLayout.detailItem)}>
            <div class={bemClass(weatherLayout._, weatherLayout.detailLabel)}>
              🌤️ Conditions
            </div>
            <div class={bemClass(weatherLayout._, weatherLayout.detailValue)}>
              {conditions}
            </div>
          </div>

          {/* Feels like */}
          <div class={bemClass(weatherLayout._, weatherLayout.detailItem)}>
            <div class={bemClass(weatherLayout._, weatherLayout.detailLabel)}>
              🤔 Feels like
            </div>
            <div class={bemClass(weatherLayout._, weatherLayout.detailValue)}>
              {feelsLikeC}°C ({feelsLikeF}°F)
            </div>
          </div>

          {/* Humidity */}
          <div class={bemClass(weatherLayout._, weatherLayout.detailItem)}>
            <div class={bemClass(weatherLayout._, weatherLayout.detailLabel)}>
              💧 Humidity
            </div>
            <div class={bemClass(weatherLayout._, weatherLayout.detailValue)}>
              {humidity}%
            </div>
          </div>

          {/* Wind */}
          <div class={bemClass(weatherLayout._, weatherLayout.detailItem)}>
            <div class={bemClass(weatherLayout._, weatherLayout.detailLabel)}>
              💨 Wind
            </div>
            <div class={bemClass(weatherLayout._, weatherLayout.detailValue)}>
              {windSpeed} km/h {windDir}
            </div>
          </div>
        </div>
      </div>
    );
  };
  //#endregion

  return (
    <div
      class={`${bemClass(blocks.card)}${className ? ` ${className}` : ""}`}
      id={id}
      onClick={(e) => onClick?.(e)}
      onContextMenu={(e) => onContextMenu?.(e)}
      onPointerDown={(e) => onPointerDown?.(e)}
      style={style}
    >
      {renderLayout()}
    </div>
  );
};
