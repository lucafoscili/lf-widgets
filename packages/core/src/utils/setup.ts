import { LfComponent, onFrameworkReady } from "@lf-widgets/foundations";
import { getAssetPath, setAssetPath } from "@stencil/core";

onFrameworkReady.then((framework) => {
  framework.register("lf-core", {
    getAssetPath,
    setAssetPath,
  });
});

export const awaitFramework = async (comp: LfComponent) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  framework.theme.register(this);
  return framework;
};
