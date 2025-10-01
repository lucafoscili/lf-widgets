import { onFrameworkReady } from "@lf-widgets/foundations";
import { LfShowcase } from "../components/lf-showcase/lf-showcase";

export const awaitFramework = async (comp: LfShowcase) => {
  const framework = await onFrameworkReady;
  comp.debugInfo = framework.debug.info.create();
  return framework;
};
