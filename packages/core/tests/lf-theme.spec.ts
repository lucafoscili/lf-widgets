// Mock the entire framework module to avoid loading dependencies
jest.mock("@lf-widgets/framework", () => ({
  getLfFramework: jest.fn(),
}));

import { GLOBAL_STYLES } from "@lf-widgets/foundations";
import { execFileSync } from "child_process";
import { join } from "path";
import { createMockFramework } from "./mocks";

describe("Framework Theme Utilities", () => {
  let framework: any; // Type limitations with jest.Mocked<LfFrameworkInterface>

  beforeEach(() => {
    framework = createMockFramework();
  });

  describe("bemClass", () => {
    it("should generate BEM class names", () => {
      framework.theme.bemClass.mockReturnValue(
        "button__icon button__icon--large",
      );

      const result = framework.theme.bemClass("button", "icon", {
        large: true,
      });

      expect(framework.theme.bemClass).toHaveBeenCalledWith("button", "icon", {
        large: true,
      });
      expect(result).toBe("button__icon button__icon--large");
    });
  });

  describe("get.current", () => {
    it("should return current theme information", () => {
      const mockTheme = {
        name: "dark",
        isDark: true,
        variables: {},
        customStyles: {},
        font: [] as string[],
      };
      framework.theme.get.current.mockReturnValue(mockTheme);

      const result = framework.theme.get.current();

      expect(framework.theme.get.current).toHaveBeenCalled();
      expect(result).toEqual(mockTheme);
    });
  });

  describe("get.sprite", () => {
    describe("path", () => {
      it("should return sprite path", () => {
        framework.theme.get.sprite.path.mockReturnValue(
          "/assets/svg/sprite.svg",
        );

        const result = framework.theme.get.sprite.path();

        expect(framework.theme.get.sprite.path).toHaveBeenCalled();
        expect(result).toBe("/assets/svg/sprite.svg");
      });
    });

    describe("ids", () => {
      it("should return sprite IDs", async () => {
        const mockIds = new Set(["icon1", "icon2"]);
        framework.theme.get.sprite.ids.mockResolvedValue(mockIds);

        const result = await framework.theme.get.sprite.ids();

        expect(framework.theme.get.sprite.ids).toHaveBeenCalled();
        expect(result).toEqual(mockIds);
      });
    });

    describe("hasIcon", () => {
      it("should check if icon exists", async () => {
        framework.theme.get.sprite.hasIcon.mockResolvedValue(true);

        const result = await framework.theme.get.sprite.hasIcon("test-icon");

        expect(framework.theme.get.sprite.hasIcon).toHaveBeenCalledWith(
          "test-icon",
        );
        expect(result).toBe(true);
      });
    });
  });

  describe("get.icon", () => {
    it("should return icon by name", () => {
      framework.theme.get.icon.mockReturnValue("icon-data");

      const result = framework.theme.get.icon("colorSwatch");

      expect(framework.theme.get.icon).toHaveBeenCalledWith("colorSwatch");
      expect(result).toBe("icon-data");
    });
  });

  describe("get.icons", () => {
    it("should return all icons", () => {
      const mockIcons = { colorSwatch: "data", close: "data" };
      framework.theme.get.icons.mockReturnValue(mockIcons);

      const result = framework.theme.get.icons();

      expect(framework.theme.get.icons).toHaveBeenCalled();
      expect(result).toEqual(mockIcons);
    });
  });

  describe("get.themes", () => {
    it("should return themes as array and dataset", () => {
      const mockThemes = {
        asArray: ["dark", "light"],
        asDataset: { nodes: [] as any[] },
      };
      framework.theme.get.themes.mockReturnValue(mockThemes);

      const result = framework.theme.get.themes();

      expect(framework.theme.get.themes).toHaveBeenCalled();
      expect(result).toEqual(mockThemes);
    });
  });

  describe("set", () => {
    it("should set theme", () => {
      framework.theme.set("light");

      expect(framework.theme.set).toHaveBeenCalledWith("light");
    });

    it("should set theme with custom list", () => {
      const customList = {};
      framework.theme.set("custom", customList);

      expect(framework.theme.set).toHaveBeenCalledWith("custom", customList);
    });
  });

  describe("refresh", () => {
    it("should refresh theme", () => {
      framework.theme.refresh();

      expect(framework.theme.refresh).toHaveBeenCalled();
    });
  });

  describe("setLfStyle", () => {
    it("should set component styles", () => {
      const mockComponent = {};
      framework.theme.setLfStyle.mockReturnValue("color: red;");

      const result = framework.theme.setLfStyle(mockComponent);

      expect(framework.theme.setLfStyle).toHaveBeenCalledWith(mockComponent);
      expect(result).toBe("color: red;");
    });
  });

  describe("randomize", () => {
    it("should randomize theme", () => {
      framework.theme.randomize();

      expect(framework.theme.randomize).toHaveBeenCalled();
    });
  });

  describe("register", () => {
    it("should register component", () => {
      const mockComponent = {};

      framework.theme.register(mockComponent);

      expect(framework.theme.register).toHaveBeenCalledWith(mockComponent);
    });
  });

  describe("unregister", () => {
    it("should unregister component", () => {
      const mockComponent = {};

      framework.theme.unregister(mockComponent);

      expect(framework.theme.unregister).toHaveBeenCalledWith(mockComponent);
    });
  });

  describe("global styles", () => {
    it("includes responsive portal sizing for compact viewports", () => {
      const stylesByAtRule = GLOBAL_STYLES as unknown as Record<
        string,
        Record<string, Record<string, string>>
      >;

      const mobilePortal = stylesByAtRule["@media (max-width: 600px)"];

      expect(mobilePortal).toBeDefined();
      expect(mobilePortal[".lf-portal [data-lf=portal]"]).toMatchObject({
        "max-height": "80dvh",
        "max-width": "90dvw",
      });
    });
  });

  describe("global styles generation", () => {
    it("keeps the generated constants in sync with the SCSS source", () => {
      const scssPath = join(__dirname, "../src/style/global.scss");
      const scriptPath = join(
        __dirname,
        "../src/scripts/generate-global-styles.js",
      );

      const output = execFileSync(
        "node",
        [scriptPath, "--json", `--input=${scssPath}`],
        { encoding: "utf8" },
      );

      const generated = JSON.parse(output) as Record<string, unknown>;

      expect(generated).toEqual(GLOBAL_STYLES);
    });
  });
});
