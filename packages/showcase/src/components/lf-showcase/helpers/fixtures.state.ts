import {
  LF_THEME_COLORS,
  LF_THEME_ICONS,
  LF_THEME_UI_STATES,
  LfColorInput,
  LfThemeFixtures,
  LfThemeIcon,
  LfThemeInterface,
  LfThemeUIState,
  LfThemeVariables,
} from "@lf-widgets/foundations";

//#region Getters
const getColor = (
  cssVariables: LfThemeVariables,
  state: Exclude<LfThemeUIState, "disabled">,
): LfThemeFixtures["state"][LfThemeUIState]["color"] => {
  const colorK = LF_THEME_COLORS[state] as keyof typeof cssVariables;
  return {
    bg: String(cssVariables[colorK]) as LfColorInput,
    text: String(cssVariables[colorK]).replace(
      "color-",
      "color-on-",
    ) as LfColorInput,
  };
};
const getIcon = (
  cssVariables: LfThemeVariables,
  state: LfThemeUIState,
): LfThemeIcon => {
  const iconK = LF_THEME_ICONS[state] as keyof typeof cssVariables;
  return cssVariables[iconK] as LfThemeIcon;
};
//#region Random state
export const randomState = (): LfThemeUIState => {
  const states = Object(LF_THEME_UI_STATES).values();
  const count = states.length;

  return states[Math.floor(Math.random() * count)];
};
//#endregion

//#region State factory
export const stateFactory = (
  theme: LfThemeInterface,
): LfThemeFixtures["state"] => {
  const { variables } = theme.get.current();

  return LF_THEME_UI_STATES.reduce(
    (acc, state) => {
      const s = state as keyof LfThemeFixtures["state"];
      acc[s] = {
        icon: getIcon(variables, s),
        color: s !== "disabled" && getColor(variables, s),
        label: {
          capitalized: s.charAt(0).toUpperCase() + s.slice(1),
          lower: s,
          upper: s.toUpperCase(),
        },
      };

      return acc;
    },
    {} as LfThemeFixtures["state"],
  );
};
//#endregion
