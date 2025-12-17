import { LfToastAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfToastFC } from "../lf-toast-fc";

//#region Props
export interface ToastFCProps {
  adapter: LfToastAdapter;
}
//#endregion

/**
 * FC for the toast component (adapter-based version).
 * Per Section 5.9 "Mirroring Rule" - encapsulates toast UI.
 *
 * This component receives an adapter and delegates rendering to LfToastFC.
 * It extracts props from the adapter and passes them to the standalone FC.
 */
export const ToastFC: FunctionalComponent<ToastFCProps> = ({ adapter }) => {
  const { controller, handlers } = adapter;
  const { get } = controller;

  const comp = get.compInstance();
  const framework = get.framework();

  const { lfCloseIcon, lfIcon, lfMessage, lfTimer, lfUiSize, lfUiState } = comp;

  return (
    <LfToastFC
      closeCallback={() => handlers.closeButton(null)}
      closeIcon={lfCloseIcon as string}
      framework={framework}
      icon={lfIcon as string}
      message={lfMessage}
      timer={lfTimer}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
