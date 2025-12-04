import { LfThemeBEMModifier } from "@lf-widgets/foundations";

//#region BEM Class Generator
/**
 * Generates a BEM (Block Element Modifier) class name string.
 *
 * BEM is a naming convention that helps create reusable and maintainable CSS:
 * - Block: Standalone component (e.g., "button")
 * - Element: Part of a block (e.g., "button__icon")
 * - Modifier: Variant or state (e.g., "button__icon--large")
 *
 * @param block - The block name in BEM notation
 * @param element - Optional element name in BEM notation
 * @param modifiers - Optional object containing modifier flags. Keys represent modifier names, values determine if modifier is active
 * @returns A string containing the complete BEM class name with any active modifiers
 *
 * @example
 * // Returns "button"
 * bemClass('button')
 *
 * @example
 * // Returns "button__icon"
 * bemClass('button', 'icon')
 *
 * @example
 * // Returns "button__icon button__icon--large button__icon--active"
 * bemClass('button', 'icon', { large: true, active: true, disabled: false })
 */
export const bemClass = (
  block: string,
  element?: string,
  modifiers?: Partial<LfThemeBEMModifier>,
): string => {
  let baseClass = element ? `${block}__${element}` : block;

  if (modifiers) {
    const modifierClasses = Object.entries(modifiers)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => `${baseClass}--${key}`);
    baseClass += ` ${modifierClasses.join(" ")}`;
  }

  return baseClass.trim();
};
//#endregion
