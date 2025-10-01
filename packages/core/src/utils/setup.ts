import { LfComponent, onFrameworkReady } from "@lf-widgets/foundations";

let getAssetPath: ((path: string) => string) | undefined;
let setAssetPath: ((path: string) => void) | undefined;

// Check if we're in a Stencil component build (not browser runtime)
if (typeof window === "undefined") {
  try {
    // @ts-ignore - dynamic require for build-time only
    const stencil = require("@stencil/core");
    getAssetPath = stencil?.getAssetPath;
    setAssetPath = stencil?.setAssetPath;

    // Register with framework if Stencil is available
    if (getAssetPath && setAssetPath) {
      onFrameworkReady.then((framework) => {
        framework.register("lf-core", {
          getAssetPath,
          setAssetPath,
        });
      });
    }
  } catch {
    // Stencil not available - framework will use fallbacks
  }
}

export const awaitFramework = async (comp: LfComponent) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  framework.theme.register(this);
  return framework;
};
