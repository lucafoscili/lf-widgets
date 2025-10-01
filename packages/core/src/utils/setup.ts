import { LfComponent, onFrameworkReady } from "@lf-widgets/foundations";

// Conditionally load Stencil asset path helpers
// Only available during Stencil component build, not in SSR frameworks like Next.js
// When unavailable, the framework uses its built-in fallback asset path functions
let getAssetPath: ((path: string) => string) | undefined;
let setAssetPath: ((path: string) => void) | undefined;

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
