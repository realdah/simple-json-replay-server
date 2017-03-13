var assert = require('assert');
var _ = require('underscore');
var match = require('../src/match');
var mockDataLoader = require('../src/mockDataLoader');

describe('match', function() {
    describe('matching path', function() {
        var configPathGet = {
            "request" : {
                "path": "test"
            },
            "response" : {}
        };

        var configSamePathPost = {
            "request" : {
                "path": "duplicate_path",
                "method" : "post"
            },
            "response" : {}
        };

        var configSamePathGet = {
            "request" : {
                "path": "duplicate_path",
                "method" : "get"
            },
            "response" : {}
        };

        var requestMappings;

        _.each([configPathGet, configSamePathGet, configSamePathPost], function(config){
            requestMappings = mockDataLoader.buildMappings(config);
        })

        it('matchRequests should match path with GET method', function() {
            var request = {
                "path" : "/test",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configPathGet);
        });

        it('matchRequests should match partial path', function() {
            var request = {
                "path" : "/test123",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configPathGet);
        });

        it('matchRequests should match same path with POST method', function() {
            var request = {
                "path" : "/duplicate_path",
                "method" : "POST"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configSamePathPost);
        });

        it('matchRequests should match same path with GET method', function() {
            var request = {
                "path" : "/duplicate_path",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configSamePathGet);
        });
    });


    describe('matching query', function() {
        it('matchRequests should match query', function() {
            var request = {
                "path" : "/test"
            };
           // assert.deepEqual(match.matchRequests(request, requestMappings), config1);
        });
    });
});