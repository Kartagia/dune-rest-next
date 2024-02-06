
/**
 * @module model/genericset
 * 
 * THis module implements generic set which is both JSONifiable, and
 * allows custom JSONiified comparator.
 */

import { equal, strict, strictEqual } from "assert";
import { equality, isFunction, sameValue, sameValueZero, strictEquality } from "./equality.base.mjs";

/**
 * The primitive JSON values.
 * @typedef {number|string|boolean|null|Date} JsonPrimitive
 */

/**
 * The last node of the JSON structure containing only primitive values, arrays of primiitive
 * values, or objects with primitive values.
 * @typedef {Array<JsonPrimitive>|Record<string,JsonPrimitive>|JsonPrimitive} JsonLeaf 
 */

/**
 * JSON array. May contain json primitives, arrays and objects.
 * @typedef {Array<JsonNode|JsonPrimitive>} JsonArray
 */

/**
 * JSON object. May contain json prmitives, arrays and objects.
 * @typedef {{[key: string]: JsonNode|JsonPrimitive}} JsonObject
 */

/**
 * A generic JSON node, which is a json collection of json primitives, arrays and objects.
 * The JSON node may be leaf node, but it is never a primitive value.
 * @typedef {Array<JsonLeaf>|Record<string,JsonLeaf>| JsonArray | JsonObject } JsonNode
 */

/**
 * JSON value can contain either JsonNode or JsonPrimitive values. 
 * @typedef {JsonNode|JsonNode} JSONValue
 */

/**
 * The function performing replacing of a value with JSONifieid version of the value.
 * @type [Type=any]
 * @callback JsonReplacerFunction
 * @param {string} key The property name or array index of the handled property or element. "" if handling
 * the actual JOSNified value.
 * @param {Type} value The handled value.
 * @returns {JSONValue|undefined} THe given value JSONiified, or an undefined value indicating the value
 * is not JSONified.
 */

/**
 * The JSON replacer array defining the array indices and properties of objects JSONified from
 * array and object values.
 * @typedef {Array<string|number>} JsonReplacerArray
 */

/**
 * The replacer of the JSON stringification. An undefined or null indicates the default behavior
 * is used (stringifying all array indices and object keys).
 * @template [Type=any]
 * @typedef {JsonReplacerArray|JsonReplacerFunction<Type>|undefined|null} JsonReplacer
 */


/**
 * Createa json replacer function. The filters takes precedences over ignores - if a value is accepted by
 * a filter, it cannot be ignored.
 * @template [Type=any]
 * @param {Object} options
 * @param {Array<string|number>?} [options.fields] The replacer field array.
 * @param {(value: Type, key:(string|number)="")=>boolean} [options.ignore] The filter of the ignored key-value pairs. 
 * @param {(key: string|number) => boolean} [options.ingoreKey] The filter of ignored keys. The default key filter
 * ignores all keys which are not strings or numbers.
 * @param {(value: Type, key:(string|number)="")=>boolean} [options.filter] The filter of the key-value pairs. 
 * @param {(key: string|number) => boolean} [options.keyFilter] The filter of keys. If fields is defined, defaults to
 * to filter only accepting values loosely equal to any value in fields list. If fields is not given, defaults
 * to all string and number valued keys.
 * @param {(value: Type, key?:string) => JSONValue|undefined} [options.replacer] The replacer function used
 * for all values passing the filters. The default replacer is the standard JSON stringification with the fields
 * as replacer.
 * @returns {JsonReplacerFunction<Type>|JsonReplacerArray}
 */
export function createJsonReplacer(options = {}) {
    const {
        fields = undefined,
        filter = undefined,
        ignore = undefined,
        replacer
    } = options;
    const {
        keyFilter = (fields ? ((key) => (fields.findIndex((field) => (field == key)) >= 0)) : 
        ((key) => (typeof key === "string" || typeof key === "number")))
    } = options;
    const {
        ignoreKey = /** @type {(key:string|number) => boolean}*/ ((key) => (!keyFilter(key)))
    } = options;
    if (fields && !(options.fields || options.ignore || options.keyFilter || options.keyIgnorer || options.replacer)) {
        // We only got fields - returning it as the replacer.
        return fields;
    } else {
        // Constructing the function.
        return /** @typedef {JsonReplacerFunction<Type>} */ (key, value) => {
            if (keyFilter(key) && (filter && filter(value, key))) {
                if (replacer) {
                    return replacer(key, value);
                } else {
                    return JSON.stringify(value, fields);
                }
            } else if (ignore(value, key) || ignoreKey(key)) {
                // The value is ignored.
                return undefined;
            } else {
                // Doing nothing, if the filter is not pasased for next processor as it is.
                return value;
            }
        };
    }
}

/**
 * Safe JSON replacer converts BigInts into "n" suffixed string representation generally
 * used as the string representation of a big integer literals. Symbol values are ignored as
 * they cannot be serialized. 
 */
export const safeJsonReplacer = createJsonReplacer({filter: (value, key) => {
    return value instanceof Date || value instanceof Object || [
        "object", // This is null as functions has type of "function" and other objects are caught by previous clause
        "string",
        "bigint",
        "boolean",
        "number"].includes(typeof value) 
        || 
        ( // Types not ingored, if we are processing an array.
            ["string", "number"].includes(typeof key) && 
            Number.isSafeInteger(+key) && ["undefined", "symbol", "function"].includes(typeof value)
        )
}, replacer: (value, key="") => {
    if (typeof value === "bigint") {
        return "" + value + "n";
    } else if (typeof value ==="number") {
        if (Number.isNaN(value)) {
            return "[NaN]";
        } else if (value === Number.POSITIVE_INFINITY) {
            return "[+Inf]"
        } else if (value === Number.NEGATIVE_INFINITY) {
            return "[-Inf]"
        } else {
            return value;
        }
    } else if (["undefined", "symbol", "function"].includes(typeof value)) {
        return null;
    } else {
        return value;
    }
}})

/**
 * Revives safe 
 * @param {*} key 
 * @param {*} value 
 * @returns 
 */
export const safeJsonRevier = (key, value) => {
    const regex = /(?<value>^[+-]\d+)n$/;
    if (typeof value === "string") {
        const match = regex.exec(value);
        if (match) {
            return BigInt(match.groups.value);
        } else {
            return value;
        }
    } else {
        return value;
    }
}

/**
 * @template [Type=any]
 * @typedef {Object} Equalizer
 * @property {import("./equality.base.mjs").EqualityFunction<Type>} equalityFunction The equality function
 * of the equalizer.
 * @property {(replacer: (key: string, value: any) => (string|number|Date|Object|boolean|Array|undefined)|Array<string|number>) => string} toJSON converting the equalizer into JSON.
 * @property {(string) => Equalizer|undefined} fromJSON Converting the JSON value of an equalizer function
 * into the euqlaizer function, or returning an undefined value.
 */

/**
 * @template [Type=any]
 * @extends {import("./setlike.mjs").SetLike<Type>}
 */
export class GenericSet extends Set {

    static getKnownEqualities() {
        return [sameValueZero, sameValue, equality, strictEquality];
    }

    static isKnownEquality(value) {
        return isFunction(value, { minParam: 2 }) && this.getKnownEqualities().indexOf(value) >= 0;
    }

    /**
     * Create a new generic set.
     * @param {Type[]} [elements=[]] The elements of the set.
     * @param {import("./equality.base.mjs").EqualityFunction|Equalizer} [equalityFn] The equality function
     * to  
     */
    constructor(elements = [], equalityFn = sameValueZero) {
        if (isKnownEqulaity(equalityFn) || "fromJSON" in equalityFn.constructor) {

        }
        super(elements);
    }

    [Symbol.species] = Set;

}