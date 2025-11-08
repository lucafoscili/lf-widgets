import { LfCheckboxPropsInterface } from "./checkbox.declarations";

export const LF_CHECKBOX_BLOCKS = {
  formField: {
    _: "form-field",
    label: "label",
  },
  checkbox: {
    _: "checkbox",
    label: "label",
    nativeControl: "native-control",
    background: "background",
    checkmark: "checkmark",
    mixedmark: "mixedmark",
  },
} as const;

export const LF_CHECKBOX_EVENTS = [
  "blur",
  "change",
  "focus",
  "pointerdown",
  "ready",
  "unmount",
] as const;

export const LF_CHECKBOX_PARTS = {
  label: "label",
  nativeControl: "native-control",
  checkbox: "checkbox",
  background: "background",
  checkmark: "checkmark",
  mixedmark: "mixedmark",
} as const;

export const LF_CHECKBOX_PROPS = [
  "lfAriaLabel",
  "lfLabel",
  "lfLeadingLabel",
  "lfRipple",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfCheckboxPropsInterface)[];

export const LF_CHECKBOX_STATES = ["off", "on", "indeterminate"] as const;
