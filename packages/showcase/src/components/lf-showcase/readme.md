# lf-showcase



<!-- Auto Generated Below -->


## Overview

Represents a showcase component for displaying and navigating through multiple sections and items.

## Properties

| Property          | Attribute   | Description                                                          | Type                                         | Default     |
| ----------------- | ----------- | -------------------------------------------------------------------- | -------------------------------------------- | ----------- |
| `lfDrawer`        | `lf-drawer` | Enables the drawer.                                                  | `boolean`                                    | `false`     |
| `lfHeader`        | `lf-header` | Enables the header.                                                  | `boolean`                                    | `false`     |
| `lfScrollElement` | --          | The scroll container, functional to the ScrollToTop floating button. | `HTMLElement`                                | `undefined` |
| `lfStyle`         | `lf-style`  | Custom styling for the component.                                    | `string`                                     | `""`        |
| `lfValue`         | --          | Sets the initial value of the views.                                 | `{ Components: string; Framework: string; }` | `null`      |


## Shadow Parts

| Part              | Description |
| ----------------- | ----------- |
| `"back"`          |             |
| `"drawer"`        |             |
| `"drawer-button"` |             |
| `"github"`        |             |
| `"header"`        |             |
| `"intro"`         |             |
| `"npm"`           |             |
| `"scroll-to-top"` |             |
| `"showcase"`      |             |
| `"theme-button"`  |             |
| `"title"`         |             |
| `"typewriter"`    |             |


## CSS Custom Properties

| Name                          | Description                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--lf--border-color`          | Sets the border color for the component. Defaults to => var(--lf-color-border)                        |
| `--lf--border-radius`         | Sets the border radius for the component. Defaults to => var(--lf-ui-border-radius)                   |
| `--lf--color-border`          | Sets the color-border color for the component. Defaults to => var(--lf-color-border)                  |
| `--lf--color-on-border`       | Sets the color-on-border color for the component. Defaults to => var(--lf-color-on-border)            |
| `--lf--color-on-primary`      | Sets the color-on-primary color for the component. Defaults to => var(--lf-color-on-primary)          |
| `--lf--color-on-surface`      | Sets the color-on-surface color for the component. Defaults to => var(--lf-color-on-surface)          |
| `--lf--color-secondary`       | Sets the color-secondary color for the component. Defaults to => var(--lf-color-secondary)            |
| `--lf--color-surface`         | Sets the color-surface color for the component. Defaults to => var(--lf-color-surface)                |
| `--lf-showcase-border-color`  | Sets the border color for the showcase component. Defaults to => var(--lf-color-border)               |
| `--lf-showcase-border-radius` | Sets the border radius for the showcase component. Defaults to => var(--lf-ui-border-radius)          |
| `--lf-showcase-color-bg`      | Sets the color-bg color for the showcase component. Defaults to => var(--lf-color-bg)                 |
| `--lf-showcase-color-on-bg`   | Sets the color-on-bg color for the showcase component. Defaults to => var(--lf-color-on-bg)           |
| `--lf-showcase-font-family`   | Sets the primary font family for the showcase component. Defaults to => var(--lf-font-family-primary) |
| `--lf-showcase-font-size`     | Sets the font size for the showcase component. Defaults to => var(--lf-font-size)                     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
