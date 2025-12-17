/**
 * lf-header Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Note: LfHeaderFC is designed for standalone usage (receives framework directly)
 * rather than adapter-based usage. This allows composition in other components
 * without requiring an adapter.
 */

export { HeaderFC, HeaderFCProps } from "./header-fc";

// Re-export standalone FC for direct usage
export { LfHeaderFC } from "../lf-header-fc";

// Re-export types from foundations for convenience
export type { LfHeaderFCProps } from "@lf-widgets/foundations";
