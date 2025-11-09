import { getLfFramework } from "@lf-widgets/framework";
import type { LfFrameworkInterface } from "@lf-widgets/foundations";

describe("Framework Core Implementation", () => {
  let framework: LfFrameworkInterface;

  beforeAll(async () => {
    framework = await getLfFramework();
  });

  describe("assets", () => {
    describe("get", () => {
      it("should get asset path", () => {
        const assetName = "icon.svg";
        const result = framework.assets.get(assetName);

        expect(result).toHaveProperty("path");
        expect(result).toHaveProperty("style");
        expect(typeof result.path).toBe("string");
        expect(result.style).toHaveProperty("mask");
        expect(result.style).toHaveProperty("webkitMask");
      });

      it("should get asset path with module", () => {
        const assetName = "icon.svg";
        const module = "lf-core";
        const result = framework.assets.get(assetName, module as any);

        expect(result).toHaveProperty("path");
        expect(result).toHaveProperty("style");
      });

      it("should cache asset results", () => {
        const assetName = "test-icon.svg";
        const result1 = framework.assets.get(assetName);
        const result2 = framework.assets.get(assetName);

        expect(result1).toBe(result2); // Same cached object
      });
    });

    describe("set", () => {
      it("should set asset path for all modules", () => {
        const assetPath = "/custom/assets/";
        framework.assets.set(assetPath);

        // Verify by getting an asset
        const result = framework.assets.get("test.svg");
        expect(result.path).toContain(assetPath);
      });

      it("should set asset path for specific module", () => {
        const assetPath = "/module/assets/";
        const module = "lf-core";

        expect(() => {
          framework.assets.set(assetPath, module);
        }).not.toThrow();
      });
    });
  });

  describe("data", () => {
    describe("cell", () => {
      describe("stringify", () => {
        it("should stringify cell value", () => {
          const cellValue = 42;
          const result = framework.data.cell.stringify(cellValue);

          expect(typeof result).toBe("string");
          expect(result).toBe("42");
        });

        it("should stringify string value", () => {
          const cellValue = "test";
          const result = framework.data.cell.stringify(cellValue);

          expect(result).toBe("test");
        });

        it("should stringify null/undefined values", () => {
          expect(framework.data.cell.stringify(null)).toBe("null");
          expect(framework.data.cell.stringify(undefined)).toBe("undefined");
        });
      });

      describe("shapes", () => {
        describe("get", () => {
          it("should get shape for cell", () => {
            const mockCell = { value: "test", shape: "text" as const };
            const result = framework.data.cell.shapes.get(mockCell as any);

            expect(result).toHaveProperty("lfValue");
            expect((result as any).lfValue).toBe("test");
          });
        });

        describe("getAll", () => {
          it("should get all shapes for dataset", () => {
            const mockDataset = {
              nodes: [
                {
                  cells: {
                    test: { value: "value", shape: "text" as const },
                  },
                },
              ],
              columns: [{ id: "test" }],
            } as any;

            const result = framework.data.cell.shapes.getAll(mockDataset);

            expect(typeof result).toBe("object");
            expect(result).toHaveProperty("text");
            expect(Array.isArray(result.text)).toBe(true);
          });
        });
      });
    });

    describe("node", () => {
      describe("traverseVisible", () => {
        it("should traverse visible nodes", () => {
          const mockNodes = [
            { id: "1", value: "Node 1" },
            {
              id: "2",
              value: "Node 2",
              children: [{ id: "2.1", value: "Child" }],
            },
          ] as any;
          const options = {
            isExpanded: () => true,
            isHidden: () => false,
            isSelected: () => false,
          };

          const result = framework.data.node.traverseVisible(
            mockNodes,
            options,
          );

          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("theme", () => {
    describe("register", () => {
      it("should register component with theme", () => {
        const mockComponent = { tagName: "LF-TEST" } as any;

        expect(() => {
          framework.theme.register(mockComponent);
        }).not.toThrow();
      });
    });

    describe("unregister", () => {
      it("should unregister component from theme", () => {
        const mockComponent = { tagName: "LF-TEST" } as any;

        expect(() => {
          framework.theme.unregister(mockComponent);
        }).not.toThrow();
      });
    });

    describe("bemClass", () => {
      it("should generate BEM class", () => {
        const block = "button";
        const element = "icon";
        const modifiers = { primary: true, large: true } as any;

        const result = framework.theme.bemClass(block, element, modifiers);

        expect(typeof result).toBe("string");
        expect(result).toContain("button__icon");
        expect(result).toContain("button__icon--primary");
        expect(result).toContain("button__icon--large");
      });

      it("should generate BEM class without element", () => {
        const block = "button";
        const modifiers = { primary: true } as any;

        const result = framework.theme.bemClass(block, undefined, modifiers);

        expect(typeof result).toBe("string");
        expect(result).toContain("button");
        expect(result).toContain("button--primary");
      });
    });

    describe("get", () => {
      describe("current", () => {
        it("should get current theme", () => {
          const result = framework.theme.get.current();

          expect(result).toHaveProperty("name");
          expect(typeof result.name).toBe("string");
        });
      });

      describe("icon", () => {
        it("should get icon", () => {
          const iconName = "check";
          const result = framework.theme.get.icon(iconName as any);

          expect(typeof result).toBe("string");
        });
      });

      describe("icons", () => {
        it("should get all icons", async () => {
          const result = framework.theme.get.icons();

          expect(typeof result).toBe("object");
          expect(result).toHaveProperty("check");
        });
      });

      describe("sprite", () => {
        describe("path", () => {
          it("should get sprite path", () => {
            const result = framework.theme.get.sprite.path();

            expect(typeof result).toBe("string");
          });
        });

        describe("ids", () => {
          it("should get sprite ids", async () => {
            const result = await framework.theme.get.sprite.ids();

            expect(result).toBeInstanceOf(Set);
          });
        });

        describe("hasIcon", () => {
          it("should check if sprite has icon", async () => {
            const result = await framework.theme.get.sprite.hasIcon("check");

            expect(typeof result).toBe("boolean");
          });
        });
      });

      describe("themes", () => {
        it("should get themes", () => {
          const result = framework.theme.get.themes();

          expect(result).toHaveProperty("asArray");
          expect(result).toHaveProperty("asDataset");
          expect(Array.isArray(result.asArray)).toBe(true);
          expect(result.asArray.length).toBeGreaterThan(0);
        });
      });
    });

    describe("set", () => {
      it("should set theme", () => {
        const themeName = "dark";

        expect(() => {
          framework.theme.set(themeName);
        }).not.toThrow();
      });
    });

    describe("refresh", () => {
      it("should refresh theme", () => {
        expect(() => {
          framework.theme.refresh();
        }).not.toThrow();
      });
    });

    describe("setLfStyle", () => {
      it("should set LF style", () => {
        const mockComponent = {
          tagName: "LF-TEST",
          rootElement: document.createElement("div"),
        } as any;

        expect(() => {
          framework.theme.setLfStyle(mockComponent);
        }).not.toThrow();
      });
    });

    describe("randomize", () => {
      it("should randomize theme", () => {
        expect(() => {
          framework.theme.randomize();
        }).not.toThrow();
      });
    });
  });
});

describe("LfFramework Core Methods", () => {
  let framework: LfFrameworkInterface;

  beforeAll(async () => {
    framework = await getLfFramework();
  });

  describe("addClickCallback", () => {
    it("should add click callback synchronously", () => {
      const callback = { cb: jest.fn() };

      expect(() => {
        framework.addClickCallback(callback);
      }).not.toThrow();

      expect(framework.utilities.clickCallbacks?.has(callback)).toBe(true);
    });

    it("should add click callback asynchronously", () => {
      const callback = { cb: jest.fn() };

      expect(() => {
        framework.addClickCallback(callback, true);
      }).not.toThrow();

      // Wait for next tick
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(framework.utilities.clickCallbacks?.has(callback)).toBe(true);
          resolve(void 0);
        }, 0);
      });
    });
  });

  describe("removeClickCallback", () => {
    it("should remove click callback", () => {
      const callback = { cb: jest.fn() };
      framework.addClickCallback(callback);

      expect(framework.utilities.clickCallbacks?.has(callback)).toBe(true);

      framework.removeClickCallback(callback);

      expect(framework.utilities.clickCallbacks?.has(callback)).toBe(false);
    });
  });

  describe("assignRef", () => {
    it("should assign element reference", () => {
      const refs = {} as Record<string, HTMLElement>;
      const element = document.createElement("div");
      const assignFn = framework.assignRef(refs, "testRef");

      assignFn(element);

      expect(refs.testRef).toBe(element);
    });

    it("should not assign null element", () => {
      const refs = {} as Record<string, HTMLElement>;
      const assignFn = framework.assignRef(refs, "testRef");

      assignFn(null as any);

      expect(refs.testRef).toBeUndefined();
    });
  });

  describe("getModules", () => {
    it("should return modules map", () => {
      const modules = framework.getModules();

      expect(modules).toBeInstanceOf(Map);
      expect(modules.has("lf-framework")).toBe(true);
    });
  });

  describe("sanitizeProps", () => {
    it("should sanitize basic props", () => {
      const props = {
        class: "test-class",
        id: "test-id",
        onclick: "alert('xss')", // Should be removed
        "data-test": "allowed",
        "aria-label": "allowed",
      };

      const result = framework.sanitizeProps(props);

      expect(result.class).toBe("test-class");
      expect(result.id).toBe("test-id");
      expect(result["data-test"]).toBe("allowed");
      expect(result["aria-label"]).toBe("allowed");
      expect(result.onclick).toBeUndefined();
    });

    it("should filter malicious content", () => {
      const props = {
        href: "javascript:alert('xss')",
        content: "<script>alert('xss')</script>",
        title: "normal-text", // This should be allowed
      };

      const result = framework.sanitizeProps(props);

      expect(result.href).toBeUndefined();
      expect(result.content).toBeUndefined();
      expect(result.title).toBe("normal-text");
    });

    it("should allow component-specific props", () => {
      const props = {
        lfValue: true,
        lfLabel: "test-label",
      } as any;

      const result = framework.sanitizeProps(props, "LfButton");

      expect(result.lfValue).toBe(true);
      expect(result.lfLabel).toBe("test-label");
    });
  });

  describe("shapes", () => {
    it("should get and set shapes", () => {
      const testShapes = { testShape: "value" } as any;

      framework.shapes.set(testShapes);
      const result = framework.shapes.get();

      expect(result).toBe(testShapes);
    });
  });
});
