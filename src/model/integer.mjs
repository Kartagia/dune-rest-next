import { AssertionError } from "assert";

/**
 * An integer which is a safe integer.
 * @typedef {number & {__isInteger: true}} Integer
 */
/**
 * A number which is a safe integer.
 * @param {*} value The tested value.
 * @returns {boolean} True, if and only if the value is a safe integer.
 */

export function isInteger(value) {
    try {
        switch (typeof value) {
            case "string":
            case "number":
                return typeof (+value) === "number" && Number.isSafeInteger(+value) == true;
            default:
                return false;
        }

    } catch (error) {
        // NOP:
    }
    return false;
}
/**
 * Convert a value to a safe integer.
 * @param {*} value The converted value.
 * @returns {Integer} The result of the conversion.
 * @throws {TypeError} The value is not suitable for a save itneger.
 */

export function toInteger(value) {
    if (isInteger(value)) {
        return (+value);
    } else {
        throw new TypeError("THe value is not a safe integer");
    }
}
/***
 * Assertion checking that a value is a number.
 * @param {*} value The tested value.
 * @throws {AssertionError} The value is not an integer.
 */

export function assertInteger(value) {
    if (!isInteger(value)) {
        throw new AssertionError({ message: "Cannot conver the value to a safe integer" });
    }
}
