var assert = require('assert');
var util = require('../src/util');


describe('util', function () {

    describe('partialContains', function () {

        it('partialContains should return zero score if partial object does not exist', function () {
            assert(util.partialContains(null, null) === 0);
            assert(util.partialContains(null, undefined) === 0);
            assert(util.partialContains(undefined, null) === 0);
            assert(util.partialContains(undefined, undefined) === 0);
            assert(util.partialContains({}, undefined) === 0);
            assert(util.partialContains({}, null) === 0);
            assert(util.partialContains({ "key": "value" }, undefined) === 0);
            assert(util.partialContains({ "key": "value" }, null) === 0);
        });

        it('partialContains should return zero score if partial object is empty', function () {
            assert(util.partialContains(null, {}) === 0);
            assert(util.partialContains(undefined, {}) === 0);
            assert(util.partialContains({}, {}) === 0);
            assert(util.partialContains({ "key": "value" }, {}) === 0);
        });

        it('partialContains should return negative if partial object is not empty but full object does not exist', function () {
            assert.equal(util.partialContains(null, { "key": "value" }) , -1);
            assert.equal(util.partialContains(undefined, { "key": "value" }), -1);
        });

        it('partialContains should check if full object contains partial object for first layer', function () {
            var fullObject = {
                "param1": "value1",
                "param2": "value2"
            }

            assert.equal(util.partialContains(fullObject, { "param1": "value1" }),1);
            assert.equal(util.partialContains(fullObject, { "param2": "value2" }),1);
            assert.equal(util.partialContains(fullObject, { "param1": "value1", "param2": "value2" }), 2);

            assert.equal(util.partialContains(fullObject, { "param1": "value2" }), -1);
        });

        it('partialContains should check if full object contains partial object recursively', function () {
            var fullObject = {
                "param1": {
                    "subParam1": "subValue1",
                    "subParam2": "subValue2",
                    "subParam3": {
                        "subSubParam1": "subSubValue1",
                        "subSubParam2": "subSubValue2"
                    }
                },
                "param2": "value2"
            }

            assert.equal(util.partialContains(fullObject, { "param1": { "subParam1": "subValue1" } }), 2);
            assert.equal(util.partialContains(fullObject, { "param1": { "subParam1": "subValue1", "subParam2": "subValue2" } }), 3);
            assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "subParam3": {
                        "subSubParam1": "subSubValue1"
                    }
                }
            }) , 3);
            assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "subParam1": "subValue1",
                    "subParam2": "subValue2",
                    "subParam3": {
                        "subSubParam1": "subSubValue1",
                        "subSubParam2": "subSubValue2"
                    }
                }
            }) , 4);
           assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "subParam1": "subValue1",
                    "subParam3": {
                        "subSubParam1": "subSubValue1",
                        "subSubParam2": "subSubValue2"
                    }
                },
                "param2": "value2"
            }) , 5);
            assert.equal(util.partialContains(fullObject, { "param2": "value2" }) , 1);

            assert.equal(util.partialContains(fullObject, { "param1": "value2" }), -1);
            assert.equal(util.partialContains(fullObject, { "notExistingParam": "value2" }), -1);
            assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "notExistingParam": "value"
                }
            }) , -1);
            assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "notExistingParam": "value"
                }
            }) , -1);
            assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "subParam1": "subValue1",
                    "subParam2": "subValue2",
                    "subParam3": {
                        "notExistingParam": "value",
                        "subSubParam1": "subSubValue1",
                        "subSubParam2": "subSubValue2"
                    }
                }
            }) , -1);
            assert.equal(util.partialContains(fullObject, {
                "param1": {
                    "subParam1": "subValue1",
                    "subParam2": "subValue2",
                    "subParam3": {
                        "subSubParam1": "wrongValue",
                        "subSubParam2": "subSubValue2"
                    }
                }
            }) , -1);
        });

    });

});