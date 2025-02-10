# lf-splash



<!-- Auto Generated Below -->


## Overview

The splash component is designed to be displayed during the initial loading of a page or application.
The splash screen may include a logo, text, or other elements to provide a branded loading experience.

## Properties

| Property  | Attribute  | Description                                                                  | Type     | Default        |
| --------- | ---------- | ---------------------------------------------------------------------------- | -------- | -------------- |
| `lfLabel` | `lf-label` | Initial text displayed within the component, typically shown during loading. | `string` | `"Loading..."` |
| `lfStyle` | `lf-style` | Custom styling for the component.                                            | `string` | `""`           |


## Events

| Event             | Description                                                                                                                                                                                    | Type                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `lf-splash-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfSplashEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Retrieves the debug information reflecting the current state of the component.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves to a LfDebugLifecycleInfo object containing debug information.

### `getProps() => Promise<LfSplashPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfSplashPropsInterface>`

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

| Name                        | Description                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| `--lf-splash-color-bg`      | Sets the color-bg color for the splash component. Defaults to => var(--lf-color-bg)                 |
| `--lf-splash-color-on-bg`   | Sets the color-on-bg color for the splash component. Defaults to => var(--lf-color-on-bg)           |
| `--lf-splash-font-family`   | Sets the primary font family for the splash component. Defaults to => var(--lf-font-family-primary) |
| `--lf-splash-font-size`     | Sets the font size for the splash component. Defaults to => var(--lf-font-size)                     |
| `--lf-splash-height`        | Sets the height for the splash component. Defaults to => 100dvh                                     |
| `--lf-splash-left`          | Sets the left for the splash component. Defaults to => 0                                            |
| `--lf-splash-position`      | Sets the position for the splash component. Defaults to => fixed                                    |
| `--lf-splash-top`           | Sets the top for the splash component. Defaults to => 0                                             |
| `--lf-splash-widget-height` | Sets the height for the splash widget. Defaults to => 10em                                          |
| `--lf-splash-widget-margin` | Sets the margin for the splash widget. Defaults to => auto                                          |
| `--lf-splash-widget-width`  | Sets the width for the splash widget. Defaults to => 10em                                           |
| `--lf-splash-width`         | Sets the width for the splash component. Defaults to => 100dvw                                      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
