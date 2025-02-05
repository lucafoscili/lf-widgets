# lf-drawer



<!-- Auto Generated Below -->


## Overview

Represents a drawer-style component that displays content on the screen,
allowing users to open or close the drawer. Implements various methods for
managing state, retrieving component properties, handling user interactions,
and unmounting the component. Responsive behavior may be enabled via a property.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                | Type                | Default   |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------- |
| `lfDisplay`    | `lf-display`    | The display mode of the drawer.                                                                                                                                                                                                                                            | `"dock" \| "slide"` | `"slide"` |
| `lfPosition`   | `lf-position`   | The position of the drawer on the screen.                                                                                                                                                                                                                                  | `"left" \| "right"` | `"left"`  |
| `lfResponsive` | `lf-responsive` | A number representing a screen-width breakpoint for responsiveness. If set to 0 (or negative), no responsiveness is applied, and `lfDisplay` remains what you set. If > 0, the drawer will switch to `"dock"` if `window.innerWidth >= lfResponsive`, otherwise `"slide"`. | `number`            | `0`       |
| `lfStyle`      | `lf-style`      | Custom styling for the component.                                                                                                                                                                                                                                          | `string`            | `""`      |
| `lfValue`      | `lf-value`      | Indicates if the drawer is open.                                                                                                                                                                                                                                           | `boolean`           | `false`   |


## Events

| Event             | Description                                                                                                                                                                                    | Type                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `lf-drawer-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfDrawerEventPayload>` |


## Methods

### `close() => Promise<void>`

Closes the drawer component.
Uses requestAnimationFrame to ensure smooth animation and state update.
Dispatches a 'close' custom event when the drawer is closed.

#### Returns

Type: `Promise<void>`

Promise that resolves when the drawer closing animation is scheduled

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Fetches debug information of the component's current state.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves with the debug information object.

### `getProps() => Promise<LfDrawerPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfDrawerPropsInterface>`

Promise resolved with an object containing the component's properties.

### `isOpened() => Promise<boolean>`

Returns the current open state of the drawer.

#### Returns

Type: `Promise<boolean>`

A promise that resolves to a boolean indicating if the drawer is open (true) or closed (false)

### `open() => Promise<void>`

Opens the drawer.

#### Returns

Type: `Promise<void>`



### `refresh() => Promise<void>`

This method is used to trigger a new render of the component.

#### Returns

Type: `Promise<void>`



### `toggle() => Promise<void>`

Toggles the drawer state between opened and closed.
If the drawer is currently opened, it will be closed.
If the drawer is currently closed, it will be opened.

#### Returns

Type: `Promise<void>`

A promise that resolves when the toggle operation is complete

### `unmount(ms?: number) => Promise<void>`

Initiates the unmount sequence, which removes the component from the DOM after a delay.

#### Parameters

| Name | Type     | Description              |
| ---- | -------- | ------------------------ |
| `ms` | `number` | - Number of milliseconds |

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                           | Description                                                                                                                                                                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--lf-drawer-border`           | Sets the border for the drawer component. Defaults to => 1px solid 1px solid rgba(var(--lf-color-border), 0.75)                                                                                                                                    |
| `--lf-drawer-border-radius`    | Sets the border radius for the drawer component. Defaults to => var(--lf-ui-border-radius)                                                                                                                                                         |
| `--lf-drawer-color-drawer`     | Sets the color-drawer color for the drawer component. Defaults to => var(--lf-color-drawer)                                                                                                                                                        |
| `--lf-drawer-color-on-drawer`  | Sets the color-on-drawer color for the drawer component. Defaults to => var(--lf-color-on-drawer)                                                                                                                                                  |
| `--lf-drawer-font-family`      | Sets the primary font family for the drawer component. Defaults to => var(--lf-font-family-primary)                                                                                                                                                |
| `--lf-drawer-font-size`        | Sets the font size for the drawer component. Defaults to => var(--lf-font-size)                                                                                                                                                                    |
| `--lf-drawer-left-box-shadow`  | Sets the box-shadow for the left side of the drawer component. Defaults to => 4px 0 10px -2px rgba(var(--lf-color-on-drawer), 0.2), 8px 0 16px 2px rgba(var(--lf-color-on-drawer), 0.14), 2px 0 20px 5px rgba(var(--lf-color-on-drawer), 0.14)     |
| `--lf-drawer-right-box-shadow` | Sets the box-shadow for the right side of the drawer component. Defaults to => -4px 0 10px -2px rgba(var(--lf-color-on-drawer), 0.2), -8px 0 16px 2px rgba(var(--lf-color-on-drawer), 0.14), -2px 0 20px 5px rgba(var(--lf-color-on-drawer), 0.14) |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
