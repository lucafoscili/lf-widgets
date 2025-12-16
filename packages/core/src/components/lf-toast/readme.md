# lf-toast



<!-- Auto Generated Below -->


## Overview

The toast component displays a temporary message to the user.
The toast may include an icon, message, and close button.
The toast may also close automatically after a specified amount of time.

## Properties

| Property          | Attribute       | Description                                                                                                | Type                                                                                     | Default                                                                         |
| ----------------- | --------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `lfCloseCallback` | --              | Callback invoked when the toast is closed.                                                                 | `(toast: LfToastInterface, e: PointerEvent, ...args: any[]) => any`                      | `(     _toast: LfToast,     _e: PointerEvent,   ) => {     this.unmount();   }` |
| `lfCloseIcon`     | `lf-close-icon` | Sets the close icon of the toast.                                                                          | `string`                                                                                 | `""`                                                                            |
| `lfIcon`          | `lf-icon`       | Sets the icon of the toast.                                                                                | `string`                                                                                 | `undefined`                                                                     |
| `lfMessage`       | `lf-message`    | Sets the message of the toast.                                                                             | `string`                                                                                 | `""`                                                                            |
| `lfStyle`         | `lf-style`      | Custom styling for the component.                                                                          | `string`                                                                                 | `""`                                                                            |
| `lfTimer`         | `lf-timer`      | When lfTimer is set with a number, the toast will close itself after the specified amount of time (in ms). | `number`                                                                                 | `null`                                                                          |
| `lfUiSize`        | `lf-ui-size`    | The size of the component.                                                                                 | `"large" \| "medium" \| "small" \| "xlarge" \| "xsmall" \| "xxlarge" \| "xxsmall"`       | `"medium"`                                                                      |
| `lfUiState`       | `lf-ui-state`   | Reflects the specified state color defined by the theme.                                                   | `"danger" \| "disabled" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"` | `"primary"`                                                                     |


## Events

| Event            | Description                                                                                                                                                                                    | Type                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `lf-toast-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfToastEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Retrieves the debug information reflecting the current state of the component.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves to a LfDebugLifecycleInfo object containing debug information.

### `getProps() => Promise<LfToastPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfToastPropsInterface>`

Promise resolved with an object containing the component's properties.

### `refresh() => Promise<void>`

Triggers a re-render of the component to reflect any state changes.

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

| Name                               | Description                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `--lf-toast-accent-height`         | Height for accent bar. Defaults to => 0.25em                                                       |
| `--lf-toast-border-radius`         | Sets the border radius for the toast component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-toast-color-bg`              | Message text color. Defaults to => var(--lf-state-bg, var(--lf-color-bg))                          |
| `--lf-toast-color-primary`         | Primary color for accent bar. Defaults to => var(--lf-state-primary, var(--lf-color-primary))      |
| `--lf-toast-color-surface`         | Background color for toast. Defaults to => var(--lf-state-surface, var(--lf-color-surface))        |
| `--lf-toast-font-family`           | Sets the primary font family for the toast component. Defaults to => var(--lf-font-family-primary) |
| `--lf-toast-font-size`             | Sets the font size for the toast component. Defaults to => var(--lf-font-size)                     |
| `--lf-toast-icon-color`            | Color for leading icon. Defaults to => rgba($primaryC, 1)                                          |
| `--lf-toast-icon-height`           | Height for icon. Defaults to => 1.5em                                                              |
| `--lf-toast-icon-margin`           | Margin for icon. Defaults to => auto 0.5em                                                         |
| `--lf-toast-icon-opacity`          | Opacity for icon. Defaults to => 1                                                                 |
| `--lf-toast-icon-width`            | Width for icon. Defaults to => 1.5em                                                               |
| `--lf-toast-message-align-content` | Alignment for message content. Defaults to => center                                               |
| `--lf-toast-message-padding`       | Padding for message. Defaults to => 0.75em 0.75em 0.75em 0                                         |
| `--lf-toast-padding`               | Padding for toast wrapper. Defaults to => 0.75em                                                   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
