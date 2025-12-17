/**
 * lf-shapeeditor Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Hierarchy:
 * - ShapeeditorFC (adapter wrapper)
 *   └── LfShapeeditorFC (pure presentational)
 *       ├── Navigation panel (explorer, jump, masonry)
 *       ├── Preview panel (history, shape, spinner)
 *       └── Settings panel (actions, controls, progressbar, tree)
 */

// Adapter wrapper FC (used by WC)
export { ShapeeditorFC, ShapeeditorFCProps } from "./shapeeditor-fc";

// Pure presentational FC (can be used standalone)
export { LfShapeeditorFC } from "../lf-shapeeditor-fc";
export type { LfShapeeditorFCProps } from "@lf-widgets/foundations";
