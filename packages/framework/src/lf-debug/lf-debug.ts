import {
  LfCodeInterface,
  LfComponent,
  LfFrameworkInterface,
  LfDebugInterface,
  LfDebugLifecycles,
  LfDebugLog,
  LfDebugLogClass,
  LfDebugLogFactory,
  LfDebugLogsToPrint,
  LfDebugLogToPrintEntry,
  LfDebugManagedComponents,
  LfToggleInterface,
} from "@lf-widgets/foundations";

/**
 * Class responsible for managing debugging functionality in the Lf-widgets framework.
 * Handles debug logs, component registration, and debug state management.
 *
 * @remarks
 * The debug manager provides:
 * - Component lifecycle tracking
 * - Performance measurements
 * - Debug log management with categories (informational, error, warning)
 * - Component registration system for debug-enabled components
 * - Debug state toggle functionality
 *
 * @example
 * ```typescript
 * // Register a component for debugging
 * debugManager.register(component);
 *
 * // Toggle debug mode
 * debugManager.toggle(true);
 *
 * // Create debug information for a component
 * const debugInfo = debugManager.info.create();
 * ```
 *
 * @see {@link LfFramework} For the main framework manager
 */
export class LfDebug implements LfDebugInterface {
  #COMPONENTS = {
    codes: new Set<LfCodeInterface>(),
    toggles: new Set<LfToggleInterface>(),
  };
  #IS_ENABLED = false;
  #LOG_LIMIT = 250;
  #LOGS: LfDebugLog[] = [];

  constructor(_lfFramework: LfFrameworkInterface) {}

  #codeDispatcher = (log?: LfDebugLog) => {
    Array.from(this.#COMPONENTS.codes).forEach((comp) => {
      if (log) {
        comp.lfValue = `# ${log.id}:\n${log.message}\n\n${comp.lfValue}`;
      } else {
        comp.lfValue = "";
      }
    });
  };
  #toggleDispatcher = () => {
    Array.from(this.#COMPONENTS.toggles).forEach((comp) => {
      comp.setValue(this.#IS_ENABLED ? "on" : "off");
    });
  };

  /**
   * Object containing methods for managing debug information.
   * @property {Function} create - Creates and initializes debug information with timing data.
   * @returns {Object} Object containing timing information with properties:
   * - endTime: Time when component ends processing
   * - renderCount: Number of renders
   * - renderEnd: Time when render ends
   * - renderStart: Time when render starts
   * - startTime: Initial timestamp
   *
   * @property {Function} update - Updates debug information based on component lifecycle.
   * @param {LfComponent<LfComponentName>} comp - The component to debug
   * @param {LfDebugLifecycles} lifecycle - The lifecycle phase to track ("custom", "did-render", "did-load", "will-render")
   * @returns {Promise<void>}
   */
  info = {
    //#region Create info
    create: () => {
      return {
        endTime: 0,
        renderCount: 0,
        renderEnd: 0,
        renderStart: 0,
        startTime: performance.now(),
      };
    },
    //#endregion

    //#region Update info
    update: async (
      comp: LfComponent,
      lifecycle: LfDebugLifecycles,
    ): Promise<void> => {
      switch (lifecycle) {
        case "custom":
          if (this.isEnabled()) {
            this.logs.new(
              comp,
              "Custom breakpoint " +
                " took " +
                (window.performance.now() - comp.debugInfo.renderStart) +
                "ms.",
            );
          }
          break;
        case "did-render":
          comp.debugInfo.renderEnd = window.performance.now();
          if (this.isEnabled()) {
            this.logs.new(
              comp,
              "Render #" +
                comp.debugInfo.renderCount +
                " took " +
                (comp.debugInfo.renderEnd - comp.debugInfo.renderStart) +
                "ms.",
            );
          }
          break;
        case "did-load":
          comp.debugInfo.endTime = window.performance.now();
          this.logs.new(
            comp,
            "Component ready after " +
              (comp.debugInfo.endTime - comp.debugInfo.startTime) +
              "ms.",
          );
          break;
        case "will-render":
          comp.debugInfo.renderCount++;
          comp.debugInfo.renderStart = window.performance.now();
          break;
        default:
          break;
      }
    },
    //#endregion
  };

  /**
   * Factory object handling debug logs functionality.
   * @property {() => void} dump - Clears all stored logs and triggers the code dispatcher.
   * @property {(comp: LfDebugLogClass) => comp is LfGenericComponent} fromComponent - Type guard checking if the given component has a rootElement.
   * @property {(comp: LfDebugLogClass | LfCode, message: string, category?: "informational" | "error" | "warning") => Promise<void>} new - Creates and stores a new debug log entry.
   * @property {() => void} print - Prints all stored logs grouped by type (load, misc, render, resize) to the console.
   */
  logs: LfDebugLogFactory = {
    //#region Dump logs
    dump: () => {
      this.#LOGS = [];
      this.#codeDispatcher();
    },
    //#endregion

    //#region Logs from comp
    fromComponent(comp: LfDebugLogClass): comp is LfComponent {
      return (comp as LfComponent).rootElement !== undefined;
    },
    //#endregion

    //#region New log
    new: async (comp, message, category = "informational") => {
      if (this.#COMPONENTS.codes.has(comp as LfCodeInterface)) {
        return;
      }

      const isFromComponent = this.logs.fromComponent(comp);
      const log: LfDebugLog = {
        category,
        class: null,
        date: new Date(),
        id: isFromComponent
          ? `${comp.rootElement.tagName} ${comp.rootElement.id ? "( #" + comp.rootElement.id + " )" : ""}`
          : "LfFramework",
        message,
        type:
          message.indexOf("Render #") > -1
            ? "render"
            : message.indexOf("Component ready") > -1
              ? "load"
              : message.indexOf("Size changed") > -1
                ? "resize"
                : "misc",
      };

      if (this.#LOGS.length > this.#LOG_LIMIT) {
        if (this.#IS_ENABLED) {
          console.warn(
            log.date.toLocaleDateString() +
              " lf-debug => " +
              "Too many logs (> " +
              this.#LOG_LIMIT +
              ")! Dumping (increase debug.logLimit to store more logs)... .",
          );
        }
        this.logs.dump();
      }
      this.#LOGS.push(log);

      switch (category) {
        case "error":
          console.error(
            `${log.date.toLocaleDateString()} ${log.id} ${log.message}`,
            log.class,
          );
          break;
        case "warning":
          console.warn(
            `${log.date.toLocaleDateString()} ${log.id} ${log.message}`,
            log.class,
          );
          break;
      }

      if (this.isEnabled()) {
        this.#codeDispatcher(log);
      }
    },
    //#endregion

    //#region Print logs
    print: () => {
      const logsToPrint: LfDebugLogsToPrint = {
        load: [],
        misc: [],
        render: [],
        resize: [],
      };
      for (let index = 0; index < this.#LOGS.length; index++) {
        const log = this.#LOGS[index];
        const printEntry: LfDebugLogToPrintEntry = {
          class: log.class,
          date: log.date.toLocaleDateString(),
          message: log.id + log.message,
        };
        logsToPrint[log.type].push(printEntry);
      }
      for (const key in logsToPrint) {
        if (Object.prototype.hasOwnProperty.call(logsToPrint, key)) {
          const k = key as keyof LfDebugLogsToPrint;
          const logs: LfDebugLogToPrintEntry[] = logsToPrint[k];
          console.groupCollapsed(
            "%c  %c" + key + " logs " + "(" + logsToPrint[k].length + ")",
            "background-color: green; margin-right: 10px; border-radius: 50%",
            "background-color: transparent",
          );
          for (let index = 0; index < logs.length; index++) {
            const log = logs[index];
            console.log(log.date, log.message, log.class);
          }
          console.groupEnd();
        }
      }
      if (this.#LOGS.length > 0) {
        console.groupCollapsed(
          "%c  %c" + "All logs (" + this.#LOGS.length + ")",
          "background-color: blue; margin-right: 10px; border-radius: 50%",
          "background-color: transparent",
        );
        console.table(this.#LOGS);
        console.groupEnd();
      }
    },
    //#endregion
  };

  //#region isEnabled
  /**
   * Returns whether the debug mode is enabled.
   * @returns {boolean} True if debug mode is enabled, false otherwise.
   */
  isEnabled = (): boolean => {
    return this.#IS_ENABLED;
  };
  //#endregion

  //#region Register
  /**
   * Registers a component to be managed by the debug system.
   * The component is stored in different collections based on its type.
   *
   * @param comp - The component to register which must implement LfDebugManagedComponents interface
   *
   * @example
   * // Register a LfCode component
   * debugManager.register(lfCodeComponent);
   *
   * // Register a LfToggle component
   * debugManager.register(lfToggleComponent);
   */
  register = (comp: LfDebugManagedComponents) => {
    if (comp.rootElement.tagName.toLowerCase() === "lf-code") {
      this.#COMPONENTS.codes.add(comp as LfCodeInterface);
    } else {
      this.#COMPONENTS.toggles.add(comp as LfToggleInterface);
    }
  };
  //#endregion

  //#region Toggle
  /**
   * Toggles the debug mode on/off.
   * @param value - Optional boolean to explicitly set the debug state. If not provided, the current state will be toggled.
   * @param dispatch - Optional boolean to control whether to dispatch the state change event. Defaults to true.
   * @returns The new debug state after toggling.
   */
  toggle = (value?: boolean, dispatch = true) => {
    if (value === false || value === true) {
      this.#IS_ENABLED = value;
    } else {
      this.#IS_ENABLED = !this.#IS_ENABLED;
    }

    if (dispatch) {
      this.#toggleDispatcher();
    }

    return this.#IS_ENABLED;
  };
  //#endregion

  //#region Unregister
  /**
   * Unregisters a component from the debug manager.
   *
   * @param comp - The component to unregister. Must be either a LfCode or LfToggle component.
   * @remarks
   * If the component is a LfCode, it will be removed from the codes collection.
   * If the component is a LfToggle, it will be removed from the toggles collection.
   */
  unregister = (comp: LfDebugManagedComponents) => {
    if (comp.rootElement.tagName.toLowerCase() === "lf-code") {
      this.#COMPONENTS.codes.delete(comp as LfCodeInterface);
    } else {
      this.#COMPONENTS.toggles.delete(comp as LfToggleInterface);
    }
  };
  //#endregion
}
