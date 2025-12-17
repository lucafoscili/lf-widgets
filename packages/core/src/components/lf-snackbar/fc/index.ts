/**
 * lf-snackbar Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Note: LfSnackbarFC is designed for standalone usage (receives framework directly)
 * rather than adapter-based usage. This allows composition in other components
 * without requiring an adapter.
 */

export { LfSnackbarFC } from "./lf-snackbar-fc";
export { SnackbarFC, SnackbarFCProps } from "./snackbar-fc";

// Re-export types from foundations for convenience
export type { LfSnackbarFCProps } from "@lf-widgets/foundations";
