

import { strictEquality, sameValueZero } from "./equality.base.mjs";
import { isSetLike } from "./setlike.mjs";


/**
 * Predicate testing a function.
 * @callback MethodTester
 * @param {Function} tested The tested value.
 * @returns {boolean} True, if and only if the tested is valid.
 */

/**
 * Predicate testing a property value.
 * @template [Type=any] The type of the property value.
 * @callback PropertyTester
 * @param {Value} tested The tested value.
 * @returns {boolean} True, if and only if the property value is valid.
 */

/**
 * The tester of a member.
 * @typedef {MethodTester|PropertyTester} MemberTester
 */

/**
 * The interface for testing whether a value fulfils an interface or not.
 * @typedef {Object} InterfaceDefinition
 * @property {Record<string|number|symbol, MemberTester>} [required={}] The required members.
 * @property {Record<string|number|symbol, MemberTester>} [optional={}] The optional members.
 */

/**
 * The testing wehther a value implements an interface. 
 * @param {any} value 
 * @param {InterfaceDefinition} [options] The interface definition.
 */
export function implementsInterface(value, options = {}) {
    if (value instanceof Object) {
        const { required = {}, optional = {} } = options;
        for (const property of required) {
            if (!(property in value)) {
                return false;
            } else if (!required[property](value[property])) {
                return false;
            }
        }
        for (const property of optional) {
            if ((property in value) && !optional[property](value[property])) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

/**
 * Is the value iterator.
 * @template Type The value type of the iteartor.
 * @template [ReturnType=any] The type of the return value.
 * @template [NextType=IteratorResult<Type>] The type of the value returned by next.
 * @param {Iterator<Type, ReturnType, NextType>} value The tested value.
 * @returns {boolean} True, if and only if the value has "next"-method.
 */
export function isIterator(value) {
    return (value instanceof Object && "next" in value && typeof value.next === "function")
        && ["throws", "returns"].every((prop) => (!(prop in value) || typeof value[prop] === "function"));
}

/**
 * Is the value iterable
 * @template [Type=any]
 * @param {*} value The tested value.
 * @returns {boolean} True, if and only if the given value is iterable object.
 */
export function isIterable(value) {
    return (value instanceof Object && Symbol.iterator in value && typeof (value[Symbol.iterator]) === "function");
}

/**
 * Check equality of the sets.
 * @template Type
 * @param {Set<Type>|SetLike<Type>} compared The compared set.
 * @param {Set<Type>|SetLike<Type>} comparee The set compared to.
 * @param {(a: Set<Type>, b: Set<Type>) => boolean} [equalityFn] The equality function.
 * Defaults to the strict equality (operator "===").
 * @returns {boolean} True, if and only if the compared is equal to comparee with the comparison
 * function.
 * @throws {Error} Either compared or comparee had an element incompatible with equality function.
 */
export function equalSets(compared, comparee, equalityFn = strictEquality) {
    if (!(isSetLike(compared) && isSetLike(comparee))) {
        // Only setlikes can be equals with sets equality.
        return false;
    }
    if (compared instanceof Set && comparee instanceof Set && compared.size !== comparee.size) {
        return false;
    } else {
        const compareeKeys = [...comparee.keys()];
        const comparedKeys = [...compared.keys()];
        return comparedKeys.every((key) => (compareeKeys.findIndex((item) => (
            equalityFn(item, key)) >= 0)
        )) && compareeKeys.every((key) => comparedKeys.findIndex((item) => (
            equalityFn(key, item)) >= 0));
    }
}

/**
 * Test equality of the maps.
 * @template Key the type of keys.
 * @template Value The type of values
 * @param {Map<Key, Value>} compared  The compared map.
 * @param {Map<Key, Value>} comparee  The map compared to.
 * @param {(compared: Key, comparee: Key) => boolean} keyEqualityFn
 * @param {(compared: Value, comparee: Value)} valueEqualityFn
 * @returns {boolean} True, if an donly if the compared and comparee are have same key-value pairs, but
 * the order may differ.
 */
export function equalMaps(compared, comparee, keyEqualityFn = sameValueZero, valueEqualityFn = strictEquality) {
    return equalSets(compared, comparee, keyEqualityFn) &&
        ([...compared.keys()].every((key) => (valueEqualityFn(compared.get(key), comparee.get(key)))));
}
/**
 * Check euquality of the arrays.
 * @template Type The type of the array.
 * @param {Array<Type>} a The first array.
 * @param {Array<Type>} b The second array:
 * @param {(a: Type, b: Type) => boolean} [equalityFn] The equality function of the elements.
 * Defaults to the strict equality (operator "===").
 */
export function equalArrays(a, b, equalityFn = strictEquality) {
    return (Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
        a.every((_, index) => (equalityFn(a[index], b[index]))));
}
/**
 * Find first index of element within array using given equality function.
 * @template Type The type of the array.
 * @param {Array<Type>} elements The tested array.
 * @param {Type} seeked The sought element.
 * @param {(a: Type, b: Type) => boolean} [equalityFn] The equality function of the elements.
 * Defaults to the strict equality (operator "===").
 * @returns {Type|undefined} Find the first member of elements equivalent ot the seeked, or
 * an undefined value, if none exists.
 */
export function find(elements, seeked, equalityFn = strictEquality) {
    if (isArray(elements)) {
        return elements.find((member) => (equalityFn(member, seeked)));
    } else {
        return -1;
    }
}
/**
 * Find first index of element within array using given equality function.
 * @template Type The type of the array.
 * @param {Array<Type>} elements The tested array.
 * @param {Type} seeked The sought element.
 * @param {(a: Type, b: Type) => boolean} [equalityFn] The equality function of the elements.
 * Defaults to the strict equality (operator "===").
 * @returns
 */
export function firstIndex(elements, seeked, equalityFn = ((a, b) => (a === b))) {
    if (isArray(elements)) {
        return elements.firstIndex((member) => (equalityFn(member, seeked)));
    } else {
        return -1;
    }
}
