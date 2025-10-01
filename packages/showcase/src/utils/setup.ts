import { onFrameworkReady } from "@lf-widgets/foundations";
import { LfShowcase } from "../components/lf-showcase/lf-showcase";

// Conditional import to prevent browser errors when Stencil is not available
let getAssetPath: ((path: string) => string) | undefined;
let setAssetPath: ((path: string) => void) | undefined;

if (typeof window === "undefined") {
  try {
    const stencil = require("@stencil/core");
    getAssetPath = stencil.getAssetPath;
    setAssetPath = stencil.setAssetPath;
  } catch (e) {
    // Stencil not available, functions will be undefined
  }
}

onFrameworkReady.then((framework) => {
  if (getAssetPath && setAssetPath) {
    framework.register("lf-showcase", {
      getAssetPath,
      setAssetPath,
    });
  }
});

export const awaitFramework = async (comp: LfShowcase) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  return framework;
};
