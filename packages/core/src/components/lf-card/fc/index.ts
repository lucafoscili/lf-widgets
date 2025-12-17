/**
 * lf-card Functional Components
 *
 * Per Section 5.9 "Mirroring Rule":
 * Each elements file maps to a corresponding FC that composes the JSX functions.
 * These FCs receive the adapter and render pure UI based on adapter state.
 *
 * Hierarchy:
 * - CardFC (wrapper that receives adapter)
 *   └── LfCardFC (pure presentational, receives individual props)
 *       ├── renderMaterialLayout()
 *       ├── renderDebugLayout()
 *       ├── renderKeywordsLayout()
 *       ├── renderUploadLayout()
 *       └── renderWeatherLayout()
 */
export * from "./card-fc";
