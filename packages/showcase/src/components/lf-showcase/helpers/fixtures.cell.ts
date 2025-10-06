import {
  LfBadgePropsInterface,
  LfButtonPropsInterface,
  LfButtonStyling,
  LfCanvasPropsInterface,
  LfCardPropsInterface,
  LfChartPropsInterface,
  LfChatHistory,
  LfChatPropsInterface,
  LfChipPropsInterface,
  LfCodePropsInterface,
  LfDataCell,
  LfDataShapes,
  LfImagePropsInterface,
  LfPhotoframePropsInterface,
  LfProgressbarPropsInterface,
  LfTextfieldPropsInterface,
  LfTogglePropsInterface,
  LfTypewriterPropsInterface,
  LfUploadPropsInterface,
} from "@lf-widgets/foundations";
import {
  randomBoolean,
  randomHexColor,
  randomNumber,
  randomProperty,
  randomState,
  randomString,
} from "./fixtures.helpers";

//#region Badge
function randomBadgeCell(): LfDataCell<"badge"> {
  const partialProps: Partial<LfBadgePropsInterface> = {
    lfLabel: String(randomNumber()),
    lfUiState: randomState(),
  };
  return {
    shape: "badge",
    value: "",
    ...partialProps,
  };
}
//#endregion

//#region Button
function randomButtonCell(): LfDataCell<"button"> {
  const stylings: LfButtonStyling[] = [
    "flat",
    "floating",
    "icon",
    "outlined",
    "raised",
  ];
  const partialProps: Partial<LfButtonPropsInterface> = {
    lfLabel: randomString(),
    lfStyling: randomProperty(stylings),
  };
  return {
    shape: "button",
    value: "",
    ...partialProps,
  };
}
//#endregion

//#region Canvas
function randomCanvasCell(): LfDataCell<"canvas"> {
  const partialProps: Partial<LfCanvasPropsInterface> = {
    lfColor: randomHexColor(),
  };
  return {
    shape: "canvas",
    value: "Canvas placeholder", // might hold any string
    ...partialProps,
  };
}
//#endregion

function randomCardCell(): LfDataCell<"card"> {
  const partialProps: Partial<LfCardPropsInterface> = {};
  return {
    shape: "card",
    value: randomString(),
    ...partialProps,
  };
}

function randomChartCell(): LfDataCell<"chart"> {
  const partialProps: Partial<LfChartPropsInterface> = {};
  return {
    shape: "chart",
    value: "",
    ...partialProps,
  };
}

function randomChatCell(): LfDataCell<"chat"> {
  const partialProps: Partial<LfChatPropsInterface> = {};
  return {
    shape: "chat",
    value: [] as LfChatHistory,
    ...partialProps,
  };
}

function randomChipCell(): LfDataCell<"chip"> {
  const partialProps: Partial<LfChipPropsInterface> = {};
  return {
    shape: "chip",
    value: randomString(),
    ...partialProps,
  };
}

function randomCodeCell(): LfDataCell<"code"> {
  const partialProps: Partial<LfCodePropsInterface> = {};
  return {
    shape: "code",
    value: `console.log('${randomString()}')`,
    ...partialProps,
  };
}

function randomImageCell(): LfDataCell<"image"> {
  const partialProps: Partial<LfImagePropsInterface> = {};
  return {
    shape: "image",
    value: "",
    ...partialProps,
  };
}

function randomNumberCell(): LfDataCell<"number"> {
  return {
    shape: "number",
    value: randomNumber(1, 9999),
  };
}

function randomPhotoframeCell(): LfDataCell<"photoframe"> {
  const partialProps: Partial<LfPhotoframePropsInterface> = {};
  return {
    shape: "photoframe",
    value: "",
    ...partialProps,
  };
}

function randomProgressbarCell(): LfDataCell<"progressbar"> {
  const partialProps: Partial<LfProgressbarPropsInterface> = {};
  return {
    shape: "progressbar",
    value: randomNumber(0, 100),
    ...partialProps,
  };
}

function randomSlotCell(): LfDataCell<"slot"> {
  return {
    shape: "slot",
    value: "",
  };
}

function randomTextCell(): LfDataCell<"text"> {
  return {
    shape: "text",
    value: `Random text: ${randomString()}`,
  };
}

function randomTextFieldCell(): LfDataCell<"textfield"> {
  const partialProps: Partial<LfTextfieldPropsInterface> = {
    lfLabel: randomString(),
    lfUiState: randomState(),
  };
  return {
    shape: "textfield",
    value: "",
    ...partialProps,
  };
}

function randomToggleCell(): LfDataCell<"toggle"> {
  const partialProps: Partial<LfTogglePropsInterface> = {};
  return {
    shape: "toggle",
    value: randomBoolean(),
    ...partialProps,
  };
}

function randomTypewriterCell(): LfDataCell<"typewriter"> {
  const partialProps: Partial<LfTypewriterPropsInterface> = {};
  return {
    shape: "typewriter",
    value: "",
    ...partialProps,
  };
}

function randomUploadCell(): LfDataCell<"upload"> {
  const partialProps: Partial<LfUploadPropsInterface> = {};
  return {
    shape: "upload",
    value: "",
    ...partialProps,
  };
}

const shapeRandomizers: Record<LfDataShapes, () => LfDataCell<LfDataShapes>> = {
  badge: randomBadgeCell,
  button: randomButtonCell,
  canvas: randomCanvasCell,
  card: randomCardCell,
  chart: randomChartCell,
  chat: randomChatCell,
  chip: randomChipCell,
  code: randomCodeCell,
  image: randomImageCell,
  number: randomNumberCell,
  photoframe: randomPhotoframeCell,
  progressbar: randomProgressbarCell,
  slot: randomSlotCell,
  text: randomTextCell,
  textfield: randomTextFieldCell,
  toggle: randomToggleCell,
  typewriter: randomTypewriterCell,
  upload: randomUploadCell,
};

export function randomCellOfAnyShape(): LfDataCell<LfDataShapes> {
  const shapes = Object.keys(shapeRandomizers) as LfDataShapes[];
  const randomIndex = Math.floor(Math.random() * shapes.length);
  const chosenShape = shapes[randomIndex];
  return shapeRandomizers[chosenShape]();
}
