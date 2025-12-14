/**
 * BLOCKS/DOM Alignment Test Utility
 *
 * Verifies that a component's LF_<COMP>_BLOCKS constant matches
 * the actual DOM structure rendered by the component.
 *
 * The BLOCKS constant defines BEM block structure:
 * - Each key is a block name
 * - `_` property is the base class name
 * - Other properties are element modifiers within that block
 *
 * This utility walks the BLOCKS constant and verifies:
 * 1. Each block's base class exists in DOM
 * 2. Each element within a block exists as a BEM element (block__element)
 * 3. Nested blocks have corresponding nested DOM structure
 */

type BlocksConstant = {
  [blockName: string]:
    | string
    | {
        _: string;
        [elementName: string]: string | Record<string, unknown>;
      };
};

interface AlignmentResult {
  pass: boolean;
  errors: string[];
  warnings: string[];
  found: string[];
}

/**
 * Recursively collects all BEM class names that should exist based on BLOCKS constant.
 *
 * @param blocks - The BLOCKS constant to analyze
 * @returns Array of expected BEM class names
 */
export function collectExpectedClasses(blocks: BlocksConstant): string[] {
  const classes: string[] = [];

  for (const [, blockDef] of Object.entries(blocks)) {
    if (typeof blockDef === "string") {
      // Simple string value - this is an element, not a block
      continue;
    }

    // Block definition object
    const baseClass = blockDef._;
    if (baseClass) {
      classes.push(baseClass);

      // Collect elements within this block
      for (const [elementName, elementValue] of Object.entries(blockDef)) {
        if (elementName === "_") continue;

        if (typeof elementValue === "string") {
          // BEM element: block__element
          classes.push(`${baseClass}__${elementValue}`);
        } else if (typeof elementValue === "object" && elementValue !== null) {
          // Nested block - recurse
          const nestedClasses = collectExpectedClasses({
            [elementName]: elementValue,
          } as BlocksConstant);
          classes.push(...nestedClasses);
        }
      }
    }
  }

  return classes;
}

/**
 * Collects all class names present in the DOM tree.
 *
 * @param root - Root element to scan
 * @returns Set of all class names found
 */
export function collectDOMClasses(root: Element): Set<string> {
  const classes = new Set<string>();

  function walk(el: Element) {
    if (el.classList) {
      el.classList.forEach((cls) => classes.add(cls));
    }
    for (const child of Array.from(el.children)) {
      walk(child);
    }
  }

  walk(root);
  return classes;
}

/**
 * Verifies BLOCKS constant alignment with rendered DOM.
 *
 * @param blocks - The component's BLOCKS constant
 * @param shadowRoot - The component's shadow root
 * @param options - Verification options
 * @returns Alignment verification result
 */
export function verifyBlocksAlignment(
  blocks: BlocksConstant,
  shadowRoot: ShadowRoot | null,
  options: {
    /** Classes to ignore (e.g., utility classes not in BLOCKS) */
    ignoreClasses?: string[];
    /** Whether to check for extra DOM classes not in BLOCKS */
    strictMode?: boolean;
  } = {},
): AlignmentResult {
  const result: AlignmentResult = {
    pass: true,
    errors: [],
    warnings: [],
    found: [],
  };

  if (!shadowRoot) {
    result.pass = false;
    result.errors.push("No shadow root found");
    return result;
  }

  const expectedClasses = collectExpectedClasses(blocks);
  const domClasses = collectDOMClasses(shadowRoot as unknown as Element);
  const ignoreSet = new Set(options.ignoreClasses ?? []);

  // Check each expected class exists in DOM
  for (const expectedClass of expectedClasses) {
    if (ignoreSet.has(expectedClass)) continue;

    if (domClasses.has(expectedClass)) {
      result.found.push(expectedClass);
    } else {
      result.pass = false;
      result.errors.push(
        `Missing DOM class: "${expectedClass}" (defined in BLOCKS but not found in DOM)`,
      );
    }
  }

  // In strict mode, check for extra classes not defined in BLOCKS
  if (options.strictMode) {
    const expectedSet = new Set(expectedClasses);
    for (const domClass of domClasses) {
      if (ignoreSet.has(domClass)) continue;

      // Skip BEM modifiers (block--modifier or block__element--modifier)
      if (domClass.includes("--")) continue;

      if (!expectedSet.has(domClass)) {
        result.warnings.push(
          `Extra DOM class: "${domClass}" (found in DOM but not defined in BLOCKS)`,
        );
      }
    }
  }

  return result;
}

/**
 * Helper to verify nested block structure.
 * Checks that parent-child relationships in BLOCKS are reflected in DOM nesting.
 *
 * @param blocks - The component's BLOCKS constant
 * @param shadowRoot - The component's shadow root
 * @returns Nesting verification result
 */
export function verifyBlocksNesting(
  blocks: BlocksConstant,
  shadowRoot: ShadowRoot | null,
): AlignmentResult {
  const result: AlignmentResult = {
    pass: true,
    errors: [],
    warnings: [],
    found: [],
  };

  if (!shadowRoot) {
    result.pass = false;
    result.errors.push("No shadow root found");
    return result;
  }

  // For each block with nested blocks, verify DOM containment
  function checkNesting(
    parentBlockDef: { _: string; [key: string]: unknown },
    parentSelector: string,
  ) {
    const parentEl = shadowRoot!.querySelector(`.${parentSelector}`);
    if (!parentEl) {
      result.errors.push(`Parent block "${parentSelector}" not found in DOM`);
      result.pass = false;
      return;
    }

    for (const [elementName, elementValue] of Object.entries(parentBlockDef)) {
      if (elementName === "_") continue;

      if (typeof elementValue === "object" && elementValue !== null) {
        const nestedBlockDef = elementValue as {
          _: string;
          [key: string]: unknown;
        };
        if (nestedBlockDef._) {
          // This is a nested block - verify it's a descendant
          const nestedEl = parentEl.querySelector(`.${nestedBlockDef._}`);
          if (nestedEl) {
            result.found.push(`${parentSelector} > ${nestedBlockDef._}`);
            // Recurse for deeper nesting
            checkNesting(nestedBlockDef, nestedBlockDef._);
          } else {
            result.warnings.push(
              `Nested block "${nestedBlockDef._}" not found as descendant of "${parentSelector}"`,
            );
          }
        }
      }
    }
  }

  // Start from top-level blocks
  for (const [, blockDef] of Object.entries(blocks)) {
    if (typeof blockDef === "object" && blockDef !== null && "_" in blockDef) {
      const typedBlockDef = blockDef as { _: string; [key: string]: unknown };
      checkNesting(typedBlockDef, typedBlockDef._);
    }
  }

  return result;
}

/**
 * Combined verification of BLOCKS alignment and nesting.
 * Use this in component tests.
 *
 * @example
 * ```ts
 * it("should have BLOCKS aligned with DOM", async () => {
 *   const page = await newSpecPage({ ... });
 *   const result = verifyComponentBlocks(
 *     LF_BUTTON_BLOCKS,
 *     page.root?.shadowRoot
 *   );
 *   expect(result.errors).toEqual([]);
 *   expect(result.pass).toBe(true);
 * });
 * ```
 */
export function verifyComponentBlocks(
  blocks: BlocksConstant,
  shadowRoot: ShadowRoot | null,
  options?: {
    ignoreClasses?: string[];
    strictMode?: boolean;
  },
): AlignmentResult {
  const alignmentResult = verifyBlocksAlignment(blocks, shadowRoot, options);
  const nestingResult = verifyBlocksNesting(blocks, shadowRoot);

  return {
    pass: alignmentResult.pass && nestingResult.pass,
    errors: [...alignmentResult.errors, ...nestingResult.errors],
    warnings: [...alignmentResult.warnings, ...nestingResult.warnings],
    found: [...new Set([...alignmentResult.found, ...nestingResult.found])],
  };
}
