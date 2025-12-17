/**
 * lf-checkbox Functional Components
 *
 * Per Section 2 "Functional Components Architecture":
 * The FC is stateless and receives props from the parent.
 * All state is owned by the parent; the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md
 */

export { LfCheckboxFC } from "./checkbox-fc";

// Re-export FC props type from foundations
export type { LfCheckboxFCProps } from "@lf-widgets/foundations";
