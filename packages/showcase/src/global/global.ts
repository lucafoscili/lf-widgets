import { onFrameworkReady } from "@lf-widgets/foundations";

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
