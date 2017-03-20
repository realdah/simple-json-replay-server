var assert = require('assert');
var util = require('../src/util');


describe('util', function () {

    describe('partialContains', function () {

        it('partialContains should return true if partial object does not exist', function () {
            assert(util.partialContains(null, null) === true);
            assert(util.partialContains(null, undefined) === true);
            assert(util.partialContains(undefined, null) === true);
            assert(util.partialContains(undefined, undefined) === true);
            assert(util.partialContains({}, undefined) === true);
            assert(util.partialContains({}, null) === true);
            assert(util.partialContains({ "key": "value" }, undefined) === true);
            assert(util.partialContains({ "key": "value" }, null) === true);
        });

        it('partialContains should return true if partial object is empty', function () {
            assert(util.partialContains(null, {}) === true);
            assert(util.partialContains(undefined, {}) === true);
            assert(util.partialContains({}, {}) === true);
            assert(util.partialContains({ "key": "value" }, {}) === true);
        });

        it('partialContains should return false if partial object is not empty but full object does not exist', function () {
            assert(util.partialContains(null, { "key": "value" }) === false);
            assert(util.partialContains(undefined, { "key": "value" }) === false);
        });

        it('partialContains should check if full object contains partial object for first layer', function () {
            var fullObject = {
                "param1": "value1",
                "param2": "value2"
            }

            assert(util.partialContains(fullObject, { "param1": "value1" }) === true);
            assert(util.partialContains(fullObject, { "param2": "value2" }) === true);
            assert(util.partialContains(fullObject, { "param1": "value1", "param2": "value2" }) === true);

            assert(util.partialContains(fullObject, { "param1": "value2" }) === false);
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

            assert(util.partialContains(fullObject, { "param1": { "subParam1": "subValue1" } }) === true);
            assert(util.partialContains(fullObject, { "param1": { "subParam1": "subValue1", "subParam2": "subValue2" } }) === true);
            assert(util.partialContains(fullObject, {
                "param1": {
                    "subParam3": {
                        "subSubParam1": "subSubValue1"
                    }
                }
            }) === true);
            assert(util.partialContains(fullObject, {
                "param1": {
                    "subParam1": "subValue1",
                    "subParam2": "subValue2",
                    "subParam3": {
                        "subSubParam1": "subSubValue1",
                        "subSubParam2": "subSubValue2"
                    }
                }
            }) === true);
            assert(util.partialContains(fullObject, { "param2": "value2" }) === true);

            assert(util.partialContains(fullObject, { "param1": "value2" }) === false);
            assert(util.partialContains(fullObject, { "notExistingParam": "value2" }) === false);
            assert(util.partialContains(fullObject, {
                "param1": {
                    "notExistingParam": "value"
                }
            }) === false);
        });

    });

});