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
  plugins: [
    sass({
      includePaths: ["./node_modules", "./src/style"],
    }),
  ],
  rollupConfig: {
    inputOptions: {
      external: ["@lf-widgets/foundations", "@lf-widgets/framework"],
    },
  },
  sourceMap: false,
};
