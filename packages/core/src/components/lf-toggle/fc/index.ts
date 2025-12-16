/**
 * lf-toggle Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive props and render pure UI.
 *
 * Note: LfToggleFC is designed for standalone usage (receives framework directly)
 * rather than adapter-based usage. This allows composition in other components
 * like shapeeditor without requiring an adapter.
 */

export { LfToggleFC } from "./toggle-fc";

// Re-export types from foundations for convenience
export type { LfToggleFCProps } from "@lf-widgets/foundations";
