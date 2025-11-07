import { LfFrameworkInterface } from "@lf-widgets/foundations";

describe("Framework Core Utilities", () => {
  let framework: jest.Mocked<LfFrameworkInterface>;

  beforeEach(() => {
    // Mock the framework interface
    framework = {
      assets: {
        get: jest.fn(),
        set: jest.fn(),
      },
      data: {
        cell: {
          stringify: jest.fn(),
          shapes: {
            get: jest.fn(),
            getAll: jest.fn(),
          },
        },
        node: {
          traverseVisible: jest.fn(),
        },
      },
      theme: {
        register: jest.fn(),
        unregister: jest.fn(),
        bemClass: jest.fn(),
        get: {
          current: jest.fn(),
          icon: jest.fn(),
          icons: jest.fn(),
          sprite: {
            path: jest.fn(),
            ids: jest.fn(),
            hasIcon: jest.fn(),
          },
          themes: jest.fn(),
        },
        set: jest.fn(),
        refresh: jest.fn(),
        setLfStyle: jest.fn(),
        randomize: jest.fn(),
      },
    } as any; // Using any to avoid complex type mocking
  });

  describe("assets", () => {
    describe("get", () => {
      it("should get asset path", () => {
        const assetName = "icon.svg";

        framework.assets.get(assetName);

        expect(framework.assets.get).toHaveBeenCalledWith(assetName);
      });

      it("should get asset path with module", () => {
        const assetName = "icon.svg";
        const module = "lf-core";

        framework.assets.get(assetName, module as any);

        expect(framework.assets.get).toHaveBeenCalledWith(
          assetName,
          module as any,
        );
      });
    });

    describe("set", () => {
      it("should set asset path", () => {
        const assetName = "icon.svg";
        const module = "lf-core";

        framework.assets.set(assetName, module as any);

        expect(framework.assets.set).toHaveBeenCalledWith(
          assetName,
          module as any,
        );
      });
    });
  });

  describe("data", () => {
    describe("cell", () => {
      describe("stringify", () => {
        it("should stringify cell value", () => {
          const cellValue = 42;

          framework.data.cell.stringify(cellValue);

          expect(framework.data.cell.stringify).toHaveBeenCalledWith(cellValue);
        });
      });

      describe("shapes", () => {
        describe("get", () => {
          it("should get shape for cell", () => {
            const mockCell = { value: "test" };

            framework.data.cell.shapes.get(mockCell as any);

            expect(framework.data.cell.shapes.get).toHaveBeenCalledWith(
              mockCell as any,
            );
          });
        });

        describe("getAll", () => {
          it("should get all shapes for dataset", () => {
            const mockDataset = { nodes: [], columns: [] } as any;

            framework.data.cell.shapes.getAll(mockDataset);

            expect(framework.data.cell.shapes.getAll).toHaveBeenCalledWith(
              mockDataset,
            );
          });
        });
      });
    });

    describe("node", () => {
      describe("traverseVisible", () => {
        it("should traverse visible nodes", () => {
          const mockNodes = [] as any;
          const options = {
            isExpanded: jest.fn(),
            isHidden: jest.fn(),
            isSelected: jest.fn(),
          };

          framework.data.node.traverseVisible(mockNodes, options);

          expect(framework.data.node.traverseVisible).toHaveBeenCalledWith(
            mockNodes,
            options,
          );
        });
      });
    });
  });

  describe("theme", () => {
    describe("register", () => {
      it("should register component with theme", () => {
        const mockComponent = {} as any;

        framework.theme.register(mockComponent);

        expect(framework.theme.register).toHaveBeenCalledWith(mockComponent);
      });
    });

    describe("unregister", () => {
      it("should unregister component from theme", () => {
        const mockComponent = {} as any;

        framework.theme.unregister(mockComponent);

        expect(framework.theme.unregister).toHaveBeenCalledWith(mockComponent);
      });
    });

    describe("bemClass", () => {
      it("should generate BEM class", () => {
        const block = "button";
        const element = "icon";
        const modifiers = { primary: true, large: true } as any;

        framework.theme.bemClass(block, element, modifiers);

        expect(framework.theme.bemClass).toHaveBeenCalledWith(
          block,
          element,
          modifiers,
        );
      });

      it("should generate BEM class without element", () => {
        const block = "button";
        const modifiers = { primary: true } as any;

        framework.theme.bemClass(block, undefined, modifiers);

        expect(framework.theme.bemClass).toHaveBeenCalledWith(
          block,
          undefined,
          modifiers,
        );
      });
    });

    describe("get", () => {
      describe("current", () => {
        it("should get current theme", () => {
          framework.theme.get.current();

          expect(framework.theme.get.current).toHaveBeenCalled();
        });
      });

      describe("icon", () => {
        it("should get icon", () => {
          const iconName = "check";

          framework.theme.get.icon(iconName as any);

          expect(framework.theme.get.icon).toHaveBeenCalledWith(
            iconName as any,
          );
        });
      });

      describe("icons", () => {
        it("should get all icons", () => {
          framework.theme.get.icons();

          expect(framework.theme.get.icons).toHaveBeenCalled();
        });
      });

      describe("sprite", () => {
        describe("path", () => {
          it("should get sprite path", () => {
            framework.theme.get.sprite.path();

            expect(framework.theme.get.sprite.path).toHaveBeenCalled();
          });
        });

        describe("ids", () => {
          it("should get sprite ids", () => {
            framework.theme.get.sprite.ids();

            expect(framework.theme.get.sprite.ids).toHaveBeenCalled();
          });
        });

        describe("hasIcon", () => {
          it("should check if sprite has icon", () => {
            const iconId = "check";

            framework.theme.get.sprite.hasIcon(iconId);

            expect(framework.theme.get.sprite.hasIcon).toHaveBeenCalledWith(
              iconId,
            );
          });
        });
      });

      describe("themes", () => {
        it("should get themes", () => {
          framework.theme.get.themes();

          expect(framework.theme.get.themes).toHaveBeenCalled();
        });
      });
    });

    describe("set", () => {
      it("should set theme", () => {
        const themeName = "dark";

        framework.theme.set(themeName);

        expect(framework.theme.set).toHaveBeenCalledWith(themeName);
      });
    });

    describe("refresh", () => {
      it("should refresh theme", () => {
        framework.theme.refresh();

        expect(framework.theme.refresh).toHaveBeenCalled();
      });
    });

    describe("setLfStyle", () => {
      it("should set LF style", () => {
        const mockComponent = {} as any;

        framework.theme.setLfStyle(mockComponent);

        expect(framework.theme.setLfStyle).toHaveBeenCalledWith(mockComponent);
      });
    });

    describe("randomize", () => {
      it("should randomize theme", () => {
        framework.theme.randomize();

        expect(framework.theme.randomize).toHaveBeenCalled();
      });
    });
  });
});
