import { getLfFramework } from "@lf-widgets/framework";
import { getAssetPath, setAssetPath } from "@stencil/core";

const framework = getLfFramework();
framework.register("lf-core", {
  getAssetPath,
  setAssetPath,
});

export * from "./components";
