import {
  CSS_VAR_PREFIX,
  LfImageAdapter,
  LfImageAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-image.
 *
 * "Adapter as Core" Architecture:
 * - Computed values read internal state via `controller.get.*`
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping computed logic separate
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepImageComputed = (
  getAdapter: () => LfImageAdapter,
): LfImageAdapterControllerComputed => ({
  /**
   * Whether the lfValue is a resource URL (http, data:, blob:, etc.).
   * Used to determine if we should render an <img> or a sprite icon.
   */
  isResourceUrl: () => {
    const { compInstance } = getAdapter().controller.get;
    const { lfValue } = compInstance();

    if (!lfValue || typeof lfValue !== "string") {
      return false;
    }

    const resourceUrlPattern =
      /^(?:(?:https?:\/\/|\/|\.{1,2}\/|[a-zA-Z]:\\|\\\\|blob:).+|data:image\/[a-zA-Z0-9+.-]+(?:;charset=[^;,]+)?(?:;base64)?,.*)$/;

    return resourceUrlPattern.test(lfValue);
  },

  /**
   * Get the resolved source for the image/icon.
   * For URLs, returns the lfValue directly.
   * For sprite icons, resolves the CSS variable to the actual icon name.
   *
   * "Adapter as Core" Architecture:
   * - Reads resolvedSpriteName from adapter's closure via getter
   */
  resolvedSource: () => {
    const adapter = getAdapter();
    const { compInstance, framework, resolvedSpriteName } =
      adapter.controller.get;
    const { isResourceUrl } = adapter.controller.computed;

    const comp = compInstance();
    const { lfValue } = comp;

    // If it's a URL, return it directly
    if (isResourceUrl()) {
      return lfValue;
    }

    // For sprite icons, resolve CSS variable if needed
    if (!lfValue) {
      const { theme } = framework();
      const { variables } = theme.get.current();
      return String(variables["--lf-icon-broken-image"]);
    }

    // Use resolved sprite name if available, otherwise resolve CSS variable
    const resolved = resolvedSpriteName();
    if (resolved) {
      return resolved;
    }

    // Resolve CSS variable to actual icon name
    if (lfValue.indexOf(CSS_VAR_PREFIX) > -1) {
      const { theme } = framework();
      const { variables } = theme.get.current();
      const varResolved = variables[lfValue as keyof typeof variables];
      return varResolved !== undefined ? String(varResolved) : lfValue;
    }

    return lfValue;
  },
});
