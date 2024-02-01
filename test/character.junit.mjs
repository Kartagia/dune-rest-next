

import { describe, it } from "mocha";
import { expect } from "chai";
import { assertInteger } from "../src/model/character.mjs";

/**
 * @module test/model/charcter/junit
 * 
 * The UNIT testing performed by the developer.
 */

describe("assertInteger", () => {
    it("Simple test it works with null", () => {
        expect(() => {assertInteger(null)}).to.throw();
    })
    it("Simple test it works with an integer", () => {
        expect(() => {assertInteger(Number.MAX_SAFE_INTEGER)}).not.throw();
    })
})
