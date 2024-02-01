
/**
 * @module model/equality/base
 * 
 * The base equality module. 
 */

/**
 * The default equality comparison using equlaity.
 * @template Type
 * @param {Type} compared The compared valeu.
 * @param {Type} comparee The value compared to.
 * @returns {boolean} True, if and only if the a is equal to b.
 * @throws {Error} Either a or b is not comparable with each other.
 */

export function equality(compared, comparee) {
    return compared == comparee;
}
/**
 * The strict equality comparison using string equlaity.
 * @template Type
 * @param {Type} compared The compared valeu.
 * @param {Type} comparee The value compared to.
 * @returns {boolean} True, if and only if the a is equal to b.
 * @throws {Error} Either a or b is not comparable with each other.
 */
export function strictEquality(compared, comparee) {
    return (compared === comparee);
}
/**
 * The same value zero equality algorith.
 * @param {*} compared The compared value.
 * @param {*} comparee The value compared with.
 * @returns {boolean} True, if and only if the compared is the same value
 * as comparee with -0 and 0 handled as same value, and NaN equal to NaN.
 */

export function sameValueZero(compared, comparee) {
    if (typeof compared !== typeof comparee) {
        return false;
    } else if (compared == null) {
        // Compared was either null or undefined.
        return true;
    } else if (typeof compared === "number") {
        return Number.sameValueZero(compared, comparee);
    } else {
        return Object.is(compared, comparee);
    }
}
/**
 * The same value equality algorith.
 * @param {*} compared The compared value.
 * @param {*} comparee The value compared with.
 * @returns {boolean} True, if and only if the compared is the same value
 * as comparee with -0 and 0 handled as different numbers, and NaN equal to NaN.
 */

export function sameValue(compared, comparee) {
    if (typeof compared !== typeof comparee) {
        return false;
    } else if (compared == null) {
        // Compared was either null or undefined.
        return true;
    } else if (typeof compared === "number") {
        return Number.sameValue(compared, comparee);
    } else {
        return Object.is(compared, comparee);
    }
}
/**
 * @typedef {Object} FunctionTestOptions
 * @property {import("./integer.mjs").Integer} [minParams=0] The minimum number of parameters.
 * @property {import("./integer.mjs").Integer?} [maxParams=undefined] THe maximum number of parameters.
 * An undefined value indicates the parameter count does not have upper boundary.
 */
/**
 * Test if the valeu is a function fitting the given function options.
 * @template Type
 * @param {Function} tested The tested value.
 * @param {FunctionTestOptions} options The options of the funciton test.
 */

export function isFunction(tested, options = {}) {
    if (typeof tested !== "function") {
        return false;
    }
    if (options.minParams != null && tested.length <= options.minParams) {
        return false;
    }
    if (options.maxParams != null && tested.length >= options.maxParams) {
        return false;
    }
    return true;
}

