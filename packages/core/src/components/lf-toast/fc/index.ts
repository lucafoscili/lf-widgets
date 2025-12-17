/**
 * lf-toast Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 */

export { ToastFC, ToastFCProps } from "./toast-fc";

// Re-export standalone FC from parent directory
export { LfToastFC } from "../lf-toast-fc";
