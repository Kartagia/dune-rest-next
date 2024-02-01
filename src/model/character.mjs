
/**
 * @module model/character
 * The character of the Dune RPG.
 */

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


/**
 * Regular expression matching to a single name word.
 */
const nameWordRegex = new RegExp("(?:\\p{Lu}\\p{Ll}+(?:[\\p{Pd}`'´]\\p{L}\\p{Ll}+)*)", "u");

/**
 * Regular expression matching to one or more name words joined with either dash or space.
 */
const namesWordRegex = new RegExp("(?:" +
    nameWordRegex.source + "(?:[\\p{Pd}\\p{Zs}]" +
    nameWordRegex.source + ")" + ")", "u")

/**
 * Regular expression matching to a multi word name with quoted parts. 
 * Reserves the capturing group "quot", which will contain the quote of hte last 
 * name part.
 */
const nameRegEx = new RegExp("^" + nameWordRegex.source +
    "(?:[\\p{Zs}](?<quot>[\"']?)" + namesWordRegex.source + "\k<quot>)*" + "$", "u");

/**
 * The interface of a named objects. The named objects
 * are always identified by the name.
 * @typedef {Object} Named 
 * @property {string} name The unique name of the object.
 */
export function isNamed(value) {
    if (value == null) return false;
    try {
        const strVal = "" + value;
        return nameRegEx.test(strVal);
    } catch (error) {
        return false;
    }
}

/**
 * Regular expression matching to a placeholder. 
 */
const placeholderRegex = new RegExp("(?:\\[\\p{Lu}\\p{Ll}*\\p{N}*\\])", "u");
/**
 * Regular expression matching to a placeholder, and capturing the placeholder name and index into groups
 * "name" and "index."
 */
const capturingPlaceholderRegex = new RegExp("(?:\\[" + "(?<name>\\p{Lu}\\p{Ll}*)" + "(?<index>\\p{N}+)?" + "\\])", "gu");
/**
 * Regular expression matching to a single name word or a placeholder designation.
 */
const nameWordOrPlaceholderRegex = new RegExp("(?:" + nameWordRegex.source + "|" + placeholderRegex.source + ")", "u");


/**
 * Regular expression matching to one or more name words joined with either dash or space.
 */
const nameWordsOrPlaceholdersWordRegex = new RegExp("(?:" +
    nameWordOrPlaceholderRegex.source + "(?:[\\p{Pd}\\p{Zs}]" +
    nameWordOrPlaceholderRegex.source + ")" + ")", "u")

/**
 * Regular expression matching to a multi word name with quoted parts. 
 * Reserves the capturing group "quot", which will contain the quote of hte last 
 * name part.
 */
const nameWithPlaceholdersRegEx = new RegExp("^" + nameWordOrPlaceholderRegex.source +
    "(?:[\\p{Zs}](?<quot>[\"']?)" + nameWordsOrPlaceholdersWordRegex.source + "\k<quot>)*" + "$", "u");

/**
 * Is the given value a named with placeholders.
 * @param {*} value The tested value. 
 */
export function isNamedWithPlaceholders(value) {
    if (value == null) return false;
    try {
        const strVal = "" + value;
        return nameWithPlaceholdersRegEx.test(strVal);
    } catch (error) {
        return false;
    }

}

/**
 * The interface of a described objects.
 * @typedef {Object} Described
 * @property {string} description The description of the object.
 */

/**
 * Is a value described. 
 * A value is Described, if it 
 * does have property "description" with non-empty string value.
 * @param {*} value The tested value.
 * @returns True, if and only if the value is optionally described. 
 */
export function isDescribed(value) {
    return value instanceof Object && "description" in value && 
    ( typeof value.description === "string" || value.description instanceof String) &&
    (""+value.description).length > 0;
}

/**
 * The interface of an object with may have description.
 * @typedef {Partial<Described>} OptionallyDescribed
 */

/**
 * Is a value optionally described.The value is optionally described, if it 
 * does not have property "description", or it is Described.
 * @param {*} value The tested value.
 * @returns True, if and only if the value is optionally described. 
 */
export function isOptionallyDescribed(value) {
    return value instanceof Object && (!("description" in value) || isDescribed(value));
}

/**
 * The interface of a counted objects.
 * @typedef {Object} Counted
 * @property {Integer} count The number of elements.
 */

/**
 * The properties only traits have.
 * @typedef {Object} ITrait
 * @property {true} isTrait The object is always a trait.
 */

/**
 * The interface of a trait.
 * @typedef {Counted & Named & OptionallyDescribed & ITrait} Trait
 */

/**
 * Test if a value is a trait.
 * @param {*} tested The tested value.
 * @returns {boolean} True, if and only if the tested is a trait.
 */
export function isTrait(tested) {
    return typeof tested === "object" && "isTrait" in tested && tested.isTrait &&
        isNamed(tested) && isOptionallyDescribed(tested);
}

/**
 * The special ability specific properties.
 * @typedef {Object} ITalent
 * @property {true} isTalent The object is always a talent.
 * @property {boolean} [unique=true] Is the talent unique. A non-unique
 * talent can exists multiple times.
 */

/**
 * A special ability.
 * @typedef {ITalent & Named & Described} Talent
 */

/**
 * Test if a value is a talent
 * @param {*} tested The tested value.
 * @returns {boolean} True, if and only if the tested is a talent.
 */
export function isTalent(tested) {
    return typeof tested === "object" && "isTalent" in tested && tested.isTalent &&
        isNamed(tested) && isDescribed(tested) && (!("unique" in tested) || (typeof tested.unique === "boolean"));
}


/**
 * The TalentTemplate specific properties.
 * @template Type
 * @typedef {Object} ITalentTemplate
 * @property {(instance: Type) => boolean} validInstantiator The instantiator tester.
 * @property {(instance: Type)=>(Talent)} createInstance The constructor of a talent from the template.
 */

/**
 * Talent template is used to generate new Talents
 * @template Type
 * @typedef {ITalentTemplate<Type> & Partial<ITalent> & Named & Described} TalentTemplate
 */

/**
 * Create talent template.
 * @param {string} talentName The talent naem with the placeholders.
 * @param {string} descriptionTemplate The description template. 
 * @return {TalentTemplate<Object[]>} The talent template with object parameters generated
 * from the talent name.
 */
export function createTalentTemplate(talentName) {

    /**
     * A new copy of the capturing placeholder regex to ensure the updates during execution
     * does not cause unwanted side effects.
     * @type {RegExp}
     */
    const chooserRegExp = new RegExp(capturingPlaceholderRegex.source, "ug");

    /**
     * The gate keeper list.
     * @type {Array<(value: any) => boolean>}
     */
    const gatekeepers = new Array();

    const placeholderNames = [];

    const replacementFunctions = [];

    let match;
    while ((match = chooserRegExp.exec(talentName))) {
        if (!placeholderNames.find((value) => (value === `${match.groups.name}${match.groups.index ?? ""}`))) {
            // The placeholder is a new one - createing a new entry for it.
            placeholderNames.push(`${match.groups.name}${match.groups.index ?? ""}`);
            switch (match.name) {
                case "Drive":
                    gatekeepers.push(isDrive(value));
                    replacementFunctions.push((value) => (value.name));
                    break;
                case "Talent":
                    gatekeepers.push(isTalent(value));
                    replacementFunctions.push((value) => (value.name));
                    break;
                case "Trait":
                    gatekeepers.push(isTrait(value));
                    replacementFunctions.push((value) => (value.name));
                    break;
                case "Asset":
                    gatekeepers.push(isAsset(value));
                    replacementFunctions.push((value) => (value.name));
                    break;
                case "Skill":
                    gatekeepers.push(isSkill(value));
                    replacementFunctions.push((value) => (value.name));
                    break;
                default:
                    // The default gatekeeper requires a non-empty string to fill the placeholder.
                    gatekeepers.push((value) => (value instanceof String && value.length > 0));
                    replacementFunctions.push((value) => (value));
            }
        }
    }

    return {

        /**
         * Check the validity of the instantiator.
         * @param {Object[]} value The value used for construction
         * @returns {boolean} True, if and only if the value is valid value
         * for constructing a new talent from tempalte.
         */
        validInstantiator(value) {
            return Array.isArray(value) && value.every((entry, index) => (index < gatekeepers.length && gatekeepers[index](entry)));
        },

        createInstance(value) {
            if (this.validInstantiator(value)) {
                const name = replacementFunctions.reduce((result, replacementFn, index) => {
                    return result.replaceAll(new RegExp(`\\[${placeholderNames[index]}\\]`, "ug"), replacementFn(value));
                }, talentName);
                return {
                    name,
                    description: replacementFunctions.reduce((result, replacementFn, index) => {
                        return result.replaceAll(new RegExp(`\\[${placeholderNames[index]}\\]`, "ug"), replacementFn(value));
                    }, description ?? `Talent ${name}.`),
                    count: 1,
                    get isTalent() { return true },
                    unique: true
                }
            } else {
                throw new RangeError("Invalid value for the talent creation");
            }
        }
    }
}

/**
 * A constructor creating a talent template.
 * @constructor
 * @template [Type=undefined] The type of the value used to generate the talent.
 * @param {Partial<Talent>} baseTalent The base talent.
 * @param {(value: Type) => boolean} [validator] The validator of the value.
 * @param {(value: Type) => Talent} [instantiator] The function creating the instance. 
 * @returns {TalentTemplate} The created talent template.
 * @throws {RangeError} The base talent lacks all required fields.
 */
export function TalentTemplate(baseTalent, validator = (() => true), instantiator = undefined) {
    if (baseTalent?.name) {
        // The talent has a name.
        chooserRegExp.exec()
        const chooserIndex = baseTalent.name.indexOf("(");
        if (chooserIndex >= 0) {

        }
    } else {
        // The talend does not have a name.
        if (baseTalent.name === undefined && instantiator === undefined) {
            throw new RangeError(`The base talent does not have all required fields`);
        } else {
            const result = {
                ...baseTalent,
                name: ChooseName,
                validInstantiator(value) {
                    return validator(value)
                },

                createTalent(value) {
                    return {
                        ...baseTalent,
                        ...(instantiator(value))
                    }
                }
            }
        }
    }

    return {
        ...baseTalent,

    };
}

/**
 * Create a new talent template.
 * @template Type THe type of the value used to generate the template value.
 * @param {TalentTemplate<Type>} template 
 * @param {Type} value The value used to generate the talent.
 * @returns {Talent} The talent constructed from the template.
 * @throws {RangeError} The given value was invalid.
 */
export function createTalent(template, value) {
    if (template.validInstantiator(value)) {
        return template.createInstance(value);
    } else {
        throw new RangeError("Cannot create a talent from given the value");
    }
}

/**
 * The asset specific properties and methods.
 * @typedef {Object} IAsset
 * @property {true} isAsset The object is always an asset.
 * @property {Integer} [quality=0] The quality of the asset.
 * @property {string[]} [types=[]] The asset types of the asset.
 * @property {boolean} [tanglible=false] Is the asset tanglible. 
 * A tanglible asset is carried by the person in the scale and counts
 * towards asset limitation.
 * @property {boolean} [temporary=false] Is the asset temporary.
 * @property {boolean} [reserved=false] Is the asset reserved. A reserved
 * asset cannnot be called to the scene, or used unless it is in the scene.
 * @property {boolean} [transferrable=true] Can the control of the asset transferred.
 */



/**
 * The interface of a trait.
 * @typedef {Trait & IAsset & Counted & Named} Asset
 */

/**
 * Test if a value is an asset.
 * @param {*} tested The tested value.
 * @returns {boolean} True, if and only if the tested is an asset.
 */
export function isAsset(tested) {
    return isTrait(tested) && "isAsset" in tested && tested.isAsset
        && (!("quality" in tested) || isInteger(tested.quality))
        && ["tanglible", "temporary", "remserved", "transferrable"].every((property) => (
            !(property in tested) || typeof tested[property] === "boolean"))
        && isNamed(tested) && isDescribed(tested);
}


/**
 * Check euquality of the arrays.
 * @template Type The type of the array.
 * @param {Array<Type>} a The first array.
 * @param {Array<Type>} b The second array:
 * @param {(a: Type, b: Type) => boolean} [equalityFn] The equality function of the elements.
 * Defaults to the equivalence operator "===".
 */
export function equalArrays(a, b, equalityFn = ((a, b) => (a === b))) {
    return (Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
        a.every((_, index) => (equalityFn(a[index], b[index]))));
}

/**
 * Find first index of element within array using given equality function.
 * @template Type The type of the array.
 * @param {Array<Type>} elements The tested array. 
 * @param {Type} seeked The sought element.
 * @param {(a: Type, b: Type) => boolean} [equalityFn] The equality function of the elements.
 * Defaults to the equivalence operator "===".
 * @returns {Type|undefined} Find the first member of elements equivalent ot the seeked, or
 * an undefined value, if none exists.
 */
export function find(elements, seeked, equalityFn = ((a, b) => (a === b))) {
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
 * Defaults to the equivalence operator "===".
 * @returns 
 */
export function firstIndex(elements, seeked, equalityFn = ((a, b) => (a === b))) {
    if (isArray(elements)) {
        return elements.firstIndex((member) => (equalityFn(member, seeked)));
    } else {
        return -1;
    }
}

/**
 * Test equality of the assets.
 * @param {Asset} a The compared asset.
 * @param {Asset} b The asset compared asset is compared with.
 * @returns {boolean} True, if and only if the two eassets are qaulas.
 */
export function equalAssets(a, b) {
    return (a.name === b.name && a.quality === b.quality && equalArrays(a.types, b.types) &&
        a.tanglible === b.tanglible && a.temporary === b.temporary);
}


/**
 * @typedef {Object} IDuneCharacter
 * @property {string} name The character name.
 * @property {string?} [owner] THe owner of the character.
 * @property {string[]} [allowedUsers=[]] The allowed users of the character.
 * @property {Record<string, Integer>} [skills] The skills of the character.
 * @property {Record<string, Integer>} [drives] The drives of the character.
 * @property {Trait[]} [traits=[]] The traits of the character.
 * @property {Assets[]} [assets=[]] The assets of the character.
 * @property {Talent[]} [talents=[]] The talents of the character.
 */

/**
 * @typedef {Object} ISkill
 * @property {true} isSkill The object is a skill. 
 * @property {Integer} [value=4] The value of the skill.
 */

/**
 * A skill of the character.
 * @typedef {ISkill & Named} Skill
 */

/**
 * @typedef {Object} IDrive
 * @property {true} isDrive The object is a drive. 
 * @property {boolean} [challenged=true] Is the drive challenged.
 * @property {Integer} [value=4] The value of the drive.
 * @property {string} [statement] THe drive statment.
 */

/**
 * A skill of the character.
 * @typedef {IDrive & Named} Drive
 */

export function isDrive(tested) {
    return isNamed(tested) && "isDrive" in tested && tested.isDrive === true
        && ["challenged"].every((prop) => (!(prop in tested) || typeof tested === "boolean"))
        && ["value"].every((prop) => (!(prop in tested) || isInteger(prop.value)))
        && ["statement"].every((prop) => (!(prop in tested) || typeof tested[prop] === "string" && tested[prop].length > 0))
}


/**
 * The options of the dune character.
 * @typedef {IDuneCharacter} DuneCharacterOptions
 */

export const ChooseName = "(Choose)";

/**
 * The default options for a minor character such a supporting PC ally or a minor NPC.
 * @type {DuneCharacterOptions>}
 */
const defaultMinorCharcterOptions = {
    traits: [ChooseName],
    assets: [],
    talents: [],
    drives: { [ChooseName]: 5 },
    skills: { "Battle": 4, "Communication": 4, "Discipline": 4, "Move": 4, "Understand": 4 }
};


/**
 * The default options for a major character such PC or major NPC.
 * @type {DuneCharacterOptions>}
 */
const defaultMajorCharcterOptions = {
    traits: [],
    assets: [],
    talents: [],
    drives: { "Duty": 4, "Faith": 4, "Justice": 4, "Power": 4, "Truth": 4 },
    skills: { "Battle": 4, "Communication": 4, "Discipline": 4, "Move": 4, "Understand": 4 }
};

/**
 * The Dune character.
 * @extends {IDuneCharacter}
 */
export class DuneCharacter {

    /**
     * Create a new dune character.
     * @param {DuneCharacterOptions} [options] The options of the dune character. 
     */
    constructor(options = {}) {
        /**
         * Traits of the character.
         */
        this.traits = options?.traits || [];
        /**
         * The talents of the character.
         */
        this.talents = options?.talents || [];
        /**
         * The assets of the character.
         */
        this.assets = options?.assets || [];
        /**
         * The skills of hte character.
         */
        this.skills = options?.skills || {};
        /**
         * The drives of the characgter.
         */
        this.drives = options?.drives || {};

        if (options.normalize) {
            this.normalize();
        } else {
            this.check();
        }
    }

    /**
     * Test the itnernal state of the character.
     * @param {boolean} [failOnFirst=true] Does the operation fail on first error. 
     * @returns {Record<string, Record<string, AssertionError[]>>} The errors found for each erroneus subgorup.
     * @throws {AssertionError} The fail on first was true, and there was an invalid trait.
     */
    check(failOnfirst = true) {
        const result = {};
        result.traits = this.checkTraits(failOnFirst);
        result.assets = this.checkAssets(failOnFirst);
        result.talents = this.checkTalents(failOnFirst);
        result.skills = this.checkSkills(failOnFirst);
        result.drives = this.checkDrives(failOnFirst);
        return result;
    }

    /**
     * Chack duplicity.
     * @template {Type, Identity}
     * @param {Array<Type>} collection 
     * @param {Type} tested 
     * @param {(value: Type) => Identity} identityFn The function determining the identity of the
     * value. Defaults to the name property, if the type has name property, or equality operator "===".
     * @param {(a: Identity, b: Identity) => boolean} equalityFn The funciton testing equality of the identities.
     * @param {boolean} [wantIndex=false] Does the caller want index instead of boolean value.
     * @returns {boolean|Integer}  If the caller wants index, the index of the first duplicate. Otherwise
     *  true, if and only if the tested has equivalent in the collection.
     */
    static checkDuplicity(collection, tested, identityFn = ((a, b) => {
    }), equalityFn = ((a, b) => (a === b)), wantIndex = false) {
        const index = collection.findIndex((member) => (equalityFn(identityFn(member), idenitytFn(tested))));
        if (wantInded) {
            return index;
        } else {
            return index >= 0;
        }
    }

    /**
     * Test traits, and either throw an error on failrue, or return the errors of the
     * erroneus traits.
     * @param {boolean} [throwError=true] Does the first error cause throwing of the error.
     * @returns {Record<string, AssertionError[]>} The errors found for each erroneus trait.
     * @throws {AssertionError} The fail on first was true, and there was an invalid trait.
     */
    checkTraits(throwError = true) {
        const errors = checkSubGroup("trait", this.traits, undefined, (trait) => (trait.name), undefined, throwError);
        return errors;
    }

    /**
     * Check sub group validity.
     * @template Type The type of the sub group elements.
     * @template Identity THe identity type of the values.
     * @param {string} subGroupName The name of the sub group used for generating the
     * error message.
     * @param {Array<Type>} subGroupMembers 
     * @param {Type} newMember 
     * @param {{(value: Type)=>Identity}} identitiyFn The function determining the identity of the value.
     * @param {(a: Identity, b: Identity) => boolean} identityEqualityFn The function determining the equality of
     * the identities.
     * @param {boolean} [throwError=true] Does the first error cause throwing of the error.
     * @returns {Record<string, AssertionError>} The errors of the check.
     * @throws {AssertionError} The caller wants fail on first, and there was an error.
     */
    static checkSubGroup(subGroupName, subGroupMembers, newMember = undefined, identityFn, identityEqualityFn, throwError = true) {
        const result = subGroupMembers.reduce((/** @type {Record<string, AssertionError>} */ result, tested, testedIndex) => {

            const error = (() => {
                if (newMember === undefined) {
                    const index = DuneCharacter.checkDuplicity(subGroupMembers.slice(0, testedIndex), tested,
                        identityFn, identityEqualityFn, true);

                    return new AssertionError({ message: `Duplicate ${subGroupName} at ${index} and ${testedIndex}` });
                } else if (DuneCharacter.checkDuplicity([tested], newMember, identityFn, identityEqualityFn)) {
                    return new AssertionError({ message: `Duplicate ${subGroupName} at ${testedIndex}` });
                }
                return undefined;
            })();
            if (error) {
                if (throwError) {
                    // Throwing the exception.
                    throw error;
                }
                // Adding the error to the reuslt.
                if (!(tested.name in result)) {
                    result[tested.name] = [];
                }
                result[tested.name].push(error);
            }
            return result;
        }, {});
        return result;
    }

    /**
     * Test assets, and either throw an error on failure, or return the errors of the
     * erroneus assets.
     * @param {boolean} [throwError=true] Does the first error cause throwing of the error.
     * @returns {Record<string, AssertionError[]>} The errors found for each erroneus asset.
     * @throws {AssertionError} The fail on first was true, and there was an invalid asset.
     */
    checkAssets(throwError = true) {
        const errors = DuneCharacter.checkSubGroup(
            "assets",
            Object.getOwnPropertyNames(assets),
            undefined,
            (a) => (this.assets[a]),
            equalAssets,
            throwError);
        return errors;
    }


    /**
     * Test talents, and either throw an error on failure, or return the errors of the
     * erroneus talents.
     * @param {boolean} [throwError=true] Does the first error cause throwing of the error.
     * @returns {Record<string, AssertionError[]>} The errors found for each erroneus talent.
     * @throws {AssertionError} The fail on first was true, and there was an invalid talent.
     */
    checkTalents(throwError = true) {
        const errors = DuneCharacter.checkSubGroup(
            "talent",
            this.talents,
            undefined,
            (a) => ([a.unique ?? true, a.name]),
            (id_a, id_b) => (id_a.length >= 2 && id_a.length === id_b.length
                && (!(id_a[0] || id_b[0]) || (id_a[1] === id_b[1]))),
            throwError);
        return errors;
    }


    /**
     * Normalize the internal state of the character.
     */
    normalize() {
        this.normaliseTraits();
    }


    normaliseTraits() {
        this.traits = this.traits.reduce((/** @type {Trait[]} */ result, trait) => {
            const index = findIndex(result, (member) => (member.name === trait.name));
            if (index >= 0) {
                // Combining the new trait into the old one.
                result[index].count++;
            } else {
                result.push(trait);
            }
            return result;
        }, /** @type {Trait[]} */[]);
    }
}

