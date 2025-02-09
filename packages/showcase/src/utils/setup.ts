import { onFrameworkReady } from "@lf-widgets/foundations";
import { getAssetPath, setAssetPath } from "@stencil/core";
import { LfShowcase } from "../components/lf-showcase/lf-showcase";

onFrameworkReady.then((framework) => {
  framework.register("lf-showcase", {
    getAssetPath,
    setAssetPath,
  });
});

export const awaitFramework = async (comp: LfShowcase) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  return framework;
};
