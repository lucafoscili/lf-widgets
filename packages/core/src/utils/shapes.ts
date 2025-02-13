import { LfFrameworkInterface } from "@lf-widgets/foundations";
import { LfBadge } from "../components/lf-badge/lf-badge";
import { LfButton } from "../components/lf-button/lf-button";
import { LfCanvas } from "../components/lf-canvas/lf-canvas";
import { LfCard } from "../components/lf-card/lf-card";
import { LfChart } from "../components/lf-chart/lf-chart";
import { LfChat } from "../components/lf-chat/lf-chat";
import { LfChip } from "../components/lf-chip/lf-chip";
import { LfCode } from "../components/lf-code/lf-code";
import { LfImage } from "../components/lf-image/lf-image";
import { LfPhotoframe } from "../components/lf-photoframe/lf-photoframe";
import { LfTextfield } from "../components/lf-textfield/lf-textfield";
import { LfToggle } from "../components/lf-toggle/lf-toggle";
import { LfTypewriter } from "../components/lf-typewriter/lf-typewriter";
import { LfUpload } from "../components/lf-upload/lf-upload";

//#region defineShapes
export const defineShapes = (framework: LfFrameworkInterface) => {
  if (framework.shapes.get()) {
    return;
  }

  framework.shapes.set({
    badge: LfBadge.name,
    button: LfButton.name,
    canvas: LfCanvas.name,
    card: LfCard.name,
    chart: LfChart.name,
    chat: LfChat.name,
    chip: LfChip.name,
    code: LfCode.name,
    image: LfImage.name,
    number: LfTextfield.name,
    photoframe: LfPhotoframe.name,
    slot: LfTextfield.name,
    text: LfTextfield.name,
    toggle: LfToggle.name,
    typewriter: LfTypewriter.name,
    upload: LfUpload.name,
  });
};
//#endregion
