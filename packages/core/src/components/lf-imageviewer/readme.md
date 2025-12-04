# lf-imageviewer



<!-- Auto Generated Below -->


## Overview

Represents an image viewer component that displays a collection of images in a masonry layout.
The image viewer allows users to navigate through images, view details, and interact with the images.
The component supports various customization options, including image loading, navigation, and styling.

## Properties

| Property         | Attribute  | Description                                                                                                                            | Type                                                                  | Default     |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| `lfDataset`      | --         | The data set for the LF Imageviewer component. This property is mutable, meaning it can be changed after the component is initialized. | `LfDataDataset`                                                       | `{}`        |
| `lfLoadCallback` | --         | Callback invoked when the load button is clicked.                                                                                      | `(imageviewer: LfImageviewerInterface, dir: string) => Promise<void>` | `null`      |
| `lfNavigation`   | --         | Configuration options for the navigation panel.                                                                                        | `LfImageviewerNavigation`                                             | `undefined` |
| `lfStyle`        | `lf-style` | Custom styling for the component.                                                                                                      | `string`                                                              | `""`        |
| `lfValue`        | --         | Configuration parameters of the detail view.                                                                                           | `LfDataDataset`                                                       | `{}`        |


## Events

| Event                  | Description                                                                                                                                                                                    | Type                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `lf-imageviewer-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfImageviewerEventPayload>` |


## Methods

### `addSnapshot(value: string) => Promise<void>`

Appends a new snapshot to the current shape's history by duplicating it with an updated value.
It has no effect when the current shape is not set.

#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `value` | `string` |             |

#### Returns

Type: `Promise<void>`



### `clearHistory(index?: number) => Promise<void>`

Clears the history related to the shape identified by the index.
When index is not provided, it clear the full history.

#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `index` | `number` |             |

#### Returns

Type: `Promise<void>`



### `clearSelection() => Promise<void>`

Clears the currently selected shape.

#### Returns

Type: `Promise<void>`



### `getComponents() => Promise<LfImageviewerAdapterRefs>`

This method is used to retrieve the references to the subcomponents.

#### Returns

Type: `Promise<LfImageviewerAdapterRefs>`



### `getCurrentSnapshot() => Promise<{ shape: LfMasonrySelectedShape; value: string; }>`

Fetches the current snapshot.

#### Returns

Type: `Promise<{ shape: LfMasonrySelectedShape; value: string; }>`

A promise that resolves with the current snapshot's object.

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Fetches debug information of the component's current state.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves with the debug information object.

### `getProps() => Promise<LfImageviewerPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfImageviewerPropsInterface>`

Promise resolved with an object containing the component's properties.

### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `reset() => Promise<void>`

Clears the full history and clears the current selection.

#### Returns

Type: `Promise<void>`



### `setSpinnerStatus(status: boolean) => Promise<void>`

Displays/hides the spinner over the preview.

#### Parameters

| Name     | Type      | Description |
| -------- | --------- | ----------- |
| `status` | `boolean` |             |

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

| Name                             | Description                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--lf-imageviewer-border-color`  | Sets the border color for the imageviewer component. Defaults to => var(--lf-color-border)               |
| `--lf-imageviewer-border-radius` | Sets the border radius for the imageviewer component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-imageviewer-color-bg`      | Sets the color-bg color for the imageviewer component. Defaults to => var(--lf-color-bg)                 |
| `--lf-imageviewer-color-on-bg`   | Sets the color-on-bg color for the imageviewer component. Defaults to => var(--lf-color-on-bg)           |
| `--lf-imageviewer-font-family`   | Sets the primary font family for the imageviewer component. Defaults to => var(--lf-font-family-primary) |
| `--lf-imageviewer-font-size`     | Sets the font size for the imageviewer component. Defaults to => var(--lf-font-size)                     |
| `--lf-imageviewer-nav-width`     | Sets the width for the navigation panel. Defaults to => auto                                             |


## Dependencies

### Depends on

- [lf-canvas](../lf-canvas)
- [lf-button](../lf-button)
- [lf-spinner](../lf-spinner)
- [lf-tree](../lf-tree)
- [lf-masonry](../lf-masonry)
- [lf-textfield](../lf-textfield)

### Graph
```mermaid
graph TD;
  lf-imageviewer --> lf-canvas
  lf-imageviewer --> lf-button
  lf-imageviewer --> lf-spinner
  lf-imageviewer --> lf-tree
  lf-imageviewer --> lf-masonry
  lf-imageviewer --> lf-textfield
  lf-canvas --> lf-image
  lf-button --> lf-list
  lf-button --> lf-spinner
  lf-list --> lf-textfield
  lf-tree --> lf-textfield
  lf-tree --> lf-badge
  lf-tree --> lf-button
  lf-tree --> lf-canvas
  lf-tree --> lf-card
  lf-tree --> lf-chart
  lf-tree --> lf-chat
  lf-tree --> lf-chip
  lf-tree --> lf-code
  lf-tree --> lf-image
  lf-tree --> lf-photoframe
  lf-tree --> lf-progressbar
  lf-tree --> lf-toggle
  lf-tree --> lf-typewriter
  lf-tree --> lf-upload
  lf-badge --> lf-image
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
  lf-chat --> lf-article
  lf-chat --> lf-button
  lf-chat --> lf-chip
  lf-chat --> lf-textfield
  lf-chat --> lf-progressbar
  lf-chat --> lf-code
  lf-chat --> lf-checkbox
  lf-article --> lf-badge
  lf-article --> lf-button
  lf-article --> lf-canvas
  lf-article --> lf-card
  lf-article --> lf-chart
  lf-article --> lf-chat
  lf-article --> lf-chip
  lf-article --> lf-code
  lf-article --> lf-image
  lf-article --> lf-photoframe
  lf-article --> lf-progressbar
  lf-article --> lf-textfield
  lf-article --> lf-toggle
  lf-article --> lf-typewriter
  lf-article --> lf-upload
  lf-code --> lf-button
  lf-photoframe --> lf-image
  lf-masonry --> lf-badge
  lf-masonry --> lf-button
  lf-masonry --> lf-canvas
  lf-masonry --> lf-card
  lf-masonry --> lf-chart
  lf-masonry --> lf-chat
  lf-masonry --> lf-chip
  lf-masonry --> lf-code
  lf-masonry --> lf-image
  lf-masonry --> lf-photoframe
  lf-masonry --> lf-progressbar
  lf-masonry --> lf-textfield
  lf-masonry --> lf-toggle
  lf-masonry --> lf-typewriter
  lf-masonry --> lf-upload
  style lf-imageviewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
