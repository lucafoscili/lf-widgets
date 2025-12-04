import { LfCardAdapter, LfDataCell } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";
import { LfCard } from "./lf-card";

//#region Material layout
/**
 * Prepares the material layout for the LfCard component.
 *
 * @param {() => LfCardAdapter} getAdapter - Function to get the LfCardAdapter instance.
 * @returns {VNode} The virtual node representing the material layout.
 */
export const prepMaterial = (getAdapter: () => LfCardAdapter): VNode => {
  const {
    blocks,
    compInstance,
    defaults,
    lfAttributes,
    manager,
    parts,
    shapes,
  } = getAdapter().controller.get;
  const { material } = defaults;
  const { theme } = manager;
  const { bemClass } = theme;
  const { materialLayout, textContent } = blocks;

  const { button, image, text } = shapes();
  const comp = compInstance as LfCard;

  //#region Button
  const buttons: LfDataCell<"button">[] = [];
  for (let index = 0; index < button.length; index++) {
    buttons.push(
      <LfShape
        shape={"button"}
        cell={button[index]}
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
      ></LfShape>,
    );
  }
  const hasButton = Boolean(buttons?.length);
  //#endregion

  //#region Image
  const images: LfDataCell<"image">[] = [];
  const imagesDef = material.image();
  for (let index = 0; index < image.length; index++) {
    images.push(
      <LfShape
        shape={"image"}
        cell={
          imagesDef[index]
            ? Object.assign(imagesDef[index], image[index])
            : image[index]
        }
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
      ></LfShape>,
    );
  }
  const hasImage = Boolean(images?.length);
  //#endregion

  //#region Text
  const texts: LfDataCell<"text">[] = [];
  for (let index = 0; index < text.length; index++) {
    texts.push(
      <LfShape
        shape={"text"}
        cell={text[index]}
        index={index}
        eventDispatcher={async (e) => comp.onLfEvent(e, "lf-event")}
        framework={manager}
      ></LfShape>,
    );
  }
  const hasText = Boolean(texts?.length);
  const title = (hasText && text?.[0]?.value) || null;
  const subtitle = (hasText && text?.[1]?.value) || null;
  const description = (hasText && text?.[2]?.value) || null;
  //#endregion

  const { refs } = getAdapter().elements;

  return (
    <div
      class={bemClass(materialLayout._, null, {
        "has-actions": hasButton,
      })}
      data-lf={lfAttributes[comp.lfUiState]}
      part={parts.materialLayout}
      ref={(el: HTMLDivElement) => {
        if (el) {
          refs.layouts.material = el;
        }
      }}
    >
      {hasImage && (
        <div class={bemClass(materialLayout._, materialLayout.coverSection)}>
          {images[0]}
        </div>
      )}
      <div class={bemClass(materialLayout._, materialLayout.textSection)}>
        {title && (
          <div class={bemClass(textContent._, textContent.title)}>{title}</div>
        )}
        {subtitle && (
          <div class={bemClass(textContent._, textContent.subtitle)}>
            {subtitle}
          </div>
        )}
        {description && (
          <div class={bemClass(textContent._, textContent.description)}>
            {description}
          </div>
        )}
      </div>
      {hasButton && (
        <div class={bemClass(materialLayout._, materialLayout.actionsSection)}>
          {buttons}
        </div>
      )}
    </div>
  );
};
