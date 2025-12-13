import { LfCardAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

//#region Weather layout
/**
 * Prepares the weather layout for the LfCard component.
 * This layout is designed to display weather information with:
 * - Header: Location name
 * - Main section: Temperature with weather icon
 * - Details grid: Conditions, Feels like, Humidity, Wind
 *
 * Expected cell structure:
 * text[0]: Location (e.g., "Rome, Italy")
 * text[1]: Temperature in Celsius (e.g., "13")
 * text[2]: Temperature in Fahrenheit (e.g., "56")
 * text[3]: Conditions (e.g., "Clear ☀️")
 * text[4]: Feels like in Celsius (e.g., "14")
 * text[5]: Feels like in Fahrenheit (e.g., "57")
 * text[6]: Humidity (e.g., "67")
 * text[7]: Wind speed (e.g., "4")
 * text[8]: Wind direction (e.g., "NE")
 *
 * @param {() => LfCardAdapter} getAdapter - Function to get the LfCardAdapter instance.
 * @returns {VNode} The virtual node representing the weather layout.
 */
export const prepWeather = (getAdapter: () => LfCardAdapter): VNode => {
  const { controller } = getAdapter();
  const { blocks, compInstance, framework, lfAttributes, shapes } =
    controller.get;

  const mgr = framework();
  const { theme } = mgr;
  const { bemClass } = theme;
  const b = blocks();
  const lf = lfAttributes();
  const { weatherLayout, textContent } = b;

  const { image, text } = shapes();
  const comp = compInstance();

  //#region Extract weather data from text cells
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
  if (conditionsLower.includes("clear") || conditionsLower.includes("sunny")) {
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
  //#endregion

  //#region Render sections
  const renderHeader = (): VNode => (
    <div class={bemClass(weatherLayout._, weatherLayout.header)}>
      <div class={bemClass(weatherLayout._, weatherLayout.location)}>
        📍 {location}
      </div>
    </div>
  );

  const renderMain = (): VNode => (
    <div class={bemClass(weatherLayout._, weatherLayout.mainSection)}>
      <div class={bemClass(weatherLayout._, weatherLayout.icon)}>
        {conditions.includes("☀") || conditions.toLowerCase().includes("clear")
          ? "☀️"
          : conditions.includes("⛅") ||
              conditions.toLowerCase().includes("partly")
            ? "⛅"
            : conditions.includes("☁") ||
                conditions.toLowerCase().includes("cloud")
              ? "☁️"
              : conditions.includes("🌧") ||
                  conditions.toLowerCase().includes("rain")
                ? "🌧️"
                : conditions.includes("⛈") ||
                    conditions.toLowerCase().includes("storm")
                  ? "⛈️"
                  : conditions.includes("❄") ||
                      conditions.toLowerCase().includes("snow")
                    ? "❄️"
                    : conditions.includes("🌫") ||
                        conditions.toLowerCase().includes("fog") ||
                        conditions.toLowerCase().includes("mist")
                      ? "🌫️"
                      : "🌤️"}
      </div>
      <div class={bemClass(weatherLayout._, weatherLayout.temperature)}>
        <div class={bemClass(textContent._, textContent.title)}>{tempC}°C</div>
        <div class={bemClass(textContent._, textContent.subtitle)}>
          {tempF}°F
        </div>
      </div>
    </div>
  );

  const renderDetails = (): VNode => (
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
          🌬️ Wind
        </div>
        <div class={bemClass(weatherLayout._, weatherLayout.detailValue)}>
          {windSpeed} km/h {windDir}
        </div>
      </div>
    </div>
  );
  //#endregion

  return (
    <div
      class={bemClass(weatherLayout._)}
      data-lf={lf[comp.lfUiState]}
      data-weather-condition={weatherCondition}
      data-has-background={backgroundImage ? "true" : "false"}
      style={
        backgroundImage
          ? { "--weather-bg-image": `url(${backgroundImage})` }
          : {}
      }
    >
      {renderHeader()}
      {renderMain()}
      {renderDetails()}
    </div>
  );
};
//#endregion
