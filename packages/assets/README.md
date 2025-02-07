<!-- markdownlint-disable MD033 -->

# LF Widgets

<div align="center">

[![Components](https://img.shields.io/badge/dynamic/json?logo=stencil&logoColor=black&label=Components&labelColor=white&color=black&query=components&url=https://raw.githubusercontent.com/lucafoscili/lf-widgets/main/count.json)](https://github.com/lucafoscili/lf-widgets) [![npm Package](https://img.shields.io/npm/v/@lf-widgets/core.svg?logo=npm&logoColor=black&labelColor=white&color=black)](https://www.npmjs.com/package/@lf-widgets/core)

</div>

<div align="center">

![LF Widgets Logo](https://github.com/lucafoscili/lf-widgets/blob/main/docs/images/Logo.png "LF Widgets logo")

</div>

<div align="center">

[![Development Deployment](https://img.shields.io/github/actions/workflow/status/lucafoscili/lf-widgets/publish-candidate.yaml?label=Development%20Deployment&logo=github&logoColor=black&labelColor=white&color=black&branch=candidate)](https://github.com/lucafoscili/lf-widgets/actions?query=workflow%3Apublish-candidate.yaml) [![Production Deployment](https://img.shields.io/github/actions/workflow/status/lucafoscili/lf-widgets/publish-main.yaml?label=Production%20Deployment&logo=github&logoColor=black&labelColor=white&color=black&branch=main)](https://github.com/lucafoscili/lf-widgets/actions?query=workflow%3Apublish-main.yaml)

</div>

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/lucafoscili/lf-widgets?logo=github&logoColor=black&labelColor=white&color=black) ![GitHub Actions Workflow Status - Cypress Tests](https://img.shields.io/github/actions/workflow/status/lucafoscili/lf-widgets/cypress-tests.yaml?logo=cypress&logoColor=black&labelColor=white&color=black)

</div>

LF Widgets is a lightweight and versatile Web Components library designed to enhance your web development experience.

Built with modern standards and best practices in mind, LF Widgets offers a collection of reusable components that can seamlessly integrate into any web project, regardless of the framework or vanilla JavaScript setup.

<div align="center">

[![Next.js-deployed showcase](https://img.shields.io/badge/showcase-black?style=for-the-badge&logo=next.js&logoColor=black&label=Next.js&labelColor=white&color=black&link=https%3A%2F%2Fwww.lucafoscili.com%2Flf-widgets&link=https%3A%2F%2Fwww.lucafoscili.com%2Flf-widgets)](https://www.lucafoscili.com/lf-widgets)

</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Key components](#key-components)
  - [`LfChart`](#lfchart)
  - [`LfMasonry`](#lfmasonry)
  - [`LfMessenger`](#lfmessenger)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [A `Comfy` Marriage](#a-comfy-marriage)
- [Credits](#credits)

## Features

- **Framework Agnostic**: Use with React, Vue, Angular, or just plain JavaScript.
- **Cross-Browser Compatible**: Works across all major browsers without additional polyfills.
- **Customizable**: The components are highly customizable, giving you the necessary tools to match your project's design system.
- **Oriented Towards Personal Websites/Projects**: Optimized for personal projects and small teams, LF Widgets offers simplicity, elegance, and ease of use for developers seeking fast, hassle-free integration.
- **Glassmorphism Look**: LF Widgets incorporates a glassmorphism aesthetic throughout its components. This gives a modern, transparent, and sleek appearance to the UI elements, enhancing the visual appeal of personal projects.
- **Single Event Management**: Each component emits a single generic event that encapsulates various actions.

<div align="right">

[(Back to Top)](#lf-widgets)

</div>

## Key components

### LfChart

![LfChart](https://github.com/lucafoscili/lf-widgets/blob/f3291bb78e2c56eda38d97d182e03cdbacd1ff75/docs/images/chart.png)

**Description:**  
Provides an advanced charting solution built on top of the Echarts library. It supports various chart types, including line, bar, bubble, and candlestick charts, as well as unique options like dual-axis and heatmap calendars.

**Features:**

- Multiple chart types (e.g., line, bar, bubble, candlestick).
- Highly customizable with Echarts options.
- Responsive and interactive visuals.
- Ideal for dashboards, analytics, and data visualizations.

**Use Case Highlight:**  
Perfect for building real-time dashboards, financial data visualizations, and multi-dimensional analytics with polished and professional aesthetics.

### LfMasonry

![LfMasonry](https://github.com/lucafoscili/lf-widgets/blob/f3291bb78e2c56eda38d97d182e03cdbacd1ff75/docs/images/masonry.png)

**Description:**  
Perfect for creating visually appealing layouts with items of varying sizes. It supports a dynamic masonry or waterfall grid style, making it ideal for galleries, portfolios, and content-heavy applications.

**Features:**

- Dynamically arranges items for an optimized layout.
- Supports responsive behavior for various screen sizes.
- Ideal for showcasing images, cards, or any visual elements.

**Use Case Highlight:**  
Display dynamic content, such as photo galleries or portfolio showcases, where items vary in size and need an elegant, responsive layout.

### LfMessenger

![LfMessenger](https://github.com/lucafoscili/lf-widgets/blob/f3291bb78e2c56eda38d97d182e03cdbacd1ff75/docs/images/messenger.png)

**Description:**  
Provides a customizable chat interface for interactive roleplay or AI-driven conversations. Users can define a JSON dataset of characters and initiate dynamic dialogues through a third-party API (OpenAI compatible endpoint required).

**Features:**

- Dynamic list of characters generated from a JSON dataset.
- Interactive chat interface.
- Supports integration with custom LLM endpoints for advanced interactions.
- Configurable visuals and metadata for each character.

**Use Case Highlight:**  
Perfect for creating immersive role-playing experiences, educational tools, or conversational agents where users can interact with pre-defined characters.

**Note:**  
A functional local endpoint is required for chat functionality. If the endpoint is offline, the chat interface will remain static.

## Getting Started

### Installation

To add LF Widgets to your project, you can install it via `yarn`:

```sh
yarn add lf-widgets
```

Or `npm`:

```sh
npm install lf-widgets
```

### Usage

After installing, you can import and use LF Widgets components in your project. Here's a quick example of how to use the `<lf-button>` component:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>LF Widgets Example</title>
    <script type="module" src="./path/to/lf-widgets/dist/index.js"></script>
  </head>
  <body>
    <lf-button lf-label="Click me!" />
  </body>
</html>
```

Make sure to replace `./path/to/lf-widgets/dist/index.js` with the correct path to the `index.js` file in your `node_modules/lf-widgets` directory.

The event handling is wrapped in a single event, emitted by the root element. In this small example we add a listener to the button component, performing different actions for different situations:

```javascript
const myButton = document.createElement("lf-button");

myButton.addEventListener("lf-button-event", (e) => {
  const { eventType } = e.detail;

  switch (eventType) {
    case "click":
      console.log("Click!");
      break;
    case "blur":
      console.log("Blur!");
      break;
    case "ready":
      console.log("The button is ready!");
      break;
    case "unmount":
      console.log("The button has been removed from the DOM!");
      break;
  }

  document.body.appendChild(myButton);
});
```

### Initializing LfFramework

LF Widgets ships with a small singleton “core” (`LfFramework`) that underpins theming, portals, debugging features, and more. To ensure your components work correctly (especially if they need access to themes or LLM utilities), it’s recommended to **initialize** this core before using the widgets.

Below is the **recommended** pattern, using two exported functions:

- **`getLfFramework()`**  
  Returns the LfFramework instance, initializing it if necessary.

#### Example

```ts
// In your top-level code or a dedicated file
import { getLfFramework } from "@lf-widgets/framework";

// Elsewhere, in a component or function:
function doSomething() {
  const framework = getLfFramework();
  core.assets.set("/my-assets-folder");
  core.theme.set("dark");
  // ...
}
```

#### In Your LF Widgets Components

If you’re using `<lf-button>`, `<lf-chart>`, or any other LF component, you can rely on the fact that **once `getLfFramework()` is called**, they’ll be able to access the proper theming and debugging utilities. If you skip the explicit call, any LF Widgets component that needs the core will lazily initialize it when first used.

A typical pattern in a custom element might look like:

```ts
connectedCallback() {
  const framework = getLfFramework();
  core.theme.register(this);
  this.debugInfo = core.debug.info.create();
}
```

#### Why Initialize Early?

- **Consistent Theming**: If you want to avoid a “flash” of unstyled or default theme, you can call `getLfFramework()` (and set a theme) **before** rendering components.
- **Server-Side or Client-Side**: The `getLfFramework()` function gracefully handles SSR by skipping DOM operations on the server, then running the real DOM logic in the browser.

#### Summary

1. **Call `getLfFramework()`** in a central place (like your main script or Next.js `_app.tsx`) if you need to set a theme or do immediate setup.
2. **Lazy Initialization**: If you don’t call `getLfFramework()`, the core will be initialized when the first LF Widgets component is used.

Either way, once `LfFramework` is ready, all LF Widgets have access to theming, portals, debug logging, and other shared features.

<div align="right">

[(Back to Top)](#lf-widgets)

</div>

## Documentation

For detailed information about each component, including available properties, events, and methods, please refer to the [showcase](https://www.lucafoscili.com/lf-widgets).

<div align="right">

[(Back to Top)](#lf-widgets)

</div>

## Contributing

If you discover a new bug or have an exciting idea for a new component, feel free to open an issue or a discussion! Check out the [issues](https://github.com/lucafoscili/lf-widgets/issues) or [discussions](https://github.com/lucafoscili/lf-widgets/discussions) tabs to see how you can get involved.

Pull requests are also welcome if you want to contribute firsthand. Just clone the repository and run from the root:

```sh
yarn install
```

Then you can launch the development environment with the command:

```sh
yarn dev
```

<div align="right">

[(Back to Top)](#lf-widgets)

</div>

## A `Comfy` Marriage

LF Widgets forms the backbone of [LF Nodes for ComfyUI](https://github.com/lucafoscili/comfyui-lf), a suite of custom nodes designed for **ComfyUI** workflows. This integration showcases the power and flexibility of web components, making it clear just how effortless it is to introduce new widgets into complex systems.

**Why it works:**

- **Simplicity:** Adding a new widget feels as natural as snapping pieces together.
- **Style:** The sleek design of LF Widgets components enhances any workflow.
- **Scalability:** The flexibility of web components ensures seamless integration, even as workflows grow more complex.

And… they look fantastic in action!

![LoRA Tester Workflow](https://github.com/lucafoscili/comfyui-lf/blob/0b438784ecce5bb2a3bde66cf3029d91ced61911/docs/images/Screenshot%202024-11-01%20204059.png "Screenshot taken from the LoRA tester workflow")

### Credits

| **Tool** | **Purpose** | **License** |
| --- | --- | --- |
| [Cypress](https://cypress.io/) | E2E tests engine | MIT |
| [Echarts](https://echarts.apache.org/) | Data visualization components | Apache 2.0 |
| [Google Fonts](https://fonts.google.com/) | Typography for various components | OFL |
| [Next.js](https://nextjs.org/) | Engine behind the showcase application | MIT |
| [Prism.js](https://prismjs.com/) | Syntax highlighting for code blocks | MIT |
| [Stencil.js](https://stenciljs.com/) | Web Components engine | MIT |
| [Tabler Icons](https://tabler-icons.io/) | Icon library for UI elements | MIT |

For detailed licensing information, see the [NOTICE](./NOTICE) file.

### Transition from Ketchup Lite

LF Widgets originates from a fork of [Ketchup](https://github.com/smeup/ketchup). While Ketchup provided a strong foundation, LF Widgets has been completely reimagined with a focus on:

- **Modern Aesthetics**: Adopting a sleek, glassmorphism-inspired design.
- **Enhanced Usability**: Simplified components with streamlined theming and events.
- **Unique data structure**: Each component relies on the same JSON structure.

### Icon Attribution

This project uses [Tabler Icons](https://tabler-icons.io/) under the MIT License. Icons have been customized for this project.

#### Adding Custom Icons

To add custom SVGs:

1. Ensure the SVG is neutralized (remove `width`, `height` and hardwired colors).
2. Place the SVG in the `src/assets/svg` folder.

### Font Attribution

This project uses several fonts from [Google Fonts](https://fonts.google.com/), including:

- BebasNeue-Regular
- Cinzel-Regular
- IMFellEnglishSC-Regular
- Lato-Regular
- Merriweather-Regular
- Montserrat-Regular
- Orbitron-Regular
- Oswald-Regular
- Raleway-Regular
- SawarabiMincho-Regular
- ShareTechMono-Regular
- SourceCodePro-Regular
- Staatliches-Regular
- UncialAntiqua-Regular
- VT323-Regular
- XanhMono-Regular

#### Adding Custom Fonts

To add custom fonts:

1. Ensure the font is in WOFF2 format.
2. Place the woff file in the `src/assets/fonts` folder.
3. Create or edit an existing theme to use the specified font.

<div align="right">

[(Back to Top)](#lf-widgets)

</div>
