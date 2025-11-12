# lf-radio



<!-- Auto Generated Below -->


## Overview

LfRadio is a Stencil component that renders a group of radio buttons based on a provided dataset.
It supports various configurations such as orientation, labeling position, ripple effects, and theming.
The component manages selection state and emits events for user interactions like pointerdown and change.
It implements the LfRadioInterface and integrates with the LfFramework for theming and effects.

## Properties

| Property         | Attribute          | Description                                                                                  | Type                                                                                     | Default      |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------ |
| `lfAriaLabel`    | `lf-aria-label`    | Aria label for accessibility.                                                                | `string`                                                                                 | `undefined`  |
| `lfDataset`      | --                 | Dataset containing the radio options.                                                        | `LfDataDataset`                                                                          | `{}`         |
| `lfLeadingLabel` | `lf-leading-label` | Whether labels should be positioned before (leading) or after (trailing) the radio controls. | `boolean`                                                                                | `false`      |
| `lfOrientation`  | `lf-orientation`   | The orientation of the radio group (vertical or horizontal).                                 | `"horizontal" \| "vertical"`                                                             | `"vertical"` |
| `lfRipple`       | `lf-ripple`        | When set to true, the pointerdown event will trigger a ripple effect.                        | `boolean`                                                                                | `true`       |
| `lfStyle`        | `lf-style`         | Custom styling for the component.                                                            | `string`                                                                                 | `undefined`  |
| `lfUiSize`       | `lf-ui-size`       | The size of the component.                                                                   | `"large" \| "medium" \| "small" \| "xlarge" \| "xsmall" \| "xxlarge" \| "xxsmall"`       | `"medium"`   |
| `lfUiState`      | `lf-ui-state`      | Reflects the specified state color defined by the theme.                                     | `"danger" \| "disabled" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"` | `"primary"`  |
| `lfValue`        | `lf-value`         | The ID of the currently selected radio item.                                                 | `string`                                                                                 | `undefined`  |


## Events

| Event            | Description                                                                                                                                                                                    | Type                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `lf-radio-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfRadioEventPayload>` |


## Methods

### `clearSelection() => Promise<void>`

Clear the current selection.

#### Returns

Type: `Promise<void>`



### `getAdapter() => Promise<LfRadioAdapter>`

Gets the current adapter instance.

#### Returns

Type: `Promise<LfRadioAdapter>`



### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Retrieves the debug information reflecting the current state of the component.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves to a LfDebugLifecycleInfo object containing debug information.

### `getProps() => Promise<LfRadioPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfRadioPropsInterface>`

Promise resolved with an object containing the component's properties.

### `getSelectedNode() => Promise<LfDataNode | undefined>`

Gets the currently selected node.

#### Returns

Type: `Promise<LfDataNode>`

A promise that resolves to the selected data node or undefined if no selection.

### `refresh() => Promise<void>`

Triggers a re-render of the component to reflect any state changes.

#### Returns

Type: `Promise<void>`



### `selectItem(nodeId: string) => Promise<void>`

Select an item by ID.

#### Parameters

| Name     | Type     | Description                     |
| -------- | -------- | ------------------------------- |
| `nodeId` | `string` | - The ID of the item to select. |

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

| Name                                      | Description                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--lf-radio-circle-border-color`          | Sets the border color of the radio circle. Defaults to => rgba(var(--lf-color-on-bg), 0.6)               |
| `--lf-radio-circle-border-width`          | Sets the border width of the radio circle. Defaults to => 2px                                            |
| `--lf-radio-circle-hover-border-color`    | Sets the border color of the radio circle on hover. Defaults to => rgba(var(--lf-color-primary), 0.875)  |
| `--lf-radio-circle-selected-border-color` | Sets the border color of the radio circle when selected. Defaults to => rgba(var(--lf-color-primary), 1) |
| `--lf-radio-control-size`                 | Sets the size of the radio control. Defaults to => 1.25em                                                |
| `--lf-radio-dot-background-color`         | Sets the background color of the selected radio dot. Defaults to => rgba(var(--lf-color-primary), 1)     |
| `--lf-radio-dot-border-width`             | Sets the border width of the selected radio dot. Defaults to => 10px (creates a filled circle)           |
| `--lf-radio-font-family`                  | Sets the primary font family for the radio component. Defaults to => var(--lf-font-family-primary)       |
| `--lf-radio-font-size`                    | Sets the font size for the radio component. Defaults to => var(--lf-font-size)                           |
| `--lf-radio-group-gap`                    | Sets the gap between radio items in the group. Defaults to => var(--lf-space-03)                         |
| `--lf-radio-group-horizontal-gap`         | Sets the gap between radio items in horizontal orientation. Defaults to => var(--lf-space-05)            |
| `--lf-radio-hover-border-color`           | Sets the border color on hover. Defaults to => rgba(var(--lf-color-primary), 0.5)                        |
| `--lf-radio-item-gap`                     | Sets the gap between the radio control and label. Defaults to => var(--lf-space-03)                      |
| `--lf-radio-item-selected-color`          | Sets the color for selected radio items. Defaults to => rgba(var(--lf-color-primary), 1)                 |
| `--lf-radio-label-color`                  | Sets the color of the radio label. Defaults to => rgba(var(--lf-color-on-bg), 0.87)                      |
| `--lf-radio-label-font-size`              | Sets the font size of the radio label. Defaults to => 1em                                                |
| `--lf-radio-label-font-weight`            | Sets the font weight of the label. Defaults to => 500                                                    |
| `--lf-radio-label-line-height`            | Sets the line height of the radio label. Defaults to => 1.5                                              |
| `--lf-radio-label-padding`                | Sets the padding for the label. Defaults to => 0.75em                                                    |
| `--lf-radio-label-padding-leading`        | Sets the padding for the label in leading position. Defaults to => 0.75em                                |
| `--lf-radio-label-selected-color`         | Sets the color of the label when selected. Defaults to => rgba(var(--lf-color-primary), 1)               |
| `--lf-radio-label-selected-font-weight`   | Sets the font weight of the label when selected. Defaults to => 500                                      |
| `--lf-radio-ripple-size`                  | Sets the size of the ripple effect. Defaults to => 2.5em                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
