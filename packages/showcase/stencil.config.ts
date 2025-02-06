import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "lfws",
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
    {
      type: "www",
      copy: [
        { src: "assets" },
        { src: "../../components/dist/esm", dest: "js/components" },
      ],
      serviceWorker: null,
    },
    reactOutputTarget({
      outDir: "../showcase-react/lib/components/stencil-generated/",
    }),
  ],
  devServer: {
    openBrowser: true,
    port: 3333,
  },
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
