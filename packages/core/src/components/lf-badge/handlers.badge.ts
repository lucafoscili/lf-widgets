import { LfBadgeAdapterHandlers } from "@lf-widgets/foundations";

export const prepBadgeHandlers = (): LfBadgeAdapterHandlers => {
  // Badge is a simple component with no child component handlers needed
  // All click handling is done directly in the JSX via onLfEvent
  return {};
};
