/**
 * lf-splash Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Hierarchy:
 * - SplashFC (wrapper that receives adapter)
 *   └── LfSplashFC (pure presentational, receives individual props)
 */

// Top-level FCs (used by WC render)
export { SplashFC, SplashFCProps } from "./splash-fc";
