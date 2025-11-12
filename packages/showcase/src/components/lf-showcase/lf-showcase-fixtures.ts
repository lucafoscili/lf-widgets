import {
  LfArticleDataset,
  LfDataDataset,
  LfFrameworkInterface,
  LfThemeIconRegistry,
} from "@lf-widgets/foundations";
import { version as LF_WIDGETS_VERSION } from "../../../package.json";
import { DOC_IDS } from "./helpers/constants";

// version is now imported directly as LF_WIDGETS_VERSION

/**
 * Creates a dataset of component definitions for the LF Showcase.
 * Each component entry includes an icon, description, ID, and display value.
 *
 * @param icons - An object containing icon references from the LfThemeIconRegistry
 * @returns {LfDataDataset} A dataset object containing an array of component nodes
 *
 * The returned dataset includes documentation for components like:
 * - Accordion
 * - Article
 * - Badge
 * - Button
 * - Canvas
 * - And many other UI components
 *
 * Each node in the dataset follows the structure:
 * ```
 * {
 *   description: string;
 *   icon: IconType;
 *   id: string;
 *   value: string;
 * }
 * ```
 */
export const LF_SHOWCASE_COMPONENTS = (
  icons: LfThemeIconRegistry,
): LfDataDataset => {
  const {
    adjustmentsHorizontal,
    article,
    brush,
    chartColumn,
    chartHistogram,
    checkbox,
    code,
    forms,
    hexagonInfo,
    id,
    imageInPicture,
    innerShadowBottom,
    layoutBoardSplit,
    layoutList,
    layoutNavbar,
    layoutNavbarInactive,
    layoutSidebar,
    list,
    listTree,
    loader,
    loader2,
    messageCircleUser,
    messages,
    notification,
    photo,
    photoSearch,
    playstationCircle,
    progress,
    replace,
    slideshow,
    squareToggle,
    toggleRight,
    upload,
    writing,
  } = icons;

  return {
    nodes: [
      {
        description: "Displays slots as an accordion.",
        icon: layoutList,
        id: "Accordion",
        value: "Accordion",
      },
      {
        description:
          "Generates semantic HTML for articles based on a JSON input.",
        icon: article,
        id: "Article",
        value: "Article",
      },
      {
        description:
          "Displays a count and label to provide context to content.",
        icon: notification,
        id: "Badge",
        value: "Badge",
      },
      {
        description:
          "Provides a reusable button for various user interactions.",
        icon: innerShadowBottom,
        id: "Button",
        value: "Button",
      },
      {
        description:
          "Invisible canvas to draw upon, emitting stroke-related events.",
        icon: brush,
        id: "Canvas",
        value: "Canvas",
      },
      {
        description:
          "Displays content and actions related to a single topic in card format.",
        icon: id,
        id: "Card",
        value: "Card",
      },
      {
        description:
          "Provides a navigable slideshow of images or content cards.",
        icon: slideshow,
        id: "Carousel",
        value: "Carousel",
      },
      {
        description:
          "Integrates multiple types of charts using the Echarts library.",
        icon: chartHistogram,
        id: "Chart",
        value: "Chart",
      },
      {
        description: "A simple chat module to interact with a local LLM.",
        icon: messages,
        id: "Chat",
        value: "Chat",
      },
      {
        description:
          "Checkbox component with three states: on, off, indeterminate.",
        icon: checkbox,
        id: "Checkbox",
        value: "Checkbox",
      },
      {
        description: "Widget that can be used to display multiple items",
        icon: chartColumn,
        id: "Chip",
        value: "Chip",
      },
      {
        description: "Visualizes code in a readable format.",
        icon: code,
        id: "Code",
        value: "Code",
      },
      {
        description: "Compare two different components.",
        icon: squareToggle,
        id: "Compare",
        value: "Compare",
      },
      {
        description: "Acts as the side menu within the application layout.",
        icon: layoutSidebar,
        id: "Drawer",
        value: "Drawer",
      },
      {
        description: "Serves as the top header bar for the application.",
        icon: layoutNavbar,
        id: "Header",
        value: "Header",
      },
      {
        description: "Displays images and icons.",
        icon: photo,
        id: "Image",
        value: "Image",
      },
      {
        description: "A layout designed to display images.",
        icon: photoSearch,
        id: "Imageviewer",
        value: "Image viewer",
      },
      {
        description: "A component that displays a list of items.",
        icon: list,
        id: "List",
        value: "List",
      },
      {
        description:
          "Designed to display images as a masonry or in waterfall view.",
        icon: layoutBoardSplit,
        id: "Masonry",
        value: "Masonry",
      },
      {
        description:
          "An interface connecting between the user and an LLM for roleplay.",
        icon: messageCircleUser,
        id: "Messenger",
        value: "Messenger",
      },
      {
        description:
          "Shows a placeholder image until the actual image is loaded upon entering viewport.",
        icon: imageInPicture,
        id: "Photoframe",
        value: "Photoframe",
      },
      {
        description:
          "Displays a placeholder until content is ready or enters the viewport.",
        icon: replace,
        id: "Placeholder",
        value: "Placeholder",
      },
      {
        description: "Displays the percentage of completion.",
        icon: progress,
        id: "Progressbar",
        value: "Progress bar",
      },
      {
        description: "Component for selecting a single option from a list.",
        icon: playstationCircle,
        id: "Radio",
        value: "Radio",
      },
      {
        description:
          "Combines textfield styling with list functionality for dropdown selection.",
        icon: id,
        id: "Select",
        value: "Select",
      },
      {
        description: "Simple component for selecting a range of values.",
        icon: adjustmentsHorizontal,
        id: "Slider",
        value: "Slider",
      },
      {
        description:
          "Indicates a loading state, commonly used during content or page loading.",
        icon: loader2,
        id: "Spinner",
        value: "Spinner",
      },
      {
        description:
          "Full-screen component for prominent app branding or introductory content.",
        icon: loader,
        id: "Splash",
        value: "Splash",
      },
      {
        description: "Provides a bar of clickable tabs for navigation.",
        icon: layoutNavbarInactive,
        id: "Tabbar",
        value: "Tab bar",
      },
      {
        description: "Component for text input fields.",
        icon: forms,
        id: "Textfield",
        value: "Text field",
      },
      {
        description: "Displays notification messages in a simple format.",
        icon: hexagonInfo,
        id: "Toast",
        value: "Toast",
      },
      {
        description: "Simple component to toggle a boolean state on and off.",
        icon: toggleRight,
        id: "Toggle",
        value: "Toggle",
      },
      {
        description: "Renders a tree structure to display hierarchical data.",
        icon: listTree,
        id: "Tree",
        value: "Tree",
      },
      {
        description:
          "Simulates a typewriter's behavior by displaying text gradually.",
        icon: writing,
        id: "Typewriter",
        value: "Typewriter",
      },
      {
        description: "Provides functionality to upload files easily.",
        icon: upload,
        id: "Upload",
        value: "Upload",
      },
    ],
  };
};
/**
 * Creates a dataset showcasing the main framework elements of the library.
 * Each node in the dataset represents a different framework with its description and associated icon.
 *
 * @param icons - An object containing icon references from the LfThemeIconRegistry
 * @returns {LfDataDataset} A dataset containing nodes, where each node represents a framework
 *                          with properties: description, icon, id, and value
 */
export const LF_SHOWCASE_FRAMEWORK = (
  icons: LfThemeIconRegistry,
): LfDataDataset => {
  const {
    bug,
    colorSwatch,
    door,
    dragDrop,
    droplet,
    highlight,
    ikosaedr,
    palette,
    robot,
    schema,
  } = icons;

  return {
    nodes: [
      {
        description: "Toolkit to manage and transform colors.",
        icon: palette,
        id: "Color",
        value: "Color",
      },
      {
        description: "Dataset management and manipulation.",
        icon: schema,
        id: "Data",
        value: "Data",
      },
      {
        description: "Utility for debugging and for code observability.",
        icon: bug,
        id: "Debug",
        value: "Debug",
      },
      {
        description: "Utility to handle drag and drop operations.",
        icon: dragDrop,
        id: "Drag",
        value: "Drag",
      },
      {
        description: "Ripple effect triggered on click.",
        icon: droplet,
        id: "Effects",
        value: "Effects",
      },
      {
        description: "Handles various management tasks within the library.",
        icon: ikosaedr,
        id: "Framework",
        value: "Framework",
      },
      {
        description: "Utility to connect with Open-AI compatible endpoints.",
        icon: robot,
        id: "Llm",
        value: "Llm",
      },
      {
        description: "Takes care of displaying elements dynamically.",
        icon: door,
        id: "Portal",
        value: "Portal",
      },
      {
        description: "Provides syntax highlighting and markdown parsing.",
        icon: highlight,
        id: "Syntax",
        value: "Syntax",
      },
      {
        description: "Design system of the library.",
        icon: colorSwatch,
        id: "Theme",
        value: "Theme",
      },
    ],
  };
};
export const LF_DOC = (framework: LfFrameworkInterface): LfArticleDataset => {
  return {
    nodes: [
      {
        id: DOC_IDS.root,
        value: `LF Widgets`,
        children: [
          {
            id: DOC_IDS.section,
            value: "",
            children: [
              {
                id: DOC_IDS.paragraph,
                value: "",
                children: [
                  {
                    cells: {
                      lfImage: {
                        lfValue: framework.assets.get(
                          "./assets/showcase/LFW.jpg",
                        ).path,
                        shape: "image",
                        value: "",
                      },
                    },
                    id: DOC_IDS.contentWrapper,
                    value: "",
                  },
                ],
              },
              {
                id: DOC_IDS.paragraph,
                value: `v${LF_WIDGETS_VERSION}`,
                children: [
                  {
                    id: DOC_IDS.contentWrapper,
                    value:
                      "This page is designed to showcase LF Widgets webcomponents.",
                  },
                ],
              },
              {
                id: DOC_IDS.paragraph,
                value: "",
                children: [
                  {
                    id: DOC_IDS.contentWrapper,
                    value:
                      "If this is the first time that you stumble upon the library and want to know more, you should check out the GitHub repository (link below!)",
                  },
                ],
              },
              {
                id: DOC_IDS.paragraph,
                value: "",
                children: [
                  {
                    id: DOC_IDS.contentWrapper,
                    value:
                      "In short: LF Widgets is a framework-agnostic web components library built with Stencil.js, offering offering lightweight and stylish components for web pages.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
