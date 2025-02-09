import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "lf-showcase",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "./loader",
      typesDir: "./types",
    },
    {
      type: "dist-custom-elements",
      externalRuntime: false,
    },
    reactOutputTarget({
      outDir: "../react-showcase/lib/components/stencil-generated/",
    }),
  ],
  hydratedFlag: { name: "lf-hydrated", selector: "attribute" },
  globalScript: "./src/global/global.ts",
  plugins: [
    sass({
      includePaths: ["./node_modules", "./src/style"],
      injectGlobalPaths: [
        "./src/style/_mixins.scss",
        "./src/style/_variables.scss",
      ],
    }),
  ],
  rollupConfig: {
    inputOptions: {
      external: ["@lf-widgets/foundations", "@lf-widgets/framework"],
    },
  },
  sourceMap: false,
};
