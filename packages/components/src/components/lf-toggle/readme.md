# lf-toggle



<!-- Auto Generated Below -->


## Overview

The toggle component is a switch that can be toggled on or off.
The toggle may include a label to provide context for the user.
The toggle may also include a ripple effect when clicked.

## Properties

| Property         | Attribute          | Description                                                                            | Type                                                                                     | Default     |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------- |
| `lfLabel`        | `lf-label`         | Defines text to display along with the toggle.                                         | `string`                                                                                 | `""`        |
| `lfLeadingLabel` | `lf-leading-label` | Defaults at false. When set to true, the label will be displayed before the component. | `boolean`                                                                                | `false`     |
| `lfRipple`       | `lf-ripple`        | When set to true, the pointerdown event will trigger a ripple effect.                  | `boolean`                                                                                | `true`      |
| `lfStyle`        | `lf-style`         | Custom styling for the component.                                                      | `string`                                                                                 | `""`        |
| `lfUiSize`       | `lf-ui-size`       | The size of the component.                                                             | `"large" \| "medium" \| "small" \| "xlarge" \| "xsmall" \| "xxlarge" \| "xxsmall"`       | `"medium"`  |
| `lfUiState`      | `lf-ui-state`      | Reflects the specified state color defined by the theme.                               | `"danger" \| "disabled" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"` | `"primary"` |
| `lfValue`        | `lf-value`         | Sets the initial boolean state of the toggle.                                          | `boolean`                                                                                | `false`     |


## Events

| Event             | Description                                                                                                                                                                                    | Type                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `lf-toggle-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfToggleEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Fetches debug information of the component's current state.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves with the debug information object.

### `getProps() => Promise<LfTogglePropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfTogglePropsInterface>`

Promise resolved with an object containing the component's properties.

### `getValue() => Promise<LfToggleState>`

Used to retrieve the component's current state.

#### Returns

Type: `Promise<"on" | "off">`

Promise resolved with the current state of the component.

### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `setValue(value: LfToggleState | boolean) => Promise<void>`

Sets the component's state.

#### Parameters

| Name    | Type                       | Description                                 |
| ------- | -------------------------- | ------------------------------------------- |
| `value` | `boolean \| "on" \| "off"` | - The new state to be set on the component. |

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

| Name                              | Description                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| `--lf-toggle-border-radius`       | Sets the border radius for the toggle component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-toggle-color-on-bg`         | Sets the color-on-bg color for the toggle component. Defaults to => var(--lf-color-on-bg)           |
| `--lf-toggle-color-on-surface`    | Sets the color-on-surface color for the toggle component. Defaults to => var(--lf-color-on-surface) |
| `--lf-toggle-color-primary`       | Sets the color-primary color for the toggle component. Defaults to => var(--lf-color-primary)       |
| `--lf-toggle-color-surface`       | Sets the color-surface color for the toggle component. Defaults to => var(--lf-color-surface)       |
| `--lf-toggle-font-family`         | Sets the primary font family for the toggle component. Defaults to => var(--lf-font-family-primary) |
| `--lf-toggle-font-size`           | Sets the font size for the toggle component. Defaults to => var(--lf-font-size)                     |
| `--lf-toggle-form-padding`        | Sets the padding for the toggle form field. Defaults to => 0.5em                                    |
| `--lf-toggle-input-height`        | Sets the height for the toggle component's input. Defaults to => 3em                                |
| `--lf-toggle-label-min-width`     | Sets the min-width for the toggle label. Defaults to => max-content                                 |
| `--lf-toggle-label-padding-left`  | Sets the left padding for the toggle label. Defaults to => 1em                                      |
| `--lf-toggle-label-padding-right` | Sets the right padding for the toggle label. Defaults to => 1em                                     |
| `--lf-toggle-margin`              | Sets the margin for the toggle component. Defaults to => 1em 0.5em                                  |
| `--lf-toggle-min-width`           | Sets the min-width for the toggle component. Defaults to => 4em                                     |
| `--lf-toggle-thumb-size`          | Sets the size for the toggle component's thumb. Defaults to => 1.5em                                |
| `--lf-toggle-track-height`        | Sets the height for the toggle component's track. Defaults to => 0.5em                              |
| `--lf-toggle-track-width`         | Sets the width for the toggle component's track. Defaults to => 3em                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
