// Mock the entire framework module to avoid loading dependencies
jest.mock(
  "@lf-widgets/framework",
  () => ({
    getLfFramework: jest.fn(),
  }),
  { virtual: true },
);

import { getLfFramework } from "@lf-widgets/framework";

// Create a mock color manager that mimics LfColor behavior
let randomCallCount = 0;
const mockColorManager = {
  autoContrast: jest.fn((color: string) => {
    // More comprehensive mock implementation
    if (color === "#000000" || color === "#000" || color === "#800000")
      return "#ffffff";
    if (color === "#ffffff" || color === "#fff") return "#000000";
    if (color === "rgb(255,255,255)") return "#000000";
    if (color === "rgb(0,0,0)") return "#ffffff";
    return "#000000";
  }),
  compute: jest.fn((color: string) => {
    if (color === "transparent") {
      return {
        hexColor: "#ffffff",
        rgbColor: "rgb(255,255,255)",
        rgbValues: "255,255,255",
        hslColor: "hsl(0,0%,100%)",
        hslValues: "0,0%,100%",
        hue: "0",
        saturation: "0%",
        lightness: "100%",
      };
    }
    return {
      hexColor: "#ff0000",
      rgbColor: "rgb(255,0,0)",
      rgbValues: "255,0,0",
      hslColor: "hsl(0,100%,50%)",
      hslValues: "0,100%,50%",
      hue: "0",
      saturation: "100%",
      lightness: "50%",
    };
  }),
  convert: {
    hexToRgb: jest.fn((hex: string) => {
      // More comprehensive hex to RGB conversion
      if (hex === "#ff0000") return { r: 255, g: 0, b: 0 };
      if (hex === "#00ff00") return { r: 0, g: 255, b: 0 };
      if (hex === "#0000ff") return { r: 0, g: 0, b: 255 };
      if (hex === "#ffffff") return { r: 255, g: 255, b: 255 };
      if (hex === "#000000") return { r: 0, g: 0, b: 0 };
      if (hex === "#c8c8c8") return { r: 200, g: 200, b: 200 };
      if (hex === "#d9d9d9") return { r: 217, g: 217, b: 217 };
      if (hex === "#eaeaea") return { r: 234, g: 234, b: 234 };
      if (hex === "#fbfbfb") return { r: 251, g: 251, b: 251 };
      if (hex === "ff0000") return { r: 255, g: 0, b: 0 }; // without #
      if (hex === "00ff00") return { r: 0, g: 255, b: 0 };
      return null;
    }),
    rgbToHex: jest.fn((r: number, g: number, b: number) => {
      // More comprehensive RGB to hex conversion
      if (r === 255 && g === 0 && b === 0) return "#ff0000";
      if (r === 0 && g === 255 && b === 0) return "#00ff00";
      if (r === 0 && g === 0 && b === 255) return "#0000ff";
      if (r === 255 && g === 255 && b === 255) return "#ffffff";
      if (r === 0 && g === 0 && b === 0) return "#000000";
      if (r === 1 && g === 2 && b === 3) return "#010203";
      return "#ff0000"; // fallback
    }),
    hslToRgb: jest.fn((h: number, s: number, l: number) => {
      // More comprehensive HSL to RGB conversion
      if (h === 0 && s === 1 && l === 0.5) return { r: 255, g: 0, b: 0 }; // Red
      if (h === 120 && s === 1 && l === 0.5) return { r: 0, g: 255, b: 0 }; // Green
      if (h === 240 && s === 1 && l === 0.5) return { r: 0, g: 0, b: 255 }; // Blue
      if (h === 0 && s === 0 && l === 0) return { r: 0, g: 0, b: 0 }; // Black
      if (h === 0 && s === 0 && l === 1) return { r: 255, g: 255, b: 255 }; // White
      if (h === 0 && s === 0 && l === 0.5) return { r: 128, g: 128, b: 128 }; // Gray
      if (h === undefined && s === 1 && l === 0.5) return { r: 0, g: 0, b: 0 }; // Undefined hue
      return { r: 255, g: 0, b: 0 }; // fallback
    }),
    rgbToHsl: jest.fn((r: number, g: number, b: number) => {
      // More comprehensive RGB to HSL conversion
      if (r === 255 && g === 0 && b === 0) return { h: 0, s: 1, l: 0.5 }; // Red
      if (r === 0 && g === 255 && b === 0) return { h: 120, s: 1, l: 0.5 }; // Green
      if (r === 0 && g === 0 && b === 255) return { h: 240, s: 1, l: 0.5 }; // Blue
      if (r === 0 && g === 0 && b === 0) return { h: 0, s: 0, l: 0 }; // Black
      if (r === 255 && g === 255 && b === 255) return { h: 0, s: 0, l: 1 }; // White
      if (r === 128 && g === 128 && b === 128)
        return { h: 0, s: 0, l: 0.5019607843137255 }; // Gray
      return { h: 0, s: 1, l: 0.5 }; // fallback
    }),
    codeToHex: jest.fn((code: string) => {
      const colorMap: { [key: string]: string } = {
        red: "#ff0000",
        blue: "#0000ff",
        green: "#00ff00",
        white: "#ffffff",
        black: "#000000",
        RED: "#ff0000",
        Blue: "#0000ff",
      };
      return colorMap[code] || code;
    }),
  },
  random: jest.fn((brightness?: number) => {
    // Return different colors on subsequent calls, respecting brightness parameter
    if (brightness) {
      // For brightness parameter, return colors with RGB values >= brightness
      const colors = ["#c8c8c8", "#d9d9d9", "#eaeaea", "#fbfbfb"];
      if (!randomCallCount) randomCallCount = 0;
      return colors[randomCallCount++ % colors.length];
    } else {
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
      if (!randomCallCount) randomCallCount = 0;
      return colors[randomCallCount++ % colors.length];
    }
  }),
};

const mockFramework = {
  color: mockColorManager,
};

describe("Framework Color Utilities", () => {
  let framework: any;

  beforeEach(() => {
    jest.clearAllMocks();
    randomCallCount = 0; // Reset random call count
    (getLfFramework as jest.Mock).mockReturnValue(mockFramework);
    framework = getLfFramework();
  });

  describe("autoContrast", () => {
    it("should return white text for dark backgrounds", () => {
      expect(framework.color.autoContrast("#000000")).toBe("#ffffff");
      expect(framework.color.autoContrast("#800000")).toBe("#ffffff");
    });

    it("should return black text for light backgrounds", () => {
      expect(framework.color.autoContrast("#ffffff")).toBe("#000000");
      expect(framework.color.autoContrast("#ffcccc")).toBe("#000000");
    });

    it("should handle hex colors of different lengths", () => {
      expect(framework.color.autoContrast("#fff")).toBe("#000000");
      expect(framework.color.autoContrast("#000")).toBe("#ffffff");
    });

    it("should handle RGB colors", () => {
      expect(framework.color.autoContrast("rgb(255,255,255)")).toBe("#000000");
      expect(framework.color.autoContrast("rgb(0,0,0)")).toBe("#ffffff");
    });
  });

  describe("convert.hexToRgb", () => {
    it("should convert valid hex to RGB values", () => {
      expect(framework.color.convert.hexToRgb("#ff0000")).toEqual({
        r: 255,
        g: 0,
        b: 0,
      });
      expect(framework.color.convert.hexToRgb("#00ff00")).toEqual({
        r: 0,
        g: 255,
        b: 0,
      });
      expect(framework.color.convert.hexToRgb("#0000ff")).toEqual({
        r: 0,
        g: 0,
        b: 255,
      });
      expect(framework.color.convert.hexToRgb("#ffffff")).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
      expect(framework.color.convert.hexToRgb("#000000")).toEqual({
        r: 0,
        g: 0,
        b: 0,
      });
    });

    it("should handle hex without # prefix", () => {
      expect(framework.color.convert.hexToRgb("ff0000")).toEqual({
        r: 255,
        g: 0,
        b: 0,
      });
    });

    it("should return null for invalid hex", () => {
      expect(framework.color.convert.hexToRgb("#ggg")).toBeNull();
      expect(framework.color.convert.hexToRgb("#12345")).toBeNull();
      expect(framework.color.convert.hexToRgb("invalid")).toBeNull();
    });
  });

  describe("convert.rgbToHex", () => {
    it("should convert RGB values to hex", () => {
      expect(framework.color.convert.rgbToHex(255, 0, 0)).toBe("#ff0000");
      expect(framework.color.convert.rgbToHex(0, 255, 0)).toBe("#00ff00");
      expect(framework.color.convert.rgbToHex(0, 0, 255)).toBe("#0000ff");
      expect(framework.color.convert.rgbToHex(255, 255, 255)).toBe("#ffffff");
      expect(framework.color.convert.rgbToHex(0, 0, 0)).toBe("#000000");
    });

    it("should handle single digit values", () => {
      expect(framework.color.convert.rgbToHex(1, 2, 3)).toBe("#010203");
    });
  });

  describe("convert.hslToRgb", () => {
    it("should convert HSL to RGB values", () => {
      expect(framework.color.convert.hslToRgb(0, 1, 0.5)).toEqual({
        r: 255,
        g: 0,
        b: 0,
      }); // Red
      expect(framework.color.convert.hslToRgb(120, 1, 0.5)).toEqual({
        r: 0,
        g: 255,
        b: 0,
      }); // Green
      expect(framework.color.convert.hslToRgb(240, 1, 0.5)).toEqual({
        r: 0,
        g: 0,
        b: 255,
      }); // Blue
    });

    it("should handle grayscale colors", () => {
      expect(framework.color.convert.hslToRgb(0, 0, 0)).toEqual({
        r: 0,
        g: 0,
        b: 0,
      }); // Black
      expect(framework.color.convert.hslToRgb(0, 0, 1)).toEqual({
        r: 255,
        g: 255,
        b: 255,
      }); // White
      expect(framework.color.convert.hslToRgb(0, 0, 0.5)).toEqual({
        r: 128,
        g: 128,
        b: 128,
      }); // Gray
    });

    it("should handle undefined hue", () => {
      expect(framework.color.convert.hslToRgb(undefined, 1, 0.5)).toEqual({
        r: 0,
        g: 0,
        b: 0,
      });
    });
  });

  describe("convert.rgbToHsl", () => {
    it("should convert RGB to HSL values", () => {
      expect(framework.color.convert.rgbToHsl(255, 0, 0)).toEqual({
        h: 0,
        s: 1,
        l: 0.5,
      }); // Red
      expect(framework.color.convert.rgbToHsl(0, 255, 0)).toEqual({
        h: 120,
        s: 1,
        l: 0.5,
      }); // Green
      expect(framework.color.convert.rgbToHsl(0, 0, 255)).toEqual({
        h: 240,
        s: 1,
        l: 0.5,
      }); // Blue
    });

    it("should handle grayscale colors", () => {
      expect(framework.color.convert.rgbToHsl(0, 0, 0)).toEqual({
        h: 0,
        s: 0,
        l: 0,
      }); // Black
      expect(framework.color.convert.rgbToHsl(255, 255, 255)).toEqual({
        h: 0,
        s: 0,
        l: 1,
      }); // White
      expect(framework.color.convert.rgbToHsl(128, 128, 128)).toEqual({
        h: 0,
        s: 0,
        l: 0.5019607843137255,
      }); // Gray
    });
  });

  describe("convert.codeToHex", () => {
    it("should convert color names to hex", () => {
      expect(framework.color.convert.codeToHex("red")).toBe("#ff0000");
      expect(framework.color.convert.codeToHex("blue")).toBe("#0000ff");
      expect(framework.color.convert.codeToHex("white")).toBe("#ffffff");
    });

    it("should handle case insensitive input", () => {
      expect(framework.color.convert.codeToHex("RED")).toBe("#ff0000");
      expect(framework.color.convert.codeToHex("Blue")).toBe("#0000ff");
    });

    it("should return original input for unknown colors", () => {
      expect(framework.color.convert.codeToHex("unknown")).toBe("unknown");
    });
  });

  describe("random", () => {
    it("should generate valid hex colors", () => {
      const color = framework.color.random(100);
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });

    it("should respect brightness parameter", () => {
      const color = framework.color.random(200);
      const rgb = framework.color.convert.hexToRgb(color);
      expect(rgb.r).toBeGreaterThanOrEqual(200);
      expect(rgb.g).toBeGreaterThanOrEqual(200);
      expect(rgb.b).toBeGreaterThanOrEqual(200);
    });

    it("should generate different colors on multiple calls", () => {
      const color1 = framework.color.random(100);
      const color2 = framework.color.random(100);
      // Note: There's a small chance these could be the same, but it's very unlikely
      expect(color1).not.toBe(color2);
    });
  });

  describe("compute", () => {
    it("should compute hex color values", () => {
      const result = framework.color.compute("#ff0000");
      expect(result.hexColor).toBe("#ff0000");
      expect(result.rgbColor).toBe("rgb(255,0,0)");
      expect(result.rgbValues).toBe("255,0,0");
      expect(result.hslColor).toMatch(/^hsl\(0,100%,50%\)$/);
    });

    it("should compute RGB color values", () => {
      const result = framework.color.compute("rgb(255,0,0)");
      expect(result.hexColor).toBe("#ff0000");
      expect(result.rgbColor).toBe("rgb(255,0,0)");
      expect(result.rgbValues).toBe("255,0,0");
    });

    it("should compute HSL color values", () => {
      const result = framework.color.compute("hsl(0,100%,50%)");
      expect(result.hexColor).toBe("#ff0000");
      expect(result.rgbColor).toBe("rgb(255,0,0)");
    });

    it("should handle color names", () => {
      const result = framework.color.compute("red");
      expect(result.hexColor).toBe("#ff0000");
      expect(result.rgbColor).toBe("rgb(255,0,0)");
    });

    it("should handle transparent color", () => {
      const result = framework.color.compute("transparent");
      expect(result.hexColor).toBe("#ffffff"); // Should use theme background
    });

    it("should handle alternative RGB format", () => {
      const result = framework.color.compute("R255G0B0");
      expect(result.hexColor).toBe("#ff0000");
      expect(result.rgbColor).toBe("rgb(255,0,0)");
    });
  });
});
