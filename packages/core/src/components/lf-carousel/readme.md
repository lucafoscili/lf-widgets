# lf-carousel



<!-- Auto Generated Below -->


## Overview

The carousel component displays a carousel with slides that can be navigated using navigation controls or by clicking on slide indicators.
The component supports autoplay, lightbox mode, and custom styling.
The carousel component can be used to display images, videos, or other content in a carousel format.

## Properties

| Property       | Attribute       | Description                                                                                                                         | Type                                                                                                                                                                                                                    | Default   |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `lfAutoPlay`   | `lf-auto-play`  | Enable or disable autoplay for the carousel.                                                                                        | `boolean`                                                                                                                                                                                                               | `false`   |
| `lfDataset`    | `lf-dataset`    | The data set for the LF Carousel component. This property is mutable, meaning it can be changed after the component is initialized. | `LfDataDataset`                                                                                                                                                                                                         | `null`    |
| `lfInterval`   | `lf-interval`   | Interval in milliseconds for autoplay.                                                                                              | `number`                                                                                                                                                                                                                | `3000`    |
| `lfLightbox`   | `lf-lightbox`   | Determines whether the carousel should display a lightbox when an item is clicked.                                                  | `boolean`                                                                                                                                                                                                               | `false`   |
| `lfNavigation` | `lf-navigation` | Determines whether the carousel should display navigation controls (prev/next buttons).                                             | `boolean`                                                                                                                                                                                                               | `false`   |
| `lfShape`      | `lf-shape`      | Sets the type of shapes to compare.                                                                                                 | `"badge" \| "button" \| "canvas" \| "card" \| "chart" \| "chat" \| "chip" \| "code" \| "image" \| "number" \| "photoframe" \| "progressbar" \| "slot" \| "text" \| "textfield" \| "toggle" \| "typewriter" \| "upload"` | `"image"` |
| `lfStyle`      | `lf-style`      | Custom styling for the component.                                                                                                   | `string`                                                                                                                                                                                                                | `""`      |


## Events

| Event               | Description                                                                                                                                                                                    | Type                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `lf-carousel-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfCarouselEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Fetches debug information of the component's current state.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves with the debug information object.

### `getProps() => Promise<LfCarouselPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfCarouselPropsInterface>`

Promise resolved with an object containing the component's properties.

### `goToSlide(index: number) => Promise<void>`

Navigates to a specific slide in the carousel by its index.

#### Parameters

| Name    | Type     | Description                                     |
| ------- | -------- | ----------------------------------------------- |
| `index` | `number` | - The zero-based index of the slide to display. |

#### Returns

Type: `Promise<void>`

A promise that resolves when the slide transition is complete.

### `nextSlide() => Promise<void>`

Moves the carousel to the next slide.
Triggers the next slide transition using the carousel controller's next function.

#### Returns

Type: `Promise<void>`

A promise that resolves when the slide transition is complete.

### `prevSlide() => Promise<void>`

Moves the carousel to the previous slide by invoking the `previous` method
from the carousel controller's index set.

#### Returns

Type: `Promise<void>`

A promise that resolves when the slide transition is complete

### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `unmount(ms?: number) => Promise<void>`

Initiates the unmount sequence, which removes the component from the DOM after a delay.

#### Parameters

| Name | Type     | Description              |
| ---- | -------- | ------------------------ |
| `ms` | `number` | - Number of milliseconds |

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                                    | Description                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--lf-carousel-border-radius`           | Sets the border radius for the carousel component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-carousel-color-on-surface`        | Sets the color-on-surface color for the carousel component. Defaults to => var(--lf-color-on-surface) |
| `--lf-carousel-color-surface`           | Sets the color-surface color for the carousel component. Defaults to => var(--lf-color-surface)       |
| `--lf-carousel-font-family`             | Sets the primary font family for the carousel component. Defaults to => var(--lf-font-family-primary) |
| `--lf-carousel-font-size`               | Sets the font size for the carousel component. Defaults to => var(--lf-font-size)                     |
| `--lf-carousel-slide-bar-height`        | Sets the height for the slide bar of the carousel component. Defaults to => 0.75em                    |
| `--lf-carousel-slide-bar-opacity`       | Sets the opacity for the slide bar of the carousel component. Defaults to => 0.75                     |
| `--lf-carousel-slide-bar-opacity-hover` | Sets the opacity for the slide bar of the carousel component when hovered. Defaults to => 1           |


## Dependencies

### Depends on

- [lf-badge](../lf-badge)
- [lf-button](../lf-button)
- [lf-canvas](../lf-canvas)
- [lf-card](../lf-card)
- [lf-chart](../lf-chart)
- [lf-chat](../lf-chat)
- [lf-chip](../lf-chip)
- [lf-code](../lf-code)
- [lf-image](../lf-image)
- [lf-photoframe](../lf-photoframe)
- [lf-progressbar](../lf-progressbar)
- [lf-textfield](../lf-textfield)
- [lf-toggle](../lf-toggle)
- [lf-typewriter](../lf-typewriter)
- [lf-upload](../lf-upload)

### Graph
```mermaid
graph TD;
  lf-carousel --> lf-badge
  lf-carousel --> lf-button
  lf-carousel --> lf-canvas
  lf-carousel --> lf-card
  lf-carousel --> lf-chart
  lf-carousel --> lf-chat
  lf-carousel --> lf-chip
  lf-carousel --> lf-code
  lf-carousel --> lf-image
  lf-carousel --> lf-photoframe
  lf-carousel --> lf-progressbar
  lf-carousel --> lf-textfield
  lf-carousel --> lf-toggle
  lf-carousel --> lf-typewriter
  lf-carousel --> lf-upload
  lf-badge --> lf-image
  lf-button --> lf-list
  lf-button --> lf-spinner
  lf-canvas --> lf-image
  lf-card --> lf-badge
  lf-card --> lf-button
  lf-card --> lf-canvas
  lf-card --> lf-card
  lf-card --> lf-chart
  lf-card --> lf-chat
  lf-card --> lf-chip
  lf-card --> lf-code
  lf-card --> lf-image
  lf-card --> lf-photoframe
  lf-card --> lf-progressbar
  lf-card --> lf-textfield
  lf-card --> lf-toggle
  lf-card --> lf-typewriter
  lf-card --> lf-upload
  lf-chat --> lf-spinner
  lf-chat --> lf-button
  lf-chat --> lf-typewriter
  lf-chat --> lf-progressbar
  lf-chat --> lf-textfield
  lf-chat --> lf-code
  lf-code --> lf-button
  lf-photoframe --> lf-image
  style lf-carousel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
