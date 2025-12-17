/**
 * lf-code Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive props and render pure UI.
 *
 * Note: LfCodeFC is designed for standalone usage (receives framework directly)
 * rather than adapter-based usage. This allows composition in other components
 * like shapeeditor without requiring an adapter.
 */

export { CodeFC } from "./code-fc";
export type { CodeFCProps } from "./code-fc";

// Re-export the pure LfCodeFC from parent directory for convenience
export { LfCodeFC } from "../lf-code-fc";

// Re-export types from foundations for convenience
export type { LfCodeFCProps } from "@lf-widgets/foundations";
