# lf-snackbar



<!-- Auto Generated Below -->


## Overview

The snackbar component displays a brief notification message at screen edges.
The snackbar may include an icon, message, optional action button, and close button.
The snackbar may close automatically after a specified amount of time or persist until user action.

## Properties

| Property           | Attribute       | Description                                                                                       | Type                                                                                              | Default                                                                               |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `lfAction`         | `lf-action`     | Text label for action button. If omitted, no action button appears.                               | `string`                                                                                          | `undefined`                                                                           |
| `lfActionCallback` | --              | Callback invoked when the action button is clicked. Receives snackbar instance and pointer event. | `(snackbar: LfSnackbarInterface, e: PointerEvent, ...args: unknown[]) => unknown`                 | `(     _snackbar: LfSnackbar,     _e: PointerEvent,   ) => {     this.unmount();   }` |
| `lfCloseIcon`      | `lf-close-icon` | Icon shown in the close button.                                                                   | `string`                                                                                          | `""`                                                                                  |
| `lfDuration`       | `lf-duration`   | Auto-dismiss duration in milliseconds. Set to 0 to disable auto-dismiss.                          | `number`                                                                                          | `4000`                                                                                |
| `lfIcon`           | `lf-icon`       | Optional icon shown at the start of the snackbar.                                                 | `string`                                                                                          | `undefined`                                                                           |
| `lfMessage`        | `lf-message`    | Message text displayed in the snackbar.                                                           | `string`                                                                                          | `""`                                                                                  |
| `lfPosition`       | `lf-position`   | Positioning of the snackbar on screen.                                                            | `"bottom-center" \| "bottom-left" \| "bottom-right" \| "top-center" \| "top-left" \| "top-right"` | `"bottom-center"`                                                                     |
| `lfStyle`          | `lf-style`      | Custom styling for the component.                                                                 | `string`                                                                                          | `""`                                                                                  |
| `lfUiSize`         | `lf-ui-size`    | The size of the component.                                                                        | `"large" \| "medium" \| "small" \| "xlarge" \| "xsmall" \| "xxlarge" \| "xxsmall"`                | `"medium"`                                                                            |
| `lfUiState`        | `lf-ui-state`   | Reflects the specified state color defined by the theme.                                          | `"danger" \| "disabled" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"`          | `"primary"`                                                                           |


## Events

| Event               | Description                                                                                                                                                                                    | Type                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `lf-snackbar-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfSnackbarEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Retrieves the debug information reflecting the current state of the component.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves to a LfDebugLifecycleInfo object containing debug information.

### `getProps() => Promise<LfSnackbarPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfSnackbarPropsInterface>`

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

| Name                              | Description                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--lf-snackbar-action-font-size`  | Font size for action button. Defaults to => 0.875em                                                   |
| `--lf-snackbar-border-radius`     | Sets the border radius for the snackbar component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-snackbar-color-on-primary`  | Sets the color-on-primary color for the snackbar component. Defaults to => var(--lf-color-on-primary) |
| `--lf-snackbar-color-on-surface`  | Sets the color-on-surface color for the snackbar component. Defaults to => var(--lf-color-on-surface) |
| `--lf-snackbar-color-primary`     | Sets the color-primary color for the snackbar component. Defaults to => var(--lf-color-primary)       |
| `--lf-snackbar-color-surface`     | Sets the color-surface color for the snackbar component. Defaults to => var(--lf-color-surface)       |
| `--lf-snackbar-font-family`       | Sets the primary font family for the snackbar component. Defaults to => var(--lf-font-family-primary) |
| `--lf-snackbar-font-size`         | Sets the font size for the snackbar component. Defaults to => var(--lf-font-size)                     |
| `--lf-snackbar-message-font-size` | Font size for the message. Defaults to => 0.875em                                                     |
| `--lf-snackbar-padding`           | Sets the padding for the snackbar. Defaults to => 0.875em 1em                                         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
