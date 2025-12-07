import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfShapeeditorConfigDsl,
  LfShapeeditorElement,
  LfShapeeditorEventPayload,
  LfShapeeditorLoadCallback,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";
import {
  NEON_GLOW_EFFECT,
  RIPPLE_EFFECT,
  SPOTLIGHT_EFFECT,
  TILT_EFFECT,
} from "./effects";

const COMPONENT_NAME: LfComponentName = "LfShapeeditor";
const EVENT_NAME: LfEventName<"LfShapeeditor"> = "lf-shapeeditor-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfShapeeditor"> =
  "LfShapeeditorEventPayload";
const TAG_NAME: LfComponentTag<"LfShapeeditor"> = "lf-shapeeditor";

export const getShapeeditorFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-shapeeditor"> => {
  const { get } = framework.assets;

  const spotlightDsl: LfShapeeditorConfigDsl = {
    controls: SPOTLIGHT_EFFECT.controls,
    layout: [
      {
        id: "beam",
        label: "Beam",
        controlIds: ["beam", "color", "angle", "intensity", "originX"],
      },
      {
        id: "surface",
        label: "Surface",
        controlIds: ["surfaceGlow", "surfaceGlowIntensity"],
      },
      {
        id: "behaviour",
        label: "Behaviour",
        controlIds: ["followPointer", "sway", "swayAmplitude", "swayDuration"],
      },
      {
        id: "trigger",
        label: "Trigger & Timing",
        controlIds: ["trigger", "fadeInDuration", "fadeOutDuration"],
      },
    ],
    defaultSettings: SPOTLIGHT_EFFECT.defaultSettings,
  };

  const neonGlowDsl: LfShapeeditorConfigDsl = {
    controls: NEON_GLOW_EFFECT.controls,
    layout: [
      {
        id: "appearance",
        label: "Appearance",
        controlIds: ["mode", "intensity", "pulseSpeed", "desync"],
      },
      {
        id: "reflection",
        label: "Reflection",
        controlIds: [
          "reflection",
          "reflectionOpacity",
          "reflectionBlur",
          "reflectionOffset",
        ],
      },
    ],
    defaultSettings: NEON_GLOW_EFFECT.defaultSettings,
  };

  const tiltDsl: LfShapeeditorConfigDsl = {
    controls: TILT_EFFECT.controls,
    layout: [
      {
        id: "tilt",
        label: "Tilt Settings",
        controlIds: ["intensity"],
      },
    ],
    defaultSettings: TILT_EFFECT.defaultSettings,
  };

  const rippleDsl: LfShapeeditorConfigDsl = {
    controls: RIPPLE_EFFECT.controls,
    layout: [
      {
        id: "animation",
        label: "Animation",
        controlIds: ["duration", "scale"],
      },
      {
        id: "shape",
        label: "Shape",
        controlIds: ["autoSurfaceRadius", "borderRadius"],
      },
    ],
    defaultSettings: RIPPLE_EFFECT.defaultSettings,
  };

  //#region mock data
  //#region Canvas data
  const canvasDataset: LfDataDataset = {
    nodes: [
      {
        cells: {
          lfCanvas: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/avatar_thor_2.png`).path,
            },
            shape: "canvas",
            value: get(`./assets/showcase/avatar_thor_2.png`).path,
          },
        },
        id: "canvas_0",
        value: "Thor Avatar",
      },
      {
        cells: {
          lfCanvas: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/location_forest.png`).path,
            },
            shape: "canvas",
            value: get(`./assets/showcase/location_forest.png`).path,
          },
        },
        id: "canvas_1",
        value: "Forest Scene",
      },
      {
        cells: {
          lfCanvas: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/avatar_freya.png`).path,
            },
            shape: "canvas",
            value: get(`./assets/showcase/avatar_freya.png`).path,
          },
        },
        id: "canvas_2",
        value: "Freya Avatar",
      },
    ],
  };

  const canvasSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "basic_adjustments",
        value: "Basic Adjustments",
        icon: "settings",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value: JSON.stringify(spotlightDsl),
              },
            },
            id: "clarity",
            value: "Clarity",
          },
        ],
      },
      {
        id: "creative_effects",
        value: "Creative Effects",
        icon: "palette",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value: "{}",
              },
            },
            id: "vignette",
            value: "Vignette",
          },
        ],
      },
    ],
  };
  //#endregion

  //#region Code data
  const codeDataset: LfDataDataset = {
    nodes: [
      {
        cells: {
          lfCode: {
            lfLanguage: "typescript",
            lfPreserveSpaces: true,
            shape: "code",
            value: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
          },
        },
        id: "code_0",
        value: "TypeScript Interface",
      },
      {
        cells: {
          lfCode: {
            lfLanguage: "python",
            lfPreserveSpaces: true,
            shape: "code",
            value: `import numpy as np
from typing import List

def calculate_statistics(data: List[float]) -> dict:
    """Calculate basic statistics for a dataset."""
    arr = np.array(data)
    return {
        "mean": np.mean(arr),
        "std": np.std(arr),
        "min": np.min(arr),
        "max": np.max(arr)
    }`,
          },
        },
        id: "code_1",
        value: "Python Statistics",
      },
      {
        cells: {
          lfCode: {
            lfLanguage: "css",
            lfPreserveSpaces: true,
            shape: "code",
            value: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 2rem;
}

.card {
  background: var(--surface-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}`,
          },
        },
        id: "code_2",
        value: "CSS Grid Layout",
      },
    ],
  };

  const codeSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "formatting",
        value: "Formatting",
        icon: "code",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value:
                  '{"toggle":[{"id":"preserve_spaces","title":"Preserve Spaces","defaultValue":true},{"id":"show_line_numbers","title":"Show Line Numbers","defaultValue":true}],"textfield":[{"id":"tab_size","title":"Tab Size","defaultValue":"2"}]}',
              },
            },
            id: "code_style",
            value: "Code Style",
          },
        ],
      },
      {
        id: "syntax",
        value: "Syntax Highlighting",
        icon: "palette",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value:
                  '{"select":[{"id":"theme","title":"Theme","options":["dark","light","monokai","github"],"defaultValue":"dark"}]}',
              },
            },
            id: "theme_settings",
            value: "Theme",
          },
        ],
      },
    ],
  };
  //#endregion

  //#region Chart data
  const chartDataset: LfDataDataset = {
    nodes: [
      {
        cells: {
          lfChart: {
            lfAxis: "x",
            lfDataset: {
              columns: [
                { id: "month", title: "Month" },
                { id: "sales", title: "Sales" },
              ],
              nodes: [
                {
                  id: "jan",
                  cells: {
                    month: { value: "Jan" },
                    sales: { shape: "number", value: 120 },
                  },
                },
                {
                  id: "feb",
                  cells: {
                    month: { value: "Feb" },
                    sales: { shape: "number", value: 190 },
                  },
                },
                {
                  id: "mar",
                  cells: {
                    month: { value: "Mar" },
                    sales: { shape: "number", value: 150 },
                  },
                },
                {
                  id: "apr",
                  cells: {
                    month: { value: "Apr" },
                    sales: { shape: "number", value: 220 },
                  },
                },
                {
                  id: "may",
                  cells: {
                    month: { value: "May" },
                    sales: { shape: "number", value: 280 },
                  },
                },
              ],
            },
            lfSeries: ["sales"],
            lfTypes: ["bar"],
            shape: "chart",
            value: "Monthly Sales",
          },
        },
        id: "chart_0",
        value: "Bar Chart - Sales",
      },
      {
        cells: {
          lfChart: {
            lfAxis: "x",
            lfDataset: {
              columns: [
                { id: "quarter", title: "Quarter" },
                { id: "revenue", title: "Revenue" },
                { id: "expenses", title: "Expenses" },
              ],
              nodes: [
                {
                  id: "q1",
                  cells: {
                    quarter: { value: "Q1" },
                    revenue: { shape: "number", value: 45000 },
                    expenses: { shape: "number", value: 32000 },
                  },
                },
                {
                  id: "q2",
                  cells: {
                    quarter: { value: "Q2" },
                    revenue: { shape: "number", value: 52000 },
                    expenses: { shape: "number", value: 35000 },
                  },
                },
                {
                  id: "q3",
                  cells: {
                    quarter: { value: "Q3" },
                    revenue: { shape: "number", value: 48000 },
                    expenses: { shape: "number", value: 38000 },
                  },
                },
                {
                  id: "q4",
                  cells: {
                    quarter: { value: "Q4" },
                    revenue: { shape: "number", value: 61000 },
                    expenses: { shape: "number", value: 41000 },
                  },
                },
              ],
            },
            lfSeries: ["revenue", "expenses"],
            lfTypes: ["line", "line"],
            shape: "chart",
            value: "Quarterly Financials",
          },
        },
        id: "chart_1",
        value: "Line Chart - Financials",
      },
      {
        cells: {
          lfChart: {
            lfAxis: "x",
            lfDataset: {
              columns: [
                { id: "category", title: "Category" },
                { id: "amount", title: "Amount" },
              ],
              nodes: [
                {
                  id: "cat1",
                  cells: {
                    category: { value: "Product A" },
                    amount: { shape: "number", value: 35 },
                  },
                },
                {
                  id: "cat2",
                  cells: {
                    category: { value: "Product B" },
                    amount: { shape: "number", value: 25 },
                  },
                },
                {
                  id: "cat3",
                  cells: {
                    category: { value: "Product C" },
                    amount: { shape: "number", value: 20 },
                  },
                },
                {
                  id: "cat4",
                  cells: {
                    category: { value: "Product D" },
                    amount: { shape: "number", value: 20 },
                  },
                },
              ],
            },
            lfSeries: ["amount"],
            lfTypes: ["pie"],
            shape: "chart",
            value: "Product Distribution",
          },
        },
        id: "chart_2",
        value: "Pie Chart - Distribution",
      },
    ],
  };

  const chartSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "appearance",
        value: "Appearance",
        icon: "palette",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value:
                  '{"toggle":[{"id":"show_legend","title":"Show Legend","defaultValue":true},{"id":"show_grid","title":"Show Grid","defaultValue":true}],"slider":[{"id":"opacity","title":"Opacity","min":"0","max":"1","step":"0.1","defaultValue":"0.8"}]}',
              },
            },
            id: "chart_style",
            value: "Chart Style",
          },
        ],
      },
      {
        id: "data",
        value: "Data Options",
        icon: "chart-column",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value:
                  '{"toggle":[{"id":"animate","title":"Animate Transitions","defaultValue":true},{"id":"sort_data","title":"Sort Data","defaultValue":false}]}',
              },
            },
            id: "data_handling",
            value: "Data Handling",
          },
        ],
      },
    ],
  };

  const effectsDataset: LfDataDataset = {
    nodes: [
      {
        cells: {
          lfImage: {
            lfValue: get(`./assets/showcase/avatar_thor.png`).path,
            shape: "image",
            value: get(`./assets/showcase/avatar_thor.png`).path,
          },
        },
        id: "spotlight_thor",
        value: "Thor Avatar",
      },
      {
        cells: {
          lfImage: {
            lfValue: get(`./assets/showcase/avatar_freya.png`).path,
            shape: "image",
            value: get(`./assets/showcase/avatar_freya.png`).path,
          },
        },
        id: "spotlight_freya",
        value: "Freya Avatar",
      },
      {
        cells: {
          lfImage: {
            lfValue: get(`./assets/showcase/location_forest.png`).path,
            shape: "image",
            value: get(`./assets/showcase/location_forest.png`).path,
          },
        },
        id: "spotlight_forest",
        value: "Forest Scene",
      },
    ],
  };

  const spotlightSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "spotlight",
        value: "Spotlight Settings",
        icon: "camera",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value: JSON.stringify(spotlightDsl),
              },
            },
            id: "spotlight_config",
            value: "Configuration",
          },
        ],
      },
    ],
  };

  const neonGlowSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "neon_glow",
        value: "Neon Glow Settings",
        icon: "highlight",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value: JSON.stringify(neonGlowDsl),
              },
            },
            id: "neon_config",
            value: "Configuration",
          },
        ],
      },
    ],
  };

  const tiltSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "tilt",
        value: "Tilt Settings",
        icon: "ikosaedr",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value: JSON.stringify(tiltDsl),
              },
            },
            id: "tilt_config",
            value: "Configuration",
          },
        ],
      },
    ],
  };

  const rippleSettingsDataset: LfDataDataset = {
    nodes: [
      {
        id: "ripple",
        value: "Ripple Settings",
        icon: "droplet",
        children: [
          {
            cells: {
              lfCode: {
                shape: "code",
                value: JSON.stringify(rippleDsl),
              },
            },
            id: "ripple_config",
            value: "Configuration",
          },
        ],
      },
    ],
  };

  const data: { [index: string]: LfDataDataset } = {
    canvasDataset,
    canvasSettingsDataset,
    chartDataset,
    chartSettingsDataset,
    codeDataset,
    codeSettingsDataset,
    effectsDataset,
    neonGlowSettingsDataset,
    rippleSettingsDataset,
    spotlightSettingsDataset,
    tiltSettingsDataset,
  };
  //#endregion

  //#region Navigation tree grid
  const navigationTreeGridDataset: LfDataDataset = {
    columns: [
      { id: "name", title: "Name" },
      { id: "items", title: "Items" },
      { id: "updated", title: "Updated" },
    ],
    nodes: [
      {
        id: "projects",
        value: "Projects",
        cells: {
          name: { shape: "text", value: "Projects" },
          items: { shape: "number", value: 12 },
          updated: { shape: "text", value: "2 days ago" },
        },
        children: [
          {
            id: "projects/alpha",
            value: "Project Alpha",
            cells: {
              name: { shape: "text", value: "Project Alpha" },
              items: { shape: "number", value: 5 },
              updated: { shape: "text", value: "Yesterday" },
            },
          },
          {
            id: "projects/beta",
            value: "Project Beta",
            cells: {
              name: { shape: "text", value: "Project Beta" },
              items: { shape: "number", value: 7 },
              updated: { shape: "text", value: "3 days ago" },
            },
          },
        ],
      },
      {
        id: "reviews",
        value: "Reviews",
        cells: {
          name: { shape: "text", value: "Reviews" },
          items: { shape: "number", value: 8 },
          updated: { shape: "text", value: "Today" },
        },
        children: [
          {
            id: "reviews/internal",
            value: "Internal",
            cells: {
              name: { shape: "text", value: "Internal" },
              items: { shape: "number", value: 3 },
              updated: { shape: "text", value: "4 hours ago" },
            },
          },
          {
            id: "reviews/client",
            value: "Client",
            cells: {
              name: { shape: "text", value: "Client" },
              items: { shape: "number", value: 5 },
              updated: { shape: "text", value: "Last week" },
            },
          },
        ],
      },
    ],
  };

  const loadCanvasDataset: LfShapeeditorLoadCallback = async (shapeeditor) => {
    shapeeditor.lfDataset = data.canvasDataset;
  };
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is a universal 4-panel explorer for interactive editing and preview of any LfShape type",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                {
                  value: "Node 1",
                  id: "0",
                  cells: {
                    lfImage: { lfValue: "url_of_image1" },
                  },
                },
                {
                  value: "Node 2",
                  id: "1",
                  cells: {
                    lfImage: { lfValue: "url_of_image2" },
                  },
                },
              ],
            }),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "ready",
                description:
                  "emitted when the component completes its first complete lifecycle",
              },
              {
                type: "unmount",
                description:
                  "emitted when the component is disconnected from the DOM",
              },
            ],
            EVENT_NAME,
          ),
          SECTION_FACTORY.methods(TAG_NAME),
          SECTION_FACTORY.styling(TAG_NAME),
        ],
      },
    ],
  };
  //#endregion

  return {
    documentation,

    examples: {
      //#region Uncategorized
      uncategorized: {
        canvasSimple: {
          description: "Canvas editor for image drawing and manipulation",
          props: {
            lfDataset: data.canvasDataset,
            lfShape: "canvas",
            lfValue: data.canvasSettingsDataset,
          },
        },
        canvasWithNavigation: {
          description: "Canvas editor with navigation tree",
          props: {
            lfDataset: data.canvasDataset,
            lfNavigation: {
              treeProps: {
                lfDataset: navigationTreeGridDataset,
                lfFilter: true,
                lfGrid: true,
              },
            },
            lfShape: "canvas",
            lfValue: data.canvasSettingsDataset,
          },
        },
        codeSimple: {
          description: "Code editor for syntax-highlighted snippets",
          props: {
            lfDataset: data.codeDataset,
            lfShape: "code",
            lfValue: data.codeSettingsDataset,
          },
        },
        codeWithNavigation: {
          description: "Code editor with navigation tree",
          props: {
            lfDataset: data.codeDataset,
            lfNavigation: {
              treeProps: {
                lfDataset: navigationTreeGridDataset,
                lfFilter: true,
                lfGrid: true,
              },
            },
            lfShape: "code",
            lfValue: data.codeSettingsDataset,
          },
        },
        chartSimple: {
          description: "Chart editor for data visualization",
          props: {
            lfDataset: data.chartDataset,
            lfShape: "chart",
            lfValue: data.chartSettingsDataset,
          },
        },
        chartWithNavigation: {
          description: "Chart editor with navigation tree",
          props: {
            lfDataset: data.chartDataset,
            lfNavigation: {
              treeProps: {
                lfDataset: navigationTreeGridDataset,
                lfFilter: true,
                lfGrid: true,
              },
            },
            lfShape: "chart",
            lfValue: data.chartSettingsDataset,
          },
        },
        canvasStyled: {
          description: "Canvas editor with custom styling",
          props: {
            lfDataset: data.canvasDataset,
            lfShape: "canvas",
            lfStyle: randomStyle(),
            lfValue: data.canvasSettingsDataset,
          },
        },
        canvasWithLoadCallback: {
          description: "Canvas editor with load callback (click Load to fetch)",
          props: {
            lfLoadCallback: loadCanvasDataset,
            lfShape: "canvas",
            lfValue: data.canvasSettingsDataset,
          },
        },
        spotlightEffectPlayground: {
          description:
            "Effects playground: Spotlight effect with live preview (hover to see effect)",
          props: {
            lfDataset: data.effectsDataset,
            lfShape: "image",
            lfValue: data.spotlightSettingsDataset,
          },
          events: {
            "lf-shapeeditor-event": async (
              e: CustomEvent<LfShapeeditorEventPayload>,
            ) => {
              const { comp, eventType } = e.detail;
              if (eventType !== "lf-event") return;

              const shapeeditor = comp as unknown as LfShapeeditorElement;
              const components = await shapeeditor.getComponents();
              const settings = await shapeeditor.getSettings();
              const imageEl =
                components.details.shape?.querySelector("lf-image");

              if (!imageEl) return;

              const { effects } = framework;
              effects.unregister.spotlight(imageEl);
              effects.register.spotlight(imageEl, {
                beam: settings.beam as
                  | "cone"
                  | "narrow"
                  | "diffuse"
                  | "soft"
                  | undefined,
                color: settings.color as string | undefined,
                angle: settings.angle as number | undefined,
                intensity: settings.intensity as number | undefined,
                originX: settings.originX as number | undefined,
                surfaceGlow: settings.surfaceGlow as boolean | undefined,
                surfaceGlowIntensity: settings.surfaceGlowIntensity as
                  | number
                  | undefined,
                followPointer: settings.followPointer as boolean | undefined,
                sway: settings.sway as boolean | undefined,
                swayDuration: settings.swayDuration as number | undefined,
                swayAmplitude: settings.swayAmplitude as number | undefined,
                trigger: settings.trigger as
                  | "hover"
                  | "always"
                  | "manual"
                  | undefined,
                fadeInDuration: settings.fadeInDuration as number | undefined,
                fadeOutDuration: settings.fadeOutDuration as number | undefined,
              });
            },
          },
        },
        neonGlowEffectPlayground: {
          description:
            "Effects playground: Neon Glow effect with pulsating border",
          props: {
            lfDataset: data.effectsDataset,
            lfShape: "image",
            lfValue: data.neonGlowSettingsDataset,
          },
          events: {
            "lf-shapeeditor-event": async (
              e: CustomEvent<LfShapeeditorEventPayload>,
            ) => {
              const { comp, eventType } = e.detail;
              if (eventType !== "lf-event") return;

              const shapeeditor = comp as unknown as LfShapeeditorElement;
              const components = await shapeeditor.getComponents();
              const settings = await shapeeditor.getSettings();
              const imageEl =
                components.details.shape?.querySelector("lf-image");

              if (!imageEl) return;

              const { effects } = framework;
              effects.unregister.neonGlow(imageEl);
              effects.register.neonGlow(imageEl, {
                mode: settings.mode as "outline" | "filled" | undefined,
                intensity: settings.intensity as number | undefined,
                pulseSpeed: settings.pulseSpeed as
                  | "burst"
                  | "slow"
                  | "normal"
                  | "fast"
                  | undefined,
                desync: settings.desync as boolean | undefined,
                reflection: settings.reflection as boolean | undefined,
                reflectionOpacity: settings.reflectionOpacity as
                  | number
                  | undefined,
                reflectionBlur: settings.reflectionBlur as number | undefined,
                reflectionOffset: settings.reflectionOffset as
                  | number
                  | undefined,
              });
            },
          },
        },
        tiltEffectPlayground: {
          description:
            "Effects playground: Tilt effect with 3D perspective (move mouse over preview)",
          props: {
            lfDataset: data.effectsDataset,
            lfShape: "image",
            lfValue: data.tiltSettingsDataset,
          },
          events: {
            "lf-shapeeditor-event": async (
              e: CustomEvent<LfShapeeditorEventPayload>,
            ) => {
              const { comp, eventType } = e.detail;
              if (eventType !== "lf-event") return;

              const shapeeditor = comp as unknown as LfShapeeditorElement;
              const components = await shapeeditor.getComponents();
              const settings = await shapeeditor.getSettings();
              const imageEl =
                components.details.shape?.querySelector("lf-image");

              if (!imageEl) return;

              const { effects } = framework;
              effects.unregister.tilt(imageEl);
              effects.register.tilt(
                imageEl,
                settings.intensity as number | undefined,
              );
            },
          },
        },
        rippleEffectPlayground: {
          description:
            "Effects playground: Ripple effect (click on preview to see effect)",
          props: {
            lfDataset: data.effectsDataset,
            lfShape: "image",
            lfValue: data.rippleSettingsDataset,
          },
          events: {
            "lf-shapeeditor-event": async (
              e: CustomEvent<LfShapeeditorEventPayload>,
            ) => {
              const { comp, eventType } = e.detail;
              if (eventType !== "lf-event") return;

              const shapeeditor = comp as unknown as LfShapeeditorElement;
              const components = await shapeeditor.getComponents();
              const settings = await shapeeditor.getSettings();
              const imageEl =
                components.details.shape?.querySelector("lf-image");

              if (!imageEl) return;

              // Ripple effect is registered on the element
              // The effect will trigger on pointerdown events
              const { effects } = framework;
              effects.unregister.ripple(imageEl);
              effects.register.ripple(imageEl, {
                duration: settings.duration as number | undefined,
                scale: settings.scale as number | undefined,
                autoSurfaceRadius: settings.autoSurfaceRadius as
                  | boolean
                  | undefined,
                borderRadius: settings.borderRadius as string | undefined,
              });
            },
          },
        },
      },
      //#endregion
    },
  };
};
