
import { describe, it } from "mocha";
import { AssertionError, expect } from "chai";
import { isInteger } from "../src/model/character.mjs";

describe("Testing Integer", () => {
    const validIntegers = [Number.MIN_SAFE_INTEGER, -(2**32), -(2**32)-1, -256, -255, -1, "-1", 0, "0", 1, "1", 255, 256, (2**32), (2**32)-1, Number.MAX_SAFE_INTEGER];
    const invalidIntegers = [Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 2**53, -(2**53), null, undefined, "a"]    
    describe("Gatekeeper isInteger", () => {
        validIntegers.forEach( (tested) => {
            it(`Valid integer ${tested}`, () => {
                expect(isInteger(value)).true;
            });
        })
        invalidIntegers.forEach( (tested) => {
            it(`Invalid integer ${tested}`, () => {
                expect(isInteger(value)).false;
            });
        })
    })
    describe("Conveter toInteger", () => {
        validIntegers.forEach( (tested) => {
            it(`Valid integer ${tested}`, () => {
                expect(() => { toInteger(value) }).not.throw();
                const result = toInteger(value);
                expect(isInteger(result)).true;
                expect(result).to.eql(+value);
            });
        })
        invalidIntegers.forEach( (tested) => {
            it(`Invalid integer ${tested}`, () => {
                expect(() => { toInteger(value) }).to.throw(RangeError);
            });
        })

    })
    describe("Assertion assertInteger", () => {
        validIntegers.forEach( (tested) => {
            it(`Valid integer ${tested}`, () => {
                expect(() => { toInteger(value) }).not.throw();
            });
        })
        invalidIntegers.forEach( (tested) => {
            it(`Invalid integer ${tested}`, () => {
                expect(() => { toInteger(value) }).to.throw(AssertionError);
            });
        })

    })
})