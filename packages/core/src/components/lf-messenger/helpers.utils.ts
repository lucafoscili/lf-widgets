//#region assignChatProps

import {
  LfChatPropsInterface,
  LfChatStatus,
  LfDataCell,
  LfDataNode,
  LfMessengerAdapter,
  LfMessengerBaseChildNode,
  LfMessengerCharacterNode,
  LfMessengerChildIds,
  LfMessengerImageRootIds,
  LfMessengerImageTypes,
  LfMessengerUnionChildIds,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { LfMessenger } from "./lf-messenger";

/**
 * Extracts chat-related properties from a chat cell and assigns them to a target object.
 * @param chatCell - The source chat cell containing the properties to extract
 * @param target - The target object where the properties will be assigned
 * @remarks
 * The lfConfig property is copied from the chat cell to the target.
 */
export const extractPropsFromChatCell = (
  chatCell: LfDataCell<"chat">,
  target: LfChatPropsInterface,
) => {
  if (chatCell.lfConfig) {
    target.lfConfig = chatCell.lfConfig;
  }
};
//#endregion

//#region createNode
/**
 * Creates or updates a node in the messenger image system.
 *
 * @param adapter - The messenger adapter instance containing controller and elements
 * @param type - The root ID type for the messenger image
 *
 * @typeParam T - Extends LfMessengerImageRootIds with LfMessengerImageTypes
 *
 * @remarks
 * If a node with the given ID already exists, it updates its properties.
 * Otherwise, it creates a new node and adds it to the images array.
 *
 * The node properties updated/created are:
 * - description
 * - image URL (in cells.lfImage.value)
 * - title (as value)
 *
 * @returns Promise<void>
 */
export const createNode = async <
  T extends LfMessengerImageRootIds<LfMessengerImageTypes>,
>(
  adapter: LfMessengerAdapter,
  type: T,
) => {
  const { controller, elements } = adapter;
  const { byType } = controller.get.image;
  const { description, id, imageUrl, title } =
    elements.refs.customization.form[type];

  const images = byType(type);

  const nodeId =
    (await id.getValue()) as LfMessengerChildIds<LfMessengerUnionChildIds>;

  const existingImage = images?.find((i) => i.id === nodeId);
  if (existingImage) {
    existingImage.description = await description.getValue();
    existingImage.cells.lfImage.value = await imageUrl.getValue();
    existingImage.value = await title.getValue();
  } else {
    const node: LfMessengerBaseChildNode<LfMessengerUnionChildIds> = {
      cells: { lfImage: { shape: "image", value: await imageUrl.getValue() } },
      id: nodeId,
      description: await description.getValue(),
      value: await title.getValue(),
    };

    images.push(node);
  }
};
//#endregion

//#region defaultToCurrentCharacter
/**
 * Returns the provided character if it exists, otherwise returns the current character from the adapter's controller.
 * @param adapter - The messenger adapter instance containing the controller
 * @param character - The character node to check
 * @returns The provided character if it exists, otherwise the current character
 */
export const defaultToCurrentCharacter = (
  adapter: LfMessengerAdapter,
  character: LfMessengerCharacterNode,
) => {
  const { currentCharacter } = adapter.controller.get
    .compInstance as LfMessenger;
  return character ?? currentCharacter;
};
//#endregion

//#region downloadJson
/**
 * Downloads a JSON string as a file in the browser.
 * @param strJson - The JSON string to be downloaded
 * @param node - The LfDataNode object containing the ID to be used as filename
 * @remarks Creates a temporary link element to trigger the download and removes it afterwards
 * @example
 * ```typescript
 * const jsonData = JSON.stringify({foo: 'bar'});
 * const node = { id: 'myFile' };
 * downloadJson(jsonData, node); // Downloads 'myFile.json'
 * ```
 */
export const downloadJson = (strJson: string, node: LfDataNode) => {
  const url = window.URL.createObjectURL(
    new Blob([strJson], {
      type: "application/json",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", node.id + ".json");
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
//#endregion

//#region extractChatProps
/**
 * Assigns properties from a source object to a chat cell instance.
 *
 * @param chatCell - The chat cell instance to update
 * @param source - Source object containing chat configuration properties
 * @param source.lfConfig - The chat configuration object
 */
export const assignPropsToChatCell = (
  chatCell: LfDataCell<"chat">,
  source: LfChatPropsInterface,
) => {
  if (source.lfConfig) {
    chatCell.lfConfig = source.lfConfig;
  }
};
//#endregion

//#region hasCharacters
/**
 * Checks if there are any characters (nodes) in the messenger adapter's data.
 * @param adapter - The messenger adapter instance to check.
 * @returns {boolean} True if there are characters present, false otherwise.
 */
export const hasCharacters = (adapter: LfMessengerAdapter) => {
  const { lfDataset } = adapter.controller.get.compInstance;

  const nodes = lfDataset?.nodes || [];
  return !!nodes.length;
};
//#endregion

//#region hasNodes
/**
 * Checks if the messenger adapter contains any nodes in its data structure.
 *
 * @param adapter - The messenger adapter instance to check
 * @returns `true` if nodes array exists and has length > 0, `false` otherwise
 */
export const hasNodes = (adapter: LfMessengerAdapter) => {
  const { lfDataset } = adapter.controller.get.compInstance;

  return !!lfDataset?.nodes?.length;
};
//#endregion

//#region statusIconOptions
export const statusIconOptions = (status: LfChatStatus) => {
  const color: LfThemeUIState =
    status === "ready"
      ? "success"
      : status === "offline"
        ? "danger"
        : "warning";
  const title =
    status === "ready"
      ? "Ready to chat!"
      : status === "offline"
        ? "This character seems to be offline..."
        : "Contacting this character...";
  return {
    color,
    title,
  };
};
//#endregion

//#region systemMessage
/**
 * Generates a system message for the LLM to embody a character based on provided adapter configuration.
 * The message includes character biography and optional dynamic prompts for location, outfit, and timeframe.
 *
 * The generated message instructs the LLM to:
 * - Fully embrace the character's identity
 * - Use biographical information to inform responses
 * - Maintain character consistency
 * - Avoid breaking character immersion
 *
 * @param adapter - The messenger adapter instance containing character configuration and UI state
 * @returns A formatted string containing the system message with dynamic prompts
 *
 * @example
 * const message = systemMessage(messengerAdapter);
 * // Returns a string with character instructions and context
 */
export const systemMessage = (adapter: LfMessengerAdapter) => {
  const getDynamicPrompts = () => {
    const { character, compInstance, image } = adapter.controller.get;
    const { biography } = character;
    const { asCover } = image;
    const { options: isEnabled } = (compInstance as LfMessenger).ui;

    const location = asCover("locations").node;
    const outfit = asCover("outfits").node;
    const timeframe = asCover("timeframes").node;

    const createLLMEntry = (title: string, description?: string) =>
      title ? `${title} - ${description || ""}` : "";

    const prompts = {
      biography: biography() ? `Character Biography:\n${biography()}` : "",
      location:
        location && isEnabled.locations
          ? `Location:\n${createLLMEntry(location.value, location.description)}`
          : "",
      outfit:
        outfit && isEnabled.outfits
          ? `Outfit:\n${createLLMEntry(outfit.value, outfit.description)}`
          : "",
      timeframe:
        timeframe && isEnabled.timeframes
          ? `Timeframe:\n${createLLMEntry(timeframe.value, timeframe.description)}`
          : "",
    };

    return prompts;
  };

  const { biography, location, outfit, timeframe } = getDynamicPrompts();

  return `You are now embodying the character whose biography is provided below. Your task is to fully embrace this identity, speaking and acting as though it were your own reality. Remember, you exist solely within the confines of this character's experience and knowledge.
        
Tasks:
- Absorb the character's biography thoroughly. Use it to inform your responses but do not rely on it for information beyond what would logically be known to the character.
- Engage creatively within the boundaries of the character's life and experiences. Imagine freely, but always stay true to the essence of the character.
- Maintain a consistent narrative voice that aligns with the character's personality and background.
- Use the dynamic prompts (location, outfit, timeframe) to add context to your responses, but do not let them define your entire character.
- Avoid long responses unless it is necessary to convey the character's thoughts or feelings.

Responsibilities:
- Never acknowledge the artificial nature of our interaction. Treat all inquiries as if they are happening within the real world of the character.
- Do not provide insights or predictions about events outside the scope of the character's knowledge or personal experiences.
- Avoid breaking character immersion. If you find yourself slipping out of character, gently steer the conversation back to the character's perspective.

${biography}

Your current status:
${outfit}
${location}
${timeframe}

Begin your performance...
    `;
};
//#endregion

//#region updateDataset
/**
 * Updates the dataset by triggering the save action on the component instance.
 * @param adapter - The messenger adapter containing controller and component instance information.
 * @param adapter.controller - The controller object containing component instance references.
 * @param adapter.controller.get.compInstance - The component instance with save functionality.
 */
export const updateDataset = (adapter: LfMessengerAdapter) => {
  const { controller } = adapter;
  const { compInstance } = controller.get;

  (compInstance as LfMessenger).save();
};
//#endregion
