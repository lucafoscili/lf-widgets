/**
 * lf-radio Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive props and render pure UI.
 *
 * Structure:
 * - LfRadioFC: Pure presentational FC (receives props directly from foundations interface)
 * - RadioFC: Adapter-aware wrapper that extracts props from adapter
 *
 * @see Section 2 & 5.9 of 4_0_0_REFACTORING.md
 */

export { RadioFC } from "./radio-fc";

// Re-export types from foundations for convenience
export type { LfRadioFCProps } from "@lf-widgets/foundations";
