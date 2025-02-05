import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Color";

export const getColorFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "autoContrast",
      {
        code: `const color = '#FF0000';
const textColor = autoContrast(color); // Returns 'black'`,
        description:
          "The `autoContrast` method determines the optimal text color (black/white) for a given background.",
      },
    ],
    [
      "compute",
      {
        code: `const colorValues = compute('#FF0000'); 
// Returns { rgb: { r: 255, g: 0, b: 0 }, hsl: { h: 0, s: 100, l: 50 }, hex: '#FF0000' }`,
        description:
          "The `compute` method converts a color string to its RGB, HSL, and HEX values.",
      },
    ],
    [
      "hexToRgb",
      {
        code: `const rgbColor = hexToRgb('#FF0000'); 
// Returns { r: 255, g: 0, b: 0 }`,
        description: "Converts a hexadecimal color string to RGB values.",
      },
    ],
    [
      "hslToRgb",
      {
        code: `const rgbColor = hslToRgb(0, 1, 0.5); 
// Returns { r: 255, g: 0, b: 0 }`,
        description: "Converts HSL color values to RGB values.",
      },
    ],
    [
      "rgbToHex",
      {
        code: `const hexColor = rgbToHex(255, 0, 0); 
// Returns '#FF0000'`,
        description: "Converts RGB color values to hexadecimal string.",
      },
    ],
    [
      "rgbToHsl",
      {
        code: `const hslValues = rgbToHsl(255, 0, 0); 
// Returns { h: 0, s: 100, l: 50 }`,
        description: "Converts RGB color values to HSL values.",
      },
    ],
    [
      "valueToHex",
      {
        code: `const hexValue = valueToHex(255); 
// Returns 'FF'`,
        description: "Converts a decimal number to a hexadecimal string.",
      },
    ],
    [
      "codeToHex",
      {
        code: `const hexColor = codeToHex('red'); 
// Returns '#FF0000'`,
        description: "Converts a color name to its hexadecimal representation.",
      },
    ],
    [
      "random",
      {
        code: `const brightColor = random(200); 
// Returns something like '#F0E2C8'`,
        description:
          "Generates a random hexadecimal color string with a specified brightness level.",
      },
    ],
  ]);
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: FRAMEWORK_NAME,
        children: [
          {
            id: DOC_IDS.section,
            value: "Overview",
            children: [
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "LfColor",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " takes care of performing color operations for the library.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It provides methods for converting and manipulating color values, as well as determining optimal text colors for given backgrounds.",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
            ],
          },
          {
            id: DOC_IDS.section,
            value: "API",
            children: Array.from(CODE.keys()).map((key) =>
              PARAGRAPH_FACTORY.api(
                key,
                CODE.get(key)?.description ?? "",
                CODE.get(key)?.code ?? "",
              ),
            ),
          },
        ],
      },
    ],
  };
  //#endregion

  return {
    documentation,
  };
};
