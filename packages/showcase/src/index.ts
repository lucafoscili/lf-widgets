import { getLfFramework } from "@lf-widgets/framework";
import { getAssetPath, setAssetPath } from "@stencil/core";

const framework = getLfFramework();
framework.register("lf-showcase", {
  getAssetPath,
  setAssetPath,
});

export { LfShowcase } from "./components/lf-showcase/lf-showcase";
