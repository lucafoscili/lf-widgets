import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "lf-framework",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "./loader",
      typesDir: "./types",
    },
    {
      type: "dist-custom-elements",
      externalRuntime: true,
    },
  ],
  rollupConfig: {
    inputOptions: {
      external: ["@lf-widgets/foundations"],
    },
  },
  hydratedFlag: { name: "lf-hydrated", selector: "attribute" },
  sourceMap: process.env.NODE_ENV === "development",
};
