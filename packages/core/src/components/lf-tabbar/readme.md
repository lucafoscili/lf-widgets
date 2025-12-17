# lf-tabbar



<!-- Auto Generated Below -->


## Overview

Represents the tab bar component, which displays a set of tabs for navigation.
The tab bar may include navigation arrows for overflow tabs and a ripple effect on user interaction.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                             | Type                                                                                     | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------- |
| `lfAriaLabel`  | `lf-aria-label` | Explicit accessible label prefix for tabs. Final per-tab aria-label resolves as: lfAriaLabel + ' ' + node.value (if both present) else node.value -> lfAriaLabel -> node.icon -> component id -> 'tab'. | `string`                                                                                 | `""`        |
| `lfDataset`    | --              | The data set for the LF Tabbar component. This property is mutable, meaning it can be changed after the component is initialized.                                                                       | `LfDataDataset`                                                                          | `null`      |
| `lfNavigation` | `lf-navigation` | When set to true, the tabbar will display navigation arrows for overflow tabs.                                                                                                                          | `boolean`                                                                                | `false`     |
| `lfRipple`     | `lf-ripple`     | When set to true, the pointerdown event will trigger a ripple effect.                                                                                                                                   | `boolean`                                                                                | `true`      |
| `lfStyle`      | `lf-style`      | Custom styling for the component.                                                                                                                                                                       | `string`                                                                                 | `""`        |
| `lfUiSize`     | `lf-ui-size`    | The size of the component.                                                                                                                                                                              | `"large" \| "medium" \| "small" \| "xlarge" \| "xsmall" \| "xxlarge" \| "xxsmall"`       | `"medium"`  |
| `lfUiState`    | `lf-ui-state`   | Reflects the specified state color defined by the theme.                                                                                                                                                | `"danger" \| "disabled" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"` | `"primary"` |
| `lfValue`      | `lf-value`      | Sets the initial selected node's index.                                                                                                                                                                 | `number \| string`                                                                       | `null`      |


## Events

| Event             | Description                                                                                                                                                                                    | Type                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `lf-tabbar-event` | Fires when the component triggers an internal action or user interaction. The event contains an `eventType` string, which identifies the action, and optionally `data` for additional details. | `CustomEvent<LfTabbarEventPayload>` |


## Methods

### `getDebugInfo() => Promise<LfDebugLifecycleInfo>`

Retrieves the debug information reflecting the current state of the component.

#### Returns

Type: `Promise<LfDebugLifecycleInfo>`

A promise that resolves to a LfDebugLifecycleInfo object containing debug information.

### `getProps() => Promise<LfTabbarPropsInterface>`

Used to retrieve component's properties and descriptions.

#### Returns

Type: `Promise<LfTabbarPropsInterface>`

Promise resolved with an object containing the component's properties.

### `getValue() => Promise<LfTabbarState>`

Returns the selected node and its index.

#### Returns

Type: `Promise<LfTabbarState>`

Selected node and its index.

### `refresh() => Promise<void>`

Triggers a re-render of the component to reflect any state changes.

#### Returns

Type: `Promise<void>`



### `setValue(value: number | string) => Promise<LfTabbarState>`

Sets the value of the component based on the provided argument.

#### Parameters

| Name    | Type               | Description                                    |
| ------- | ------------------ | ---------------------------------------------- |
| `value` | `string \| number` | - The index of the node or the id of the node. |

#### Returns

Type: `Promise<LfTabbarState>`

The newly set value.

### `unmount(ms?: number) => Promise<void>`

Initiates the unmount sequence, which removes the component from the DOM after a delay.

#### Parameters

| Name | Type     | Description              |
| ---- | -------- | ------------------------ |
| `ms` | `number` | - Number of milliseconds |

#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name                           | Description                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `--lf-tabbar-border-radius`    | Border radius for tabs. Defaults to => var(--lf-ui-border-radius, 0.25em)                               |
| `--lf-tabbar-color-bg`         | Background color for the tabbar. Defaults to => var(--lf-state-bg, var(--lf-color-bg))                  |
| `--lf-tabbar-color-indicator`  | Color for the active tab indicator. Defaults to => var(--lf-tabbar-color-primary)                       |
| `--lf-tabbar-color-on-bg`      | Text color on background. Defaults to => var(--lf-state-on-bg, var(--lf-color-on-bg))                   |
| `--lf-tabbar-color-on-primary` | Text color on primary surface. Defaults to => var(--lf-state-on-primary, var(--lf-color-on-primary))    |
| `--lf-tabbar-color-primary`    | Primary/accent color for active states. Defaults to => var(--lf-state-primary, var(--lf-color-primary)) |
| `--lf-tabbar-font-family`      | Sets the primary font family for the tabbar component. Defaults to => var(--lf-font-family-primary)     |
| `--lf-tabbar-font-size`        | Sets the font size for the tabbar component. Defaults to => var(--lf-font-size)                         |
| `--lf-tabbar-font-weight`      | Font weight for tab labels. Defaults to => var(--lf-font-weight-button)                                 |
| `--lf-tabbar-height`           | Height for the tabbar. Defaults to => 2.25em                                                            |
| `--lf-tabbar-min-width`        | Minimum width for each tab. Defaults to => 5em                                                          |
| `--lf-tabbar-tab-padding`      | Padding for each tab. Defaults to => 0 1.25em                                                           |


## Dependencies

### Used by

 - [lf-messenger](../lf-messenger)

### Depends on

- [lf-button](../lf-button)

### Graph
```mermaid
graph TD;
  lf-tabbar --> lf-button
  lf-button --> lf-list
  lf-messenger --> lf-tabbar
  style lf-tabbar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
