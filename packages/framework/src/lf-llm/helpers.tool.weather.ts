import {
  LfDataDataset,
  LfFrameworkInterface,
  LfLLMTool,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

/**
 * Creates the builtin `get_weather` tool. Uses the public wttr.in endpoint
 * and returns a rich article dataset that leverages the `lf-card` weather
 * layout for visualisation.
 */
export const createWeatherTool = (
  framework: LfFrameworkInterface,
): LfLLMTool => {
  const execute = async (
    args: Record<string, unknown>,
  ): Promise<LfLLMToolResponse> => {
    const rawLocation = args.location;
    const location =
      typeof rawLocation === "string" && rawLocation.trim().length > 0
        ? rawLocation.trim()
        : "London";

    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(location)}?format=j1`,
      );

      if (!response.ok) {
        return {
          type: "text",
          content: `Unable to fetch weather for "${location}". Please check the location name and try again.`,
        };
      }

      const data = await response.json();
      const current = data?.current_condition?.[0];
      const area = data?.nearest_area?.[0];

      if (!current) {
        return {
          type: "text",
          content: `Weather data unavailable for "${location}".`,
        };
      }

      const locationName =
        area?.areaName?.[0]?.value && typeof area.areaName[0].value === "string"
          ? area.areaName[0].value
          : location;
      const country =
        area?.country?.[0]?.value && typeof area.country[0].value === "string"
          ? area.country[0].value
          : "";

      const fullLocation =
        country && !locationName.includes(country)
          ? `${locationName}, ${country}`
          : locationName;

      const tempC = String(current.temp_C ?? "");
      const tempF = String(current.temp_F ?? "");
      const feelsLikeC = String(current.FeelsLikeC ?? "");
      const feelsLikeF = String(current.FeelsLikeF ?? "");
      const humidity = String(current.humidity ?? "");
      const windSpeed = String(current.windspeedKmph ?? "");
      const windDir = String(current.winddir16Point ?? "");
      const conditionText =
        current.weatherDesc?.[0]?.value ?? current.weatherDesc ?? "Unknown";

      const summaryLines = [
        `Weather for ${fullLocation}:`,
        `- Temperature: ${tempC}°C (${tempF}°F)`,
        `- Conditions: ${conditionText}`,
        `- Feels like: ${feelsLikeC}°C (${feelsLikeF}°F)`,
        `- Humidity: ${humidity}%`,
        `- Wind: ${windSpeed} km/h ${windDir}`,
      ];

      const summary = summaryLines.join("\n");

      const weatherDataset: LfDataDataset = {
        nodes: [
          {
            id: "weather-location",
            cells: {
              text: {
                value: fullLocation,
                shape: "text",
              },
            },
          },
          {
            id: "weather-temp-c",
            cells: {
              text: {
                value: tempC,
                shape: "text",
              },
            },
          },
          {
            id: "weather-temp-f",
            cells: {
              text: {
                value: tempF,
                shape: "text",
              },
            },
          },
          {
            id: "weather-condition",
            cells: {
              text: {
                value: String(conditionText),
                shape: "text",
              },
            },
          },
          {
            id: "weather-feels-c",
            cells: {
              text: {
                value: feelsLikeC,
                shape: "text",
              },
            },
          },
          {
            id: "weather-feels-f",
            cells: {
              text: {
                value: feelsLikeF,
                shape: "text",
              },
            },
          },
          {
            id: "weather-humidity",
            cells: {
              text: {
                value: humidity,
                shape: "text",
              },
            },
          },
          {
            id: "weather-wind-speed",
            cells: {
              text: {
                value: windSpeed,
                shape: "text",
              },
            },
          },
          {
            id: "weather-wind-dir",
            cells: {
              text: {
                value: windDir,
                shape: "text",
              },
            },
          },
        ],
      };

      const article = framework.data.article;
      const builder = article.builder.create({
        id: "weather-article",
        title: `Weather for ${fullLocation}`,
      });

      builder.addSectionWithLeaf({
        sectionId: "weather-section",
        sectionTitle: "Current conditions",
        layout: "hero-top",
        leaf: article.shapes.card({
          id: "weather-card",
          dataset: weatherDataset,
          layout: "weather",
        }),
      });

      const articleDataset = builder.getDataset();

      return {
        type: "article",
        content: summary,
        dataset: articleDataset,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "Unknown");
      return {
        type: "text",
        content: `Error fetching weather data: ${message}. Please try again.`,
      };
    }
  };

  return {
    type: "function",
    function: {
      name: "get_weather",
      description:
        "Get real-time weather information for a city or location. Returns temperature, conditions, humidity, and wind speed.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description:
              "City name or generic location (e.g. 'London', 'New York', 'Tokyo').",
          },
        },
        required: ["location"],
      },
      execute,
    },
  };
};
