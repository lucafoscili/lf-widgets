# lf-header



<!-- Auto Generated Below -->


## Overview

Represents a header component that displays a title or logo at the top of the screen.
The header may contain a navigation menu, search bar, or other elements.
The content of the header is customizable through slots.

## Properties

| Property  | Attribute  | Description                       | Type     | Default |
| --------- | ---------- | --------------------------------- | -------- | ------- |
| `lfStyle` | `lf-style` | Custom styling for the component. | `string` | `""`    |


## Events

| Event             | Description | Type                                |
| ----------------- | ----------- | ----------------------------------- |
| `lf-header-event` |             | `CustomEvent<LfHeaderEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Fetches debug information of the component's current state.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves with the debug information object.

### `getProps() => Promise<LfHeaderPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfHeaderPropsInterface>`

Promise resolved with an object containing the component's properties.

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

| Name                          | Description                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `--lf-header-border-radius`   | Sets the border radius for the header component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-header-color-header`    | Sets the color-header color for the header component. Defaults to => var(--lf-color-header)         |
| `--lf-header-color-on-header` | Sets the color-on-header color for the header component. Defaults to => var(--lf-color-on-header)   |
| `--lf-header-font-family`     | Sets the primary font family for the header component. Defaults to => var(--lf-font-family-primary) |
| `--lf-header-font-size`       | Sets the font size for the header component. Defaults to => var(--lf-font-size)                     |
| `--lf-header-justify`         | Sets the justify for the header component. Defaults to => space-between                             |
| `--lf-header-padding`         | Sets the padding for the header component. Defaults to => 0.5em 0.75em                              |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
