import {
  LF_SPLASH_BLOCKS,
  LF_SPLASH_PARTS,
  LfSplashFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfSplashFC - Functional Component for Splash
 *
 * This is a stateless functional component that renders a splash screen.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-splash Web Component (thin wrapper)
 * 2. Inside other components like loaders (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfSplashFC: FunctionalComponent<LfSplashFCProps> = ({
  contentRef,
  framework,
  isUnmounting = false,
  label = "Loading...",
  labelRef,
  splashRef,
  widgetRef,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_SPLASH_BLOCKS;
  const parts = LF_SPLASH_PARTS;

  const { splash } = blocks;

  return (
    <div
      class={bemClass(splash._, null, {
        active: isUnmounting,
      })}
      part={parts.splash}
      ref={splashRef}
    >
      <div
        class={bemClass(splash._, splash.content)}
        part={parts.content}
        ref={contentRef}
      >
        <div
          class={bemClass(splash._, splash.widget)}
          part={parts.widget}
          ref={widgetRef}
        >
          <slot></slot>
        </div>
        <div
          class={bemClass(splash._, splash.label)}
          part={parts.label}
          ref={labelRef}
        >
          {isUnmounting ? "Ready!" : label}
        </div>
      </div>
    </div>
  );
};
