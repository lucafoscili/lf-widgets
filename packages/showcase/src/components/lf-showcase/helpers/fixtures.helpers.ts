import { LF_THEME_UI_STATES, LfThemeIcon } from "@lf-widgets/foundations";
import { SAMPLE_STRINGS } from "./fixtures.constants";

//#region Randomizers
export function randomBoolean() {
  return Math.random() < 0.5;
}
export function randomStyle() {
  const filters = [
    "brightness(125%)",
    "drop-shadow(1em 1em 1.25em rgba(var(--lf-color-secondary), 0.75))",
    "grayscale(100%)",
    "saturate(125%)",
  ];
  const randomFilters = filters
    .map((filter) => (randomNumber(1, 4) ? filter : ""))
    .join(" ");
  return `:host{filter: ${randomFilters};}`;
}
export function randomHexColor() {
  return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
}
export function randomDateString() {
  return new Date(
    Date.now() - Math.floor(Math.random() * 10000000000),
  ).toISOString();
}
export function randomIcon(iconArr: LfThemeIcon[]) {
  const index = Math.floor(Math.random() * iconArr.length);
  return iconArr[index];
}
export function randomNumber(min = 0, max = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomProperty<T>(obj: T[]): T {
  const count = obj.length;
  const randomIndex = Math.floor(Math.random() * count);
  return obj[randomIndex];
}
export function randomState() {
  const count = Object.keys(LF_THEME_UI_STATES).length;
  const states = Object.values(LF_THEME_UI_STATES);
  return states[Math.floor(Math.random() * count)];
}
export function randomString() {
  const idx = Math.floor(Math.random() * SAMPLE_STRINGS.length);
  return SAMPLE_STRINGS[idx];
}
export function randomPhrase(min = 3, max = 7) {
  const count = randomNumber(min, max);
  return Array.from({ length: count })
    .map(() => randomString())
    .join(" ");
}
//#endregion
