var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m")
        throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LfPortal_RAF, _LfPortal_MANAGER, _LfPortal_PORTAL, _LfPortal_STATE, _LfPortal_appendToWrapper, _LfPortal_clean, _LfPortal_schedulePositionUpdate, _LfPortal_executeRun, _LfPortal_isAnchorHTMLElement, _LfPortal_resetStyle;
import { CY_ATTRIBUTES, } from "@lf-widgets/foundations";
/**
 * Manages elements within a portal to control their position and click-away behavior.
 *
 * @remarks
 * This class provides functionality to:
 * - Append an element to a dedicated portal container.
 * - Track positions using requestAnimationFrame, allowing for continuous repositioning.
 * - Handle click-away actions.
 *
 * @example
 * ```typescript
 * const portal = new LfPortal(lfFramework);
 * const element = document.createElement('div');
 * portal.open(element, document.body);
 * ```
 *
 * @public
 */
export class LfPortal {
    constructor(lfFramework) {
        _LfPortal_RAF.set(this, {
            frameId: 0,
            queue: new Set(),
        });
        _LfPortal_MANAGER.set(this, void 0);
        _LfPortal_PORTAL.set(this, void 0);
        _LfPortal_STATE.set(this, new WeakMap());
        _LfPortal_appendToWrapper.set(this, (element) => {
            if (typeof document === "undefined") {
                return;
            }
            if (!__classPrivateFieldGet(this, _LfPortal_PORTAL, "f")) {
                __classPrivateFieldSet(this, _LfPortal_PORTAL, document.createElement("div"), "f");
                __classPrivateFieldGet(this, _LfPortal_PORTAL, "f").classList.add("lf-portal");
                __classPrivateFieldGet(this, _LfPortal_PORTAL, "f").dataset.cy = CY_ATTRIBUTES.portal;
                document.body.appendChild(__classPrivateFieldGet(this, _LfPortal_PORTAL, "f"));
            }
            __classPrivateFieldGet(this, _LfPortal_PORTAL, "f").appendChild(element);
        });
        _LfPortal_clean.set(this, (element) => {
            if (!this.isInPortal(element)) {
                return;
            }
            const { dismissCb, parent } = __classPrivateFieldGet(this, _LfPortal_STATE, "f").get(element);
            __classPrivateFieldGet(this, _LfPortal_MANAGER, "f").removeClickCallback(dismissCb);
            if (parent) {
                parent.appendChild(element);
            }
            __classPrivateFieldGet(this, _LfPortal_STATE, "f").delete(element);
        });
        _LfPortal_schedulePositionUpdate.set(this, (element) => {
            __classPrivateFieldGet(this, _LfPortal_RAF, "f").queue.add(element);
            if (!__classPrivateFieldGet(this, _LfPortal_RAF, "f").frameId) {
                __classPrivateFieldGet(this, _LfPortal_RAF, "f").frameId = requestAnimationFrame(() => {
                    __classPrivateFieldGet(this, _LfPortal_RAF, "f").frameId = 0;
                    __classPrivateFieldGet(this, _LfPortal_RAF, "f").queue.forEach((el) => __classPrivateFieldGet(this, _LfPortal_executeRun, "f").call(this, el));
                    __classPrivateFieldGet(this, _LfPortal_RAF, "f").queue.clear();
                });
            }
        });
        _LfPortal_executeRun.set(this, (element) => {
            if (!this.isInPortal(element) || !element.isConnected) {
                __classPrivateFieldGet(this, _LfPortal_clean, "f").call(this, element);
                return;
            }
            __classPrivateFieldGet(this, _LfPortal_resetStyle, "f").call(this, element);
            const state = __classPrivateFieldGet(this, _LfPortal_STATE, "f").get(element);
            if (!state) {
                __classPrivateFieldGet(this, _LfPortal_MANAGER, "f").debug.logs.new(this, `State for element not found.`, "warning");
                return;
            }
            const { anchor, margin, placement } = state;
            const { offsetHeight, offsetWidth, style } = element;
            style.display = "block";
            if (!__classPrivateFieldGet(this, _LfPortal_isAnchorHTMLElement, "f").call(this, anchor)) {
                const { x, y } = anchor;
                const spaceBelow = window.innerHeight - y;
                const spaceRight = window.innerWidth - x;
                if (spaceBelow < offsetHeight && y > offsetHeight) {
                    style.top = `${y - offsetHeight - margin}px`;
                }
                else {
                    style.top = `${y + margin}px`;
                }
                if (spaceRight < offsetWidth && x > offsetWidth) {
                    style.left = `${x - offsetWidth - margin}px`;
                }
                else {
                    style.left = `${x + margin}px`;
                }
                return;
            }
            const { top, bottom, left, right } = anchor.getBoundingClientRect();
            const spaceBelow = window.innerHeight - bottom;
            const spaceAbove = top;
            const spaceOnLeft = left;
            const spaceOnRight = window.innerWidth - right;
            let verticalPart = "auto";
            let horizontalPart = "auto";
            if (placement === "auto") {
                verticalPart = "auto";
                horizontalPart = "auto";
            }
            else {
                const lower = placement.toLowerCase();
                // check first char for vertical
                if (lower.startsWith("t")) {
                    verticalPart = "t";
                }
                else if (lower.startsWith("b")) {
                    verticalPart = "b";
                }
                else if (lower.startsWith("l") || lower.startsWith("r")) {
                }
                if (lower.endsWith("l")) {
                    horizontalPart = "l";
                }
                else if (lower.endsWith("r")) {
                    horizontalPart = "r";
                }
            }
            let finalVertical = verticalPart;
            if (verticalPart === "auto") {
                if (spaceBelow >= offsetHeight) {
                    finalVertical = "b";
                }
                else if (spaceAbove >= offsetHeight) {
                    finalVertical = "t";
                }
                else {
                    finalVertical = "b"; // fallback
                }
            }
            else if (verticalPart === "b") {
                if (spaceBelow < offsetHeight && spaceAbove > offsetHeight) {
                    finalVertical = "t";
                }
            }
            else if (verticalPart === "t") {
                if (spaceAbove < offsetHeight && spaceBelow > offsetHeight) {
                    finalVertical = "b";
                }
            }
            let finalHorizontal = horizontalPart;
            if (horizontalPart === "auto") {
                if (spaceOnRight >= offsetWidth) {
                    finalHorizontal = "l";
                }
                else if (spaceOnLeft >= offsetWidth) {
                    finalHorizontal = "r";
                }
                else {
                    finalHorizontal = "l"; // fallback prefers left alignment
                }
            }
            else if (horizontalPart === "r") {
                if (spaceOnRight < offsetWidth && spaceOnLeft > offsetWidth) {
                    finalHorizontal = "l";
                }
            }
            else if (horizontalPart === "l") {
                if (spaceOnLeft < offsetWidth && spaceOnRight > offsetWidth) {
                    finalHorizontal = "r";
                }
            }
            switch (finalVertical) {
                case "t":
                    style.bottom = `${window.innerHeight - top + margin}px`;
                    break;
                case "b":
                    style.top = `${bottom + margin}px`;
                    break;
                default:
                    style.top =
                        offsetHeight < top && window.innerHeight - bottom < offsetHeight
                            ? `${window.innerHeight - top + margin}px`
                            : `${bottom + margin}px`;
                    break;
            }
            let scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
            if (scrollbarWidth > 30) {
                scrollbarWidth = 0;
            }
            switch (finalHorizontal) {
                case "l":
                    style.left = `${left}px`;
                    break;
                case "r":
                    style.right = `${window.innerWidth - scrollbarWidth - right}px`;
                    break;
                default:
                    style.left =
                        offsetWidth < right && window.innerWidth - left < offsetWidth
                            ? `${window.innerWidth - scrollbarWidth - right}px`
                            : `${left}px`;
                    break;
            }
            requestAnimationFrame(() => __classPrivateFieldGet(this, _LfPortal_schedulePositionUpdate, "f").call(this, element));
        });
        _LfPortal_isAnchorHTMLElement.set(this, (anchor) => {
            return anchor.tagName !== undefined;
        });
        _LfPortal_resetStyle.set(this, (element) => {
            const { style } = element;
            style.bottom = "";
            style.display = "";
            style.left = "";
            style.right = "";
            style.top = "";
        });
        //#endregion
        //#region Close
        /**
         * Closes the portal element by cleaning and resetting its style.
         */
        this.close = (element) => {
            __classPrivateFieldGet(this, _LfPortal_clean, "f").call(this, element);
            __classPrivateFieldGet(this, _LfPortal_resetStyle, "f").call(this, element);
        };
        //#endregion
        //#region getState
        /**
         * Retrieves the state associated with the given HTML element.
         */
        this.getState = (element) => {
            return __classPrivateFieldGet(this, _LfPortal_STATE, "f").get(element);
        };
        //#endregion
        //#region isInPortal
        /**
         * Checks if the given HTML element is registered within the portal manager.
         */
        this.isInPortal = (element) => {
            return __classPrivateFieldGet(this, _LfPortal_STATE, "f").has(element);
        };
        //#endregion
        //#region Open
        /**
         * Opens (or reopens) a portal element and positions it.
         * - If the element is already being managed, updates its configuration.
         * - Otherwise, sets up the element with click-away handling and adds it to the portal.
         */
        this.open = (element, parent, anchor = parent, margin = 0, placement = "auto") => {
            let state = __classPrivateFieldGet(this, _LfPortal_STATE, "f").get(element);
            if (state) {
                if (anchor) {
                    state.anchor = anchor;
                }
                if (margin !== undefined) {
                    state.margin = margin;
                }
                if (parent) {
                    state.parent = parent;
                }
                if (placement) {
                    state.placement = placement;
                }
            }
            else {
                const dismissCb = {
                    cb: () => {
                        this.close(element);
                    },
                    element,
                };
                __classPrivateFieldGet(this, _LfPortal_STATE, "f").set(element, {
                    anchor,
                    dismissCb,
                    margin,
                    parent,
                    placement,
                });
                __classPrivateFieldGet(this, _LfPortal_MANAGER, "f").addClickCallback(dismissCb, true);
                __classPrivateFieldGet(this, _LfPortal_appendToWrapper, "f").call(this, element);
            }
            __classPrivateFieldGet(this, _LfPortal_schedulePositionUpdate, "f").call(this, element);
        };
        __classPrivateFieldSet(this, _LfPortal_MANAGER, lfFramework, "f");
    }
}
_LfPortal_RAF = new WeakMap(), _LfPortal_MANAGER = new WeakMap(), _LfPortal_PORTAL = new WeakMap(), _LfPortal_STATE = new WeakMap(), _LfPortal_appendToWrapper = new WeakMap(), _LfPortal_clean = new WeakMap(), _LfPortal_schedulePositionUpdate = new WeakMap(), _LfPortal_executeRun = new WeakMap(), _LfPortal_isAnchorHTMLElement = new WeakMap(), _LfPortal_resetStyle = new WeakMap();
//# sourceMappingURL=lf-portal.js.map
