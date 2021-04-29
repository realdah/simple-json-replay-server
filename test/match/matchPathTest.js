const assert = require('assert');
const _ = require('underscore');
const match = require('../../src/match');
const mockDataLoader = require('../../src/mockDataLoader');

describe('match', function() {
    describe('matching path', function() {
        const configPathGet = {
            "request" : {
                "path": "test"
            },
            "response" : {}
        };

        const configSamePathPost = {
            "request" : {
                "path": "duplicate_path",
                "method" : "post"
            },
            "response" : {}
        };

        const configSamePathGet = {
            "request" : {
                "path": "duplicate_path",
                "method" : "get"
            },
            "response" : {}
        };

        let requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([configPathGet, configSamePathGet, configSamePathPost], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

        it('matchRequests should match path with GET method', function() {
            const request = {
                "path" : "/test",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configPathGet);
        });

        it('matchRequests should match partial path', function() {
            const request = {
                "path" : "/test123",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configPathGet);
        });

        it('matchRequests should match same path with POST method', function() {
            const request = {
                "path" : "/duplicate_path",
                "method" : "POST"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configSamePathPost);
        });

        it('matchRequests should match same path with GET method', function() {
            const request = {
                "path" : "/duplicate_path",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request, requestMappings), configSamePathGet);
        });
    });

});