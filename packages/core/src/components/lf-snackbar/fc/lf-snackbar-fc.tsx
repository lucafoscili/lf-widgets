import {
  LF_SNACKBAR_BLOCKS,
  LF_SNACKBAR_PARTS,
  LfSnackbarFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

/**
 * LfSnackbarFC - Functional Component for Snackbar
 *
 * This is a stateless functional component that renders a snackbar notification.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-snackbar Web Component (thin wrapper)
 * 2. Inside other components (composed usage)
 * 3. Via LfShape rendering (if snackbar becomes a data shape)
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
export const LfSnackbarFC: FunctionalComponent<LfSnackbarFCProps> = ({
  action,
  className,
  closeIcon,
  framework,
  hasAction = false,
  hasCloseIcon = false,
  hasIcon = false,
  icon,
  id,
  message,
  onAction,
  onClose,
  position = "bottom-center",
  style,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_SNACKBAR_BLOCKS;
  const parts = LF_SNACKBAR_PARTS;

  const { snackbar } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  return (
    <div
      class={`${bemClass(snackbar._, null, { inline: position === "inline" })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      style={computedStyle}
    >
      <div
        class={bemClass(snackbar._, snackbar.content, {
          "has-icon": hasIcon,
        })}
      >
        {hasIcon && (
          <div
            class={bemClass(snackbar._, snackbar.icon, {
              main: uiState === "primary",
            })}
            part={parts.icon}
          >
            <FIcon framework={framework} icon={icon} />
          </div>
        )}
        {message && (
          <div
            class={bemClass(snackbar._, snackbar.message)}
            part={parts.message}
          >
            {message}
          </div>
        )}
      </div>
      {(hasAction || hasCloseIcon) && (
        <div class={bemClass(snackbar._, snackbar.actions)}>
          {hasAction && (
            <button
              class={bemClass(snackbar._, snackbar.actionButton)}
              onPointerDown={onAction}
              part={parts.actionButton}
              type="button"
            >
              {action}
            </button>
          )}
          {hasCloseIcon && (
            <div
              class={bemClass(snackbar._, snackbar.closeButton)}
              onPointerDown={onClose}
              part={parts.closeButton}
              tabIndex={0}
            >
              <FIcon framework={framework} icon={closeIcon} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
