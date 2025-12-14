import {
  CSS_VAR_PREFIX,
  LfImageAdapter,
  LfImageAdapterControllerActions,
  LfThemeIconVariable,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-image.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepImageActions = (
  getAdapter: () => LfImageAdapter,
): LfImageAdapterControllerActions => ({
  /**
   * Resolves sprite icon from theme.
   * Handles CSS variable resolution and checks if icon exists in sprite.
   */
  resolveSprite: async (value?: LfThemeIconVariable) => {
    const adapter = getAdapter();
    const { framework, resolvedFor } = adapter.controller.get;
    const { set } = adapter.controller;

    const { theme } = framework();
    const { variables } = theme.get.current();

    const resolved = !value
      ? variables["--lf-icon-broken-image"]
      : value.indexOf(CSS_VAR_PREFIX) > -1
        ? variables[value]
        : value;

    if (resolvedFor() !== resolved) {
      set.resolvedSpriteName(undefined);
      set.resolvedFor(resolved);

      const exists = await theme.get.sprite.hasIcon(resolved);
      // Only update if this is still the current resolution target
      if (resolvedFor() === resolved) {
        set.resolvedSpriteName(
          exists ? resolved : variables["--lf-icon-broken-image"],
        );
      }
    }
  },

  /**
   * Resets state when lfValue changes.
   * Called by the @Watch decorator on lfValue.
   */
  resetState: async (newVal?: string) => {
    const adapter = getAdapter();
    const { framework } = adapter.controller.get;
    const { isResourceUrl } = adapter.controller.computed;
    const { set } = adapter.controller;

    set.error(false);
    set.isLoaded(false);
    set.resolvedSpriteName(undefined);
    set.resolvedFor(undefined);

    if (!newVal) {
      return;
    }

    const isUrl = isResourceUrl();
    if (isUrl) {
      return;
    }

    // For sprite icons, mark as loaded immediately
    set.isLoaded(true);
    try {
      const { theme } = framework();
      theme.get.sprite.ids();
    } catch (err) {
      // Sprite not available, will show broken image
    }
  },
});
