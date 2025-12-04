import {
  LfFrameworkInterface,
  LfLLMToolHandlers,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

//#region Debug
/**
 * Creates the handler function for the debug tool.
 * Toggles debug mode and prints logs to the browser console.
 */
export const createDebugToolHandler = (
  framework: LfFrameworkInterface,
): LfLLMToolHandlers[string] => {
  return async (args: Record<string, unknown>): Promise<LfLLMToolResponse> => {
    const rawAction = args.action;
    const action =
      typeof rawAction === "string" ? rawAction.trim().toLowerCase() : "";

    if (!action) {
      return {
        type: "text",
        content:
          "Please specify an action: 'on' to enable debug, 'off' to disable, 'print' to output logs, or 'status' to check current state.",
      };
    }

    const { debug } = framework;
    const isCurrentlyEnabled = debug.isEnabled();

    switch (action) {
      case "on": {
        if (isCurrentlyEnabled) {
          return {
            type: "text",
            content: "🐛 Debug mode is **already enabled**.",
          };
        }
        debug.toggle(true);
        return {
          type: "text",
          content:
            "🐛 Debug mode **enabled**!\n\nComponent lifecycle events and performance metrics will now be logged. Use 'print' to view collected logs in the browser console.",
        };
      }

      case "off": {
        if (!isCurrentlyEnabled) {
          return {
            type: "text",
            content: "Debug mode is **already disabled**.",
          };
        }
        debug.toggle(false);
        return {
          type: "text",
          content:
            "Debug mode **disabled**.\n\nLogging has been turned off. Existing logs are preserved until you print or dump them.",
        };
      }

      case "print": {
        debug.logs.print();
        return {
          type: "text",
          content:
            "📋 Debug logs have been printed to the **browser console**.\n\nOpen your browser DevTools (F12) → Console tab to view them. Logs are grouped by type: load, render, resize, and misc.",
        };
      }

      case "status": {
        const statusEmoji = isCurrentlyEnabled ? "🟢" : "🔴";
        const statusText = isCurrentlyEnabled ? "Enabled" : "Disabled";
        return {
          type: "text",
          content: `**Debug Status:** ${statusEmoji} ${statusText}\n\n${
            isCurrentlyEnabled
              ? "Debug mode is active. Component events are being logged."
              : "Debug mode is inactive. Enable it with 'on' to start logging."
          }`,
        };
      }

      default: {
        return {
          type: "text",
          content: `Unknown action "${action}". Valid actions are: **on**, **off**, **print**, **status**.`,
        };
      }
    }
  };
};
//#endregion
