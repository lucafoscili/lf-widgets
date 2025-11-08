import { LfFrameworkInterface } from "@lf-widgets/foundations";

//#region createMockFramework
export function createMockFramework(): jest.Mocked<LfFrameworkInterface> {
  return {
    assets: {
      get: jest.fn(),
      set: jest.fn(),
    },
    color: {
      autoContrast: jest.fn(),
      compute: jest.fn(),
      convert: {
        codeToHex: jest.fn(),
        hexToRgb: jest.fn(),
        hslToRgb: jest.fn(),
        rgbToHex: jest.fn(),
        rgbToHsl: jest.fn(),
        valueToHex: jest.fn(),
      },
      random: jest.fn(),
    },
    data: {
      cell: {
        exists: jest.fn(),
        shapes: {
          get: jest.fn(),
          getAll: jest.fn(),
        },
        stringify: jest.fn(),
      },
      column: {
        find: jest.fn(),
      },
      node: {
        exists: jest.fn(),
        filter: jest.fn(),
        findNodeByCell: jest.fn(),
        fixIds: jest.fn(),
        getParent: jest.fn(),
        pop: jest.fn(),
        toStream: jest.fn(),
        traverseVisible: jest.fn(),
        find: jest.fn(),
        resolveTargets: jest.fn(),
        sanitizeIds: jest.fn(),
        extractCellMetadata: jest.fn(),
      },
    },
    debug: {
      info: {
        create: jest.fn(),
        update: jest.fn(),
      },
      logs: {
        dump: jest.fn(),
        fromComponent: jest.fn() as any, // Type predicate, hard to mock properly
        new: jest.fn(),
        print: jest.fn(),
      },
      isEnabled: jest.fn(),
      register: jest.fn(),
      toggle: jest.fn(),
      toggleAutoPrint: jest.fn(),
      unregister: jest.fn(),
    },
    drag: {
      register: {
        customDrag: jest.fn(),
        dragToDrop: jest.fn(),
        dragToResize: jest.fn(),
        dragToScroll: jest.fn(),
        swipe: jest.fn(),
      },
      unregister: {
        all: jest.fn(),
        customDrag: jest.fn(),
        dragToDrop: jest.fn(),
        dragToResize: jest.fn(),
        dragToScroll: jest.fn(),
        swipe: jest.fn(),
      },
      getActiveSession: jest.fn(),
    },
    effects: {
      backdrop: {
        hide: jest.fn(),
        isVisible: jest.fn(),
        show: jest.fn(),
      },
      isRegistered: jest.fn(),
      lightbox: {
        hide: jest.fn(),
        isVisible: jest.fn(),
        show: jest.fn(),
      },
      register: {
        tilt: jest.fn(),
      },
      ripple: jest.fn(),
      set: {
        intensity: jest.fn(),
        timeout: jest.fn(),
      },
      unregister: {
        tilt: jest.fn(),
      },
    },
    llm: {
      createAbort: jest.fn(),
      fetch: jest.fn(),
      poll: jest.fn(),
      speechToText: jest.fn(),
      stream: jest.fn(),
      utils: {
        hash: jest.fn(),
        estimateTokens: jest.fn(),
      },
      withRetry: jest.fn(),
    },
    portal: {
      close: jest.fn(),
      getState: jest.fn(),
      isInPortal: jest.fn(),
      open: jest.fn(),
    },
    syntax: {
      markdown: {} as any, // Hard to mock markdown-it
      prism: {} as any, // Hard to mock prism
      json: {
        areEqual: jest.fn(),
        isLikeString: jest.fn() as any, // Type predicate
        isValid: jest.fn(),
        parse: jest.fn(),
        unescape: jest.fn(),
      },
      parseMarkdown: jest.fn(),
      highlightElement: jest.fn(),
      highlightCode: jest.fn(),
      registerLanguage: jest.fn(),
      isLanguageLoaded: jest.fn(),
      loadLanguage: jest.fn(),
    },
    utilities: {},
    theme: {
      bemClass: jest.fn(),
      get: {
        current: jest.fn(),
        sprite: {
          path: jest.fn(),
          ids: jest.fn(),
          hasIcon: jest.fn(),
        },
        icon: jest.fn(),
        icons: jest.fn(),
        themes: jest.fn(),
      },
      set: jest.fn(),
      refresh: jest.fn(),
      setLfStyle: jest.fn(),
      randomize: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
    },
    addClickCallback: jest.fn(),
    assignRef: jest.fn(),
    getModules: jest.fn(),
    register: jest.fn(),
    removeClickCallback: jest.fn(),
    sanitizeProps: jest.fn(),
    shapes: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };
}
//#endregion
