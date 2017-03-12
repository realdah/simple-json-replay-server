var assert = require('assert');
var match = require('../src/match');
var mockDataLoader = require('../src/mockDataLoader');

var config1 = mockDataLoader.setDefaults({
    "request" : {
        "path": "test"
    },
    "response" : {}
});

var requestMappings = {
    "test" : config1
};

describe('match', function() {

    it('matchRequests should match path', function() {
        var request = {
            "path" : "/test",
            "method" : "GET"
        };
        assert.deepEqual(match.matchRequests(request, requestMappings), config1);
    });
});