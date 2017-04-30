var assert = require('assert');
var _ = require('underscore');
var match = require('../../src/match');
var mockDataLoader = require('../../src/mockDataLoader');

describe('match', function() {

    describe('matching header', function() {

        var config1 = {
            "request" : {
                "path": "test",
                "headers" : {
                    "header1" : "value1"
                }
            },
            "response" : {}
        };

        var config2 = {
            "request" : {
                "path": "test",
                "headers" : {
                    "header1" : "value1",
                    "header2" : "value2"
                }
            },
            "response" : {}
        };

        var config3 = {
            "request" : {
                "path": "test",
                "headers" : {
                    "header1" : "value2"
                }
            },
            "response" : {}
        };

        var requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([config1, config2, config3], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

        it('matchRequests should match header', function() {
            var request = {
                "path" : "/testQuery",
                "method" : "GET",
                "headers" : {
                    "header1" : "value1",
                    "header2" : "value3"
                }
            };

            var request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "headers" : {
                    "header1" : "value1",
                    "header2" : "value2"
                }
            };

            var request2 = {
                "path" : "/testQuery",
                "method" : "GET",
                "headers" : {
                    "header1" : "value1",
                    "header2" : "value2",
                    "header3" : "value3"
                }
            };

            var request3 = {
                "path" : "/testQuery",
                "method" : "GET",
                "headers" : {
                    "header1" : "value2"
                }
            };

           assert.deepEqual(match.matchRequests(request, requestMappings), config1);
           assert.deepEqual(match.matchRequests(request1, requestMappings), config2);
           assert.deepEqual(match.matchRequests(request2, requestMappings), config2);
           assert.deepEqual(match.matchRequests(request3, requestMappings), config3);
        });

        it('matchRequests should not match query if any param not match', function() {
            var request = {
                "path" : "/testQuery",
                "method" : "GET",
                "headers" : {
                    "header1" : "other values",
                    "header2" : "value2"
                }
            };

            var request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "headers" : {
                    "header1" : "other values"
                }
            };
            assert.notDeepEqual(match.matchRequests(request, requestMappings), config1);
            assert.notDeepEqual(match.matchRequests(request1, requestMappings), config1);
            assert.notDeepEqual(match.matchRequests(request, requestMappings), config2);
            assert.notDeepEqual(match.matchRequests(request1, requestMappings), config2);
        });
    });
});