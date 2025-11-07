/**
 * Jest setup file for Stencil component testing.
 *
 * ⚠️  CRITICAL: DO NOT DELETE THIS FILE ⚠️
 *
 * This file configures Jest for Stencil component testing by:
 * - Setting up DOM environment for web components
 * - Providing Stencil testing utilities (newSpecPage, flush, etc.)
 * - Configuring component registry and async rendering
 * - Enabling shadow DOM and CSS-in-JS testing
 *
 * Without this file, ALL component tests will fail!
 *
 * Referenced in tsconfig.json as part of the test compilation.
 */
import "jest-preset-stencil/setup-jest";
