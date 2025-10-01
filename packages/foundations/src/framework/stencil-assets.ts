import { LfFrameworkModuleKey } from "./framework.declarations";
import { onFrameworkReady } from "./framework.constants";

type AssetHelperKey = "getAssetPath" | "setAssetPath";
type AssetHelper = (path: string) => string | void;

const getGlobalScope = (): any => {
  if (typeof globalThis === "undefined") {
    return undefined;
  }

  return globalThis as any;
};

const getStencilHelper = (key: AssetHelperKey): AssetHelper | undefined => {
  const globalScope = getGlobalScope();

  const candidates = [
    globalScope?.StencilCore,
    globalScope?.app,
    globalScope?.App,
    globalScope?.lfWidgets,
    globalScope,
  ];

  for (const candidate of candidates) {
    const helper = candidate?.[key];
    if (typeof helper === "function") {
      return helper.bind(candidate);
    }
  }

  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const stencil = require("@stencil/core");
      const helper = stencil?.[key];
      if (typeof helper === "function") {
        return helper;
      }
    } catch {
      // Stencil helpers not available in this environment.
    }
  }

  return undefined;
};

const getAssetPathProxy = (path: string): string => {
  const helper = getStencilHelper("getAssetPath");

  if (helper) {
    try {
      const result = helper(path);
      if (typeof result === "string" && result.length > 0) {
        return result;
      }
    } catch {
      // Fallback below when helper invocation fails.
    }
  }

  return path;
};

const setAssetPathProxy = (path: string): void => {
  const helper = getStencilHelper("setAssetPath");

  if (helper) {
    try {
      helper(path);
    } catch {
      // Ignore errors: the framework fallback will manage asset paths.
    }
  }
};

export const registerStencilAssetProxies = (
  module: LfFrameworkModuleKey,
): void => {
  onFrameworkReady
    .then((framework) => {
      framework.register(module, {
        getAssetPath: getAssetPathProxy,
        setAssetPath: setAssetPathProxy,
      });
    })
    .catch(() => {
      // If the framework never becomes ready (e.g., during SSR), there's nothing to register.
    });
};
