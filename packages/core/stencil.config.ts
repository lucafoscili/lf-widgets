import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "lf-core",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "./loader",
      typesDir: "./types",
    },
    {
      type: "dist-custom-elements",
      includeGlobalScripts: true,
      externalRuntime: false,
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
  globalScript: "./src/global/global.ts",
  globalStyle: "./src/style/global.scss",
  hydratedFlag: { name: "lf-hydrated", selector: "attribute" },
  plugins: [
    sass({
      includePaths: ["./src/style"],
      injectGlobalPaths: [
        "./src/style/_mixins.scss",
        "./src/style/_variables.scss",
      ],
    }),
  ],
  sourceMap: false,
};
