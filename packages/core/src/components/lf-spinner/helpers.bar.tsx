import { h, VNode } from "@stencil/core";

//#region Bars
export const LF_SPINNER_BARS: {
  [key: number]: {
    className: string;
    elements: (progress?: number) => VNode[];
  };
} = {
  1: {
    className: "spinner-bar-v1",
    elements: () => [],
  },
  2: {
    className: "spinner-bar-v2",
    elements: () => [],
  },
  3: {
    className: "spinner-bar-v3",
    elements: (progress: number) => [
      <div class="progress-bar" style={{ width: `${progress}%` }}></div>,
    ],
  },
};
//#endregion
