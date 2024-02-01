
import { describe, it } from "mocha";
import { expect } from "chai";
import { AssertionError } from "assert";
import { isInteger, toInteger, assertInteger } from "../src/model/character.mjs";
import { isTrait } from "../src/model/character.mjs";

describe("Testing Integer", () => {
    const validIntegers = [Number.MIN_SAFE_INTEGER, -(2**32), -(2**32)-1, -256, -255, -1, "-1", 0, "0", 1, "1", 255, 256, (2**32), (2**32)-1, Number.MAX_SAFE_INTEGER];
    const invalidIntegers = [Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 2**53, -(2**53), null, undefined, "a"]    
    describe("Gatekeeper isInteger", () => {
        validIntegers.forEach( (tested) => {
            it(`Valid integer ${tested}`, () => {
                expect(isInteger(tested)).true;
            });
        })
        invalidIntegers.forEach( (tested) => {
            it(`Invalid integer ${tested}`, () => {
                expect(isInteger(tested)).false;
            });
        })
    })
    describe("Conveter toInteger", () => {
        validIntegers.forEach( (tested) => {
            it(`Valid integer ${tested}`, () => {
                expect(() => { toInteger(tested) }).not.throw();
                const result = toInteger(tested);
                expect(isInteger(result)).true;
                expect(result).to.eql(+tested);
            });
        })
        invalidIntegers.forEach( (tested) => {
            it(`Invalid integer ${tested}`, () => {
                expect(() => { toInteger(tested) }).to.throw(TypeError);
            });
        })

    })
    describe("Assertion assertInteger", () => {
        validIntegers.forEach( (tested) => {
            it(`Valid integer ${tested}`, () => {
                expect(() => { assertInteger(tested) }).not.throw();
            });
        })
        invalidIntegers.forEach( (tested) => {
            it(`Invalid integer ${tested}`, () => {
                expect( () => {assertInteger(tested);}).to.throw(AssertionError);
            })
        })

    })
})

describe("Trait", () => {
    const validTraits = [
        {isTrait: true, name: "Thief", description: "A thief skilled in the arts of burglary and pickpocketting"}, 
        {isTrait: true, name: "Bene Gesserit trained", 
        description: "A layman member of the order with the Bene Gesserit training for noble daughters"}
    ];
    const invalidTraits = [undefined, null, "Thief", { ...validTraits[0], name: undefined}, {isTrait: true }];
    
    it("isTrait", () => {
        validTraits.forEach( (tested, index) => {
            expect(isTrait(tested, `Expected a valid trait #${index} to be true`)).true;
        })
        invalidTraits.forEach( (tested, index) => {
            expect(isTrait(tested, `Expected an invalid trait #${index} to be false`)).false;
        })
    });
})