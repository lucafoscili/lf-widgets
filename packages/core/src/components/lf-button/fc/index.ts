/**
 * lf-button Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive props and render pure UI based on the provided state.
 *
 * Note: ButtonFC uses direct props pattern (framework, icon, label, etc.)
 * rather than adapter pattern because it's a simple presentational component.
 * The adapter bridging happens in elements.button.tsx which wraps ButtonFC.
 */

export { ButtonFC } from "./button-fc";

// Re-export the props interface from foundations for convenience
export type { LfButtonFCProps } from "@lf-widgets/foundations";
