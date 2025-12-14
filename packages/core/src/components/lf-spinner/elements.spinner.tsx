import { LfSpinnerAdapter, LfSpinnerAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LF_SPINNER_BARS } from "./helpers.bar";
import { LF_SPINNER_WIDGETS } from "./helpers.widget";

/**
 * Prepares JSX factory functions for the spinner component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isBarVariant, showFader, etc.)
 * - Integrates existing helper files for bar and widget layouts
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSpinnerJsx = (
  getAdapter: () => LfSpinnerAdapter,
): LfSpinnerAdapterJsx => {
  return {
    //#region Spinner
    spinner: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { compInstance } = controller.get;
      const { getConfig, getWrapperClass, getMasterClass } =
        controller.computed;

      const comp = compInstance();
      const { refs } = elements;

      const { lfBarVariant, lfDimensions, lfFullScreen, lfLayout, progress } =
        comp;

      const elStyle: Record<string, string | undefined> = {
        height: lfFullScreen ? undefined : "100%",
        width: lfFullScreen ? undefined : "100%",
        fontSize: lfDimensions || (lfBarVariant ? "0.25em" : ".875em"),
      };

      const config = getConfig();
      const wrapperClass = getWrapperClass();
      const masterClass = getMasterClass();

      const spinnerClass =
        config?.className ||
        `spinner-${lfBarVariant ? "bar-v" : "v"}${lfLayout}`;
      const spinnerEl = config?.elements(progress) || [];

      return (
        <div
          id="lf-component"
          ref={(el) => {
            refs.wrapper = el;
          }}
        >
          <div
            id="loading-wrapper-master"
            class={{
              ...masterClass,
            }}
            style={elStyle}
            ref={(el) => {
              refs.master = el;
            }}
          >
            <div id={wrapperClass} style={elStyle}>
              <div
                class={spinnerClass}
                ref={(el) => {
                  refs.spinner = el;
                }}
              >
                {spinnerEl}
              </div>
            </div>
          </div>
        </div>
      );
    },
    //#endregion

    //#region Bar
    bar: (layout: number, progress: number): VNode | null => {
      const config = LF_SPINNER_BARS[layout];
      if (!config) {
        return null;
      }

      const elements = config.elements(progress);
      return <div class={config.className}>{elements}</div>;
    },
    //#endregion

    //#region Widget
    widget: (layout: number): VNode | null => {
      const config = LF_SPINNER_WIDGETS[layout];
      if (!config) {
        return null;
      }

      const elements = config.elements();
      return <div class={config.className}>{elements}</div>;
    },
    //#endregion
  };
};

//#region Refs
export const createRefs = () => ({
  spinner: null as HTMLDivElement | null,
  wrapper: null as HTMLDivElement | null,
  master: null as HTMLDivElement | null,
});
//#endregion
