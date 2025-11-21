import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "lf-core",
  outputTargets: [
    {
      esmLoaderPath: "./loader",
      type: "dist",
      typesDir: "./types",
    },
    {
      externalRuntime: false,
      type: "dist-custom-elements",
    },
    {
      type: "docs-json",
      file: "doc.json",
    },
    { type: "docs-readme" },
    reactOutputTarget({
      outDir: "../react-core/lib/components/stencil-generated/",
    }),
  ],
  rollupConfig: {
    inputOptions: {
      external: ["@lf-widgets/foundations", "@lf-widgets/framework"],
    },
  },
  hydratedFlag: { name: "lf-hydrated", selector: "attribute" },
  plugins: [
    sass({
      includePaths: ["./src/style"],
      injectGlobalPaths: [],
    }),
  ],
  sourceMap: process.env.NODE_ENV === "development",
  testing: {
    testPathIgnorePatterns: ["<rootDir>/cypress/"],
    moduleNameMapper: {
      "^@lf-widgets/foundations$": "<rootDir>/../foundations/src/index.ts",
      "^@lf-widgets/framework$": "<rootDir>/../framework/dist/index.cjs.js",
    },
  },
};
