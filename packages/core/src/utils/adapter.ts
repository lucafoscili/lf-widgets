import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LfComponent,
  LfComponentAdapterBaseGetters,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";

//#region Factory
/**
 * Factory to create base getters that all adapters share.
 * Reduces boilerplate and enforces consistent base getter implementation.
 *
 * @param config - Configuration object with component-specific values
 * @returns Base getters object conforming to LfComponentAdapterBaseGetters
 *
 * @example
 * ```ts
 * const baseGetters = createBaseGetters({
 *   blocks: () => LF_BUTTON_BLOCKS,
 *   compInstance: () => this,
 *   framework: () => this.#framework,
 *   ids: () => LF_BUTTON_IDS,
 *   parts: () => LF_BUTTON_PARTS,
 * });
 * ```
 *
 * @see Section 5.1.B of copilot.instructions.md
 */
export const createBaseGetters = <
  C extends LfComponent,
  Blocks extends Record<string, unknown>,
  Ids extends Record<string, unknown>,
  Parts extends Record<string, string>,
>(config: {
  blocks: () => Blocks;
  compInstance: () => C;
  framework: () => LfFrameworkInterface;
  ids: () => Ids;
  parts: () => Parts;
}): LfComponentAdapterBaseGetters<C, Blocks, Ids, Parts> => ({
  blocks: config.blocks,
  compInstance: config.compInstance,
  cyAttributes: () => CY_ATTRIBUTES,
  framework: config.framework,
  ids: config.ids,
  lfAttributes: () => LF_ATTRIBUTES,
  parts: config.parts,
});
//#endregion
