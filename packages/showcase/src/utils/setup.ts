import { onFrameworkReady } from "@lf-widgets/foundations";
import { LfShowcase } from "../components/lf-showcase/lf-showcase";

// Conditionally load Stencil asset path helpers
// Only available during Stencil component build, not in SSR frameworks like Next.js
// When unavailable, the framework uses its built-in fallback asset path functions
if (typeof window === "undefined") {
  try {
    // @ts-ignore - dynamic require for build-time only
    const stencil = require("@stencil/core");
    const getAssetPath = stencil?.getAssetPath;
    const setAssetPath = stencil?.setAssetPath;

    // Register with framework if Stencil is available
    if (getAssetPath && setAssetPath) {
      onFrameworkReady.then((framework) => {
        framework.register("lf-showcase", {
          getAssetPath,
          setAssetPath,
        });
      });
    }
  } catch {
    // Stencil not available - framework will use fallbacks
  }
}

export const awaitFramework = async (comp: LfShowcase) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  return framework;
};
