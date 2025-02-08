import { onFrameworkReady } from "@lf-widgets/foundations";
import { getAssetPath, setAssetPath } from "@stencil/core";

onFrameworkReady.then((framework) => {
  framework.register("lf-showcase", {
    getAssetPath,
    setAssetPath,
  });
});

export { LfShowcase } from "./components/lf-showcase/lf-showcase";
