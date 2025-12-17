import {
  LF_TOAST_BLOCKS,
  LF_TOAST_CSS_VARIABLES,
  LF_TOAST_PARTS,
  LfIconType,
  LfToastFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * LfToastFC - Functional Component for Toast
 *
 * This is a stateless functional component that renders a toast notification.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-toast Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via framework portal API
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * State/Size Props:
 * - `uiState`: Controls color scheme via `data-lf` attribute
 * - `uiSize`: Controls sizing via CSS variable `--lf-fc-ui-size`
 * These are required for composed usage where CSS cascade doesn't work
 * (e.g., portaled content outside the DOM hierarchy).
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfToastFC: FunctionalComponent<LfToastFCProps> = ({
  className,
  closeCallback,
  closeIcon,
  framework,
  icon,
  id,
  message,
  style,
  timer,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_TOAST_BLOCKS;
  const parts = LF_TOAST_PARTS;
  const v = LF_TOAST_CSS_VARIABLES;

  const { toast } = blocks;

  // Compute derived predicates
  const hasIcon = Boolean(icon);
  const hasCloseIcon = Boolean(closeIcon);
  const hasTimer = Boolean(timer);

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? {
          ...style,
          "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})`,
          ...(hasTimer ? { [v.timer]: `${timer}ms` } : {}),
        }
      : {
          ...style,
          ...(hasTimer ? { [v.timer]: `${timer}ms` } : {}),
        };

  return (
    <div
      class={`${bemClass(toast._)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      style={computedStyle}
    >
      <div class={bemClass(toast._, toast.accent, { temporary: hasTimer })} />
      <div
        class={bemClass(toast._, toast.messageWrapper, {
          full: hasIcon && hasCloseIcon,
          "has-actions": hasCloseIcon,
          "has-icon": hasIcon,
        })}
      >
        {hasIcon && (
          <div class={bemClass(toast._, toast.icon)} part={parts.icon}>
            <FIcon framework={framework} icon={icon as LfIconType} />
          </div>
        )}
        {message && (
          <div class={bemClass(toast._, toast.message)} part={parts.message}>
            {message}
          </div>
        )}
        {hasCloseIcon && (
          <div
            class={bemClass(toast._, toast.icon, { "has-actions": true })}
            onPointerDown={(e) => {
              e.preventDefault();
              closeCallback?.();
            }}
            part={parts.closeButton}
            tabIndex={0}
          >
            <FIcon framework={framework} icon={closeIcon as LfIconType} />
          </div>
        )}
      </div>
    </div>
  );
};
