
/**
 * @typedef {Object} FunctionTestOptions
 * @property {number} [minParams=0] The minimal number of required parameters.
 * @property {number} [maxParams=Number.POSITIVE_INFINITY] The maximal number of required paramters.
 */

/**
 * 
 * @param {*} value The tested value.
 * @param {FunctionTestOptions} [options] The options of the function paramter count.
 * @returns {boolean} True, if and only if the value is a function, and has required
 * parameters withing given minimal and maximal amount. 
 */
function isFunction(value, options={}) {
    return typeof value === "function" && ( (options.minParams ?? 0) <= value.length) && 
      (value.length <= (options.maxParams ?? Number.POSITIVE_INFINITY ));
}

/**
 * @template Type The value type.
 * @typedef {Object} SetLike
 * @property {number} size The size of the set.
 * @property {(value: Type) => boolean} has The method testing whether a value belongs to the set.
 * @property {Iterator<Type, Type>}  keys The iterator returning the keys of the set.
 */
/**
 * Test, if a value is set-like.
 * @param {*} value The tested value.
 * @returns {boolean} True, if and only if the method seems to fulfil the setlike.
 */

export function isSetLike(value) {
    return (value instanceof Object && [
        ["size", (value) => (typeof value === "number")],
        ["has", (value) => (isFunction(value, { minParams: 1 }))],
        ["keys", (value) => (isFunction(value, { minParams: 0 }))]
    ].every(([property, propertyTest]) => (
        property in value && propertyTest(value[property])
    )));
}

export function isReadableSetLike(value) {
    return isSetLike(value) && ["values", Symbol.iterator, "forEach", "entries"].forEach(
        (property) => ((property in value) && (isFunction(value.property)))
    );
}

export function isWritableSetLike(value) {
    return isReadableSetLike(value) && [["clear", { maxParams: 0 }], ["add", { minParams: 1 }], ["delete", { minParams: 1 }]
    ].forEach(
        (property) => (([property, opt] in value) && (isFunction(value.property, opt)))
    );
}
