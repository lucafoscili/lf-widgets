import {
  LF_SHAPEEDITOR_BLOCKS,
  LF_SHAPEEDITOR_PARTS,
  LfShapeeditorFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfShapeeditorFC - Pure Presentational Functional Component for Shapeeditor
 *
 * This is a stateless functional component that renders the shapeeditor layout.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-shapeeditor Web Component (thin wrapper via ShapeeditorFC adapter)
 * 2. Inside other components for composed usage
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
export const LfShapeeditorFC: FunctionalComponent<LfShapeeditorFCProps> = ({
  blocks = LF_SHAPEEDITOR_BLOCKS.shapeeditor,
  explorerJsx,
  framework,
  hasSelection = false,
  jumpJsx,
  masonryJsx,
  parts = LF_SHAPEEDITOR_PARTS.shapeeditor,
  shouldShowHistory = false,
  shouldShowLoad = false,
  shouldShowTree = false,
  historyJsx,
  shapeJsx,
  spinnerJsx,
  actionsJsx,
  controlsJsx,
  progressbarJsx,
  treeJsx,
}) => {
  const { bemClass } = framework.theme;

  const { navigation, preview, settings } = blocks;

  return (
    <div
      class={bemClass(blocks._, blocks.grid, {
        selected: hasSelection,
      })}
    >
      {/* Navigation Panel */}
      <div
        class={bemClass(navigation._, undefined, {
          "has-drawer": shouldShowTree,
          "has-header": shouldShowLoad,
          "has-nav": !!explorerJsx,
        })}
        part={parts.navigation._}
      >
        {explorerJsx?.()}
        {jumpJsx?.()}
        {masonryJsx()}
      </div>

      {/* Preview Panel */}
      <div
        class={bemClass(preview._, undefined, {
          "has-history": shouldShowHistory,
        })}
        part={parts.preview._}
      >
        {historyJsx?.()}
        {shapeJsx()}
        {spinnerJsx()}
      </div>

      {/* Settings Panel */}
      <div class={bemClass(settings._)} part={parts.settings._}>
        {actionsJsx()}
        {progressbarJsx()}
        {treeJsx()}
        {controlsJsx()}
      </div>
    </div>
  );
};

// Re-export props type for external consumers
export type { LfShapeeditorFCProps } from "@lf-widgets/foundations";
