import { onFrameworkReady } from "@lf-widgets/foundations";
import { getAssetPath, setAssetPath } from "@stencil/core";

onFrameworkReady.then((framework) => {
  framework.register("lf-core", {
    getAssetPath,
    setAssetPath,
  });
});

export * from "./components";
