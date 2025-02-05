import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "lfw",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "./loader",
      typesDir: "./types",
    },
    {
      type: "dist-custom-elements",
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    {
      type: "dist-hydrate-script",
      dir: "hydrate-tmp",
    },
    {
      type: "docs-json",
      file: "doc.json",
    },
    { type: "docs-readme" },
    reactOutputTarget({
      outDir: "../react/lib/components/stencil-generated/",
    }),
    reactOutputTarget({
      outDir: "../react-ssr/lib/components/stencil-generated/",
      hydrateModule: "@lf-widgets/hydrate",
    }),
  ],
  globalStyle: "src/style/global.scss",
  hydratedFlag: { name: "lf-hydrated", selector: "attribute" },
  plugins: [
    sass({
      includePaths: ["./node_modules", "./src/style"],
      injectGlobalPaths: [
        "src/style/_mixins.scss",
        "src/style/_variables.scss",
      ],
    }),
  ],
  sourceMap: false,
};
