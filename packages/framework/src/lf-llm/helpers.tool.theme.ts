import {
  LfFrameworkInterface,
  LfLLMToolHandlers,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

//#region Theme
/**
 * Creates the handler function for the theme tool.
 * Changes the active theme of lf-widgets or lists available themes.
 */
export const createThemeToolHandler = (
  framework: LfFrameworkInterface,
): LfLLMToolHandlers[string] => {
  return async (args: Record<string, unknown>): Promise<LfLLMToolResponse> => {
    const rawTheme = args.theme;
    const themeInput =
      typeof rawTheme === "string" ? rawTheme.trim().toLowerCase() : "";

    if (!themeInput) {
      return {
        type: "text",
        content:
          "Please specify a theme name (e.g. 'sakura', 'dark'), 'random' for a random theme, or 'list' to see all available themes.",
      };
    }

    const { theme } = framework;
    const themesData = theme.get.themes();
    const availableThemes = themesData.asArray;
    const currentTheme = theme.get.current().name;

    if (themeInput === "list") {
      const themeList = availableThemes.join(", ");
      return {
        type: "text",
        content: `**Available Themes (${availableThemes.length}):**\n\n${themeList}\n\n**Current theme:** ${currentTheme}`,
      };
    }

    if (themeInput === "random") {
      theme.randomize();
      const newTheme = theme.get.current().name;
      return {
        type: "text",
        content: `🎲 Theme randomized!\n\n**New theme:** ${newTheme}\n**Previous theme:** ${currentTheme}`,
      };
    }

    const matchedTheme = availableThemes.find(
      (t) => t.toLowerCase() === themeInput,
    );

    if (!matchedTheme) {
      const suggestions = availableThemes.filter((t) =>
        t.toLowerCase().includes(themeInput),
      );
      const suggestionText =
        suggestions.length > 0
          ? `\n\nDid you mean: ${suggestions.join(", ")}?`
          : `\n\nUse 'list' to see all available themes.`;

      return {
        type: "text",
        content: `Theme "${themeInput}" not found.${suggestionText}`,
      };
    }

    theme.set(matchedTheme);
    const isDark = theme.get.current().isDark;
    const modeEmoji = isDark ? "🌙" : "☀️";

    return {
      type: "text",
      content: `${modeEmoji} Theme changed to **${matchedTheme}**!\n\n**Mode:** ${isDark ? "Dark" : "Light"}\n**Previous theme:** ${currentTheme}`,
    };
  };
};
//#endregion
