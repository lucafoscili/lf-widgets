/**
 * lf-badge Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Hierarchy:
 * - BadgeFC (wrapper that receives adapter)
 *   └── LfBadgeFC (pure presentational, receives individual props)
 */

// Top-level FCs (used by WC render)
export { BadgeFC, BadgeFCProps } from "./badge-fc";
