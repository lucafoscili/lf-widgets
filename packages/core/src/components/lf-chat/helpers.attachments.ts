import {
  LfChatAdapter,
  LfLLMAttachment,
  LfLLMChoiceMessage,
} from "@lf-widgets/foundations";
import { LfChat } from "./lf-chat";

//#region Image
/**
 * Handles image file selection and processing for chat attachments.
 * Converts images to PNG format for better LLM compatibility.
 *
 * @param comp - The chat component instance
 * @returns Promise that resolves when image processing is complete
 */
export const handleImage = async (comp: LfChat): Promise<void> => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const pngReader = new FileReader();
              pngReader.onload = () => resolve(pngReader.result as string);
              pngReader.onerror = () => reject(pngReader.error);
              pngReader.readAsDataURL(blob);
            } else {
              reject(new Error("Failed to convert image to PNG"));
            }
          }, "image/png");
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

  input.onchange = async (e) => {
    const filesList = Array.from((e.target as HTMLInputElement).files || []);
    if (filesList.length === 0) return;

    const uploader = comp.lfUploadCallback;

    if (uploader) {
      try {
        const attachments = await uploader(filesList);
        comp.currentAttachments = [...comp.currentAttachments, ...attachments];
      } catch (err) {
        console.error("Attachment upload failed", err);
      }
    } else {
      for (const file of filesList) {
        try {
          const id =
            typeof crypto !== "undefined" &&
            (crypto as Crypto & { randomUUID?: () => string }).randomUUID
              ? (crypto as Crypto & { randomUUID?: () => string }).randomUUID()
              : String(Date.now()) + String(Math.random()).slice(2, 8);
          const name = file.name;
          const type = "image_url";
          const b64Image = await fileToDataUrl(file);

          const attachment: LfLLMAttachment = {
            id,
            type,
            name,
            image_url: { url: b64Image },
          };
          comp.currentAttachments = [...comp.currentAttachments, attachment];
        } catch (err) {
          console.error("Failed to process file", file.name, err);
        }
      }
    }
  };

  input.click();
};
//#endregion

//#region File
/**
 * Handles file selection and processing for chat attachments.
 *
 * @param comp - The chat component instance
 * @returns Promise that resolves when file processing is complete
 */
export const handleFile = async (comp: LfChat): Promise<void> => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const fileToText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(file);
    });

  input.onchange = async (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      for (const file of Array.from(files)) {
        const id =
          typeof crypto !== "undefined" &&
          (crypto as Crypto & { randomUUID?: () => string }).randomUUID
            ? (crypto as Crypto & { randomUUID?: () => string }).randomUUID()
            : String(Date.now());

        let dataUrl: string | undefined;
        let content: string | undefined;

        try {
          dataUrl = await fileToDataUrl(file);
        } catch {
          dataUrl = undefined;
        }

        // Try to read as text for small text files
        if (file.size <= 1024 * 1024) {
          // 1MB limit
          try {
            content = await fileToText(file);
          } catch {
            // Not readable as text, keep undefined
          }
        }

        const attachment: LfLLMAttachment = {
          id,
          type: "file" as const,
          name: file.name,
          url: URL.createObjectURL(file),
          data: dataUrl,
          content,
        };
        comp.currentAttachments = [...comp.currentAttachments, attachment];
      }
    }
  };

  input.click();
};
//#endregion

//#region Remove
/**
 * Removes an attachment from the current message and cleans up resources.
 *
 * @param comp - The chat component instance
 * @param id - The ID of the attachment to remove
 * @returns Promise that resolves when the attachment is removed
 */
export const handleRemove = async (comp: LfChat, id: string): Promise<void> => {
  const toRemove = comp.currentAttachments.find((a) => a.id === id);
  if (
    toRemove &&
    typeof toRemove.url === "string" &&
    toRemove.url.startsWith("blob:")
  ) {
    try {
      URL.revokeObjectURL(toRemove.url);
    } catch {}
  }
  comp.currentAttachments = comp.currentAttachments.filter((a) => a.id !== id);
};
//#endregion

//#region Click (message attachments)
/**
 * Handles click on a message attachment chip.
 * Opens images in lightbox, downloads files for non-images.
 *
 * @param adapter - The chat adapter
 * @param message - The message containing the attachment
 * @param attachmentId - The ID of the clicked attachment
 */
export const handleAttachmentClick = async (
  adapter: LfChatAdapter,
  message: LfLLMChoiceMessage,
  attachmentId: string,
): Promise<void> => {
  const attachment = message.attachments?.find((a) => a.id === attachmentId);
  if (!attachment) {
    return;
  }

  const { manager } = adapter.controller.get;
  const { effects } = manager;

  if (attachment.type === "image_url") {
    // Open image in lightbox
    const imageUrl =
      attachment.image_url?.url || attachment.data || attachment.url;
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = attachment.name || "Attachment";
      img.style.maxWidth = "90vw";
      img.style.maxHeight = "90vh";
      img.style.objectFit = "contain";
      img.style.borderRadius = "var(--lf-ui-border-radius, 8px)";
      await effects.lightbox.show(img);
    }
  } else {
    // Download file
    const fileUrl = attachment.data || attachment.url;
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = attachment.name || "attachment";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
//#endregion

//#region Delete (message attachments)
/**
 * Handles deletion of an attachment from a sent message.
 * Updates the message in history with the attachment removed.
 *
 * @param adapter - The chat adapter
 * @param message - The message containing the attachment
 * @param attachmentId - The ID of the attachment to delete
 */
export const handleAttachmentDelete = async (
  adapter: LfChatAdapter,
  message: LfLLMChoiceMessage,
  attachmentId: string,
): Promise<void> => {
  const { controller } = adapter;
  const { get, set } = controller;
  const comp = get.compInstance as LfChat;

  const messageIndex = get.history().indexOf(message);
  if (messageIndex === -1) {
    return;
  }

  await set.history(() => {
    const history = get.history();
    const updatedHistory = history.map((m, i) => {
      if (i === messageIndex) {
        return {
          ...m,
          attachments: m.attachments?.filter((a) => a.id !== attachmentId),
        };
      }
      return m;
    });
    comp.history = updatedHistory;
  });
};
//#endregion
