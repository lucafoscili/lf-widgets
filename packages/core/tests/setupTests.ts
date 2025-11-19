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

// Polyfill File API for lf-upload tests
if (typeof File === "undefined") {
  (global as any).File = class File {
    name: string;
    type: string;
    size: number;
    lastModified: number;

    constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
      this.name = name;
      this.type = options?.type || "";
      this.size = bits.reduce((acc, bit) => {
        if (typeof bit === "string") {
          return acc + bit.length;
        } else if (bit instanceof Blob) {
          return acc + bit.size;
        } else {
          return acc + (bit as ArrayBuffer | ArrayBufferView).byteLength;
        }
      }, 0);
      this.lastModified = options?.lastModified || Date.now();
    }
  };
}
