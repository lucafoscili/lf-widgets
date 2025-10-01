import {
  LfComponent,
  onFrameworkReady,
  registerStencilAssetProxies,
} from "@lf-widgets/foundations";

registerStencilAssetProxies("lf-core");

export const awaitFramework = async (comp: LfComponent) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  framework.theme.register(comp);
  return framework;
};
