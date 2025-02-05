# lf-slider



<!-- Auto Generated Below -->


## Overview

The slider component allows users to select a value within a defined range.
The slider may be horizontal or vertical, and may include a label or icon.

## Properties

| Property         | Attribute          | Description                                                                     | Type                                                                                     | Default     |
| ---------------- | ------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------- |
| `lfLabel`        | `lf-label`         | Defines text to display as a label for the slider.                              | `string`                                                                                 | `""`        |
| `lfLeadingLabel` | `lf-leading-label` | When true, displays the label before the slider component. Defaults to `false`. | `boolean`                                                                                | `false`     |
| `lfMax`          | `lf-max`           | The maximum value allowed by the slider.                                        | `number`                                                                                 | `100`       |
| `lfMin`          | `lf-min`           | The minimum value allowed by the slider.                                        | `number`                                                                                 | `0`         |
| `lfRipple`       | `lf-ripple`        | Adds a ripple effect when interacting with the slider.                          | `boolean`                                                                                | `true`      |
| `lfStep`         | `lf-step`          | Sets the increment or decrement steps when moving the slider.                   | `number`                                                                                 | `1`         |
| `lfStyle`        | `lf-style`         | Custom styling for the component.                                               | `string`                                                                                 | `""`        |
| `lfUiSize`       | `lf-ui-size`       | The size of the component.                                                      | `"large" \| "medium" \| "small" \| "xlarge" \| "xsmall" \| "xxlarge" \| "xxsmall"`       | `"medium"`  |
| `lfUiState`      | `lf-ui-state`      | Reflects the specified state color defined by the theme.                        | `"danger" \| "disabled" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"` | `"primary"` |
| `lfValue`        | `lf-value`         | The initial numeric value for the slider within the defined range.              | `number`                                                                                 | `50`        |


## Events

| Event             | Description                                                                                                                                                                                    | Type                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `lf-slider-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfSliderEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Fetches debug information of the component's current state.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves with the debug information object.

### `getProps() => Promise<LfSliderPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfSliderPropsInterface>`

Promise resolved with an object containing the component's properties.

### `getValue() => Promise<LfSliderValue>`

Used to retrieve the component's current state.

#### Returns

Type: `Promise<LfSliderValue>`

Promise resolved with the current state of the component.

### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `setValue(value: number) => Promise<void>`

Sets the component's state.

#### Parameters

| Name    | Type     | Description                                 |
| ------- | -------- | ------------------------------------------- |
| `value` | `number` | - The new state to be set on the component. |

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

| Name                                | Description                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--lf-slider-border-radius`         | Sets the border radius for the slider component. Defaults to => var(--lf-ui-border-radius)                                                       |
| `--lf-slider-box-shadow`            | Sets the box-shadow for the slider component's track. Defaults to => 0 0.25em 0.5em rgba(var(--lf-comp-color-on-bg, var(--lf-color-on-bg)), 0.2) |
| `--lf-slider-color-on-bg`           | Sets the color-on-bg color for the slider component. Defaults to => var(--lf-color-on-bg)                                                        |
| `--lf-slider-color-primary`         | Sets the color-primary color for the slider component. Defaults to => var(--lf-color-primary)                                                    |
| `--lf-slider-font-family`           | Sets the primary font family for the slider component. Defaults to => var(--lf-font-family-primary)                                              |
| `--lf-slider-font-size`             | Sets the font size for the slider component. Defaults to => var(--lf-font-size)                                                                  |
| `--lf-slider-input-height`          | Sets the height for the slider component's input. Defaults to => 3em                                                                             |
| `--lf-slider-label-min-width`       | Sets the min-width for the slider label. Defaults to => max-content                                                                              |
| `--lf-slider-label-padding-left`    | Sets the left padding for the slider label. Defaults to => 1.5em                                                                                 |
| `--lf-slider-label-padding-right`   | Sets the right padding for the slider label. Defaults to => 1.5em                                                                                |
| `--lf-slider-margin`                | Sets the margin for the slider component. Defaults to => 0 0.75em                                                                                |
| `--lf-slider-min-width`             | Sets the min-width for the slider component. Defaults to => 7em                                                                                  |
| `--lf-slider-padding`               | Sets the padding for the slider component. Defaults to => 2em                                                                                    |
| `--lf-slider-thumb-box-shadow`      | Sets the box-shadow for the slider component's thumb. Defaults to => 0 0.25em 0.5em rgba(var(--lf-comp-color-on-bg, var(--lf-color-on-bg)), 0.2) |
| `--lf-slider-thumb-height`          | Sets the height for the slider component's thumb. Defaults to => 1.25em                                                                          |
| `--lf-slider-thumb-hover-scale`     | Sets the scale for the slider component's thumb on hover. Defaults to => 1.1                                                                     |
| `--lf-slider-thumb-underlay-top`    | Sets the top position for the slider component's thumb underlay. Defaults to => -0.6em                                                           |
| `--lf-slider-thumb-width`           | Sets the width for the slider component's thumb. Defaults to => 1.25em                                                                           |
| `--lf-slider-track-height`          | Sets the height for the slider component's track. Defaults to => 0.5em                                                                           |
| `--lf-slider-value-bottom-position` | Sets the bottom position for the slider component's value. Defaults to => -3em                                                                   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
