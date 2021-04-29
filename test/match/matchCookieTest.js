const assert = require('assert');
const _ = require('underscore');
const match = require('../../src/match');
const mockDataLoader = require('../../src/mockDataLoader');

describe('match', function() {

    describe('matching cookie', function() {

        const config1 = {
            "request" : {
                "path": "test",
                "cookies" : {
                    "cookie1" : "value1"
                }
            },
            "response" : {}
        };

        const config2 = {
            "request" : {
                "path": "test",
                "cookies" : {
                    "cookie1" : "value1",
                    "cookie2" : "value2"
                }
            },
            "response" : {}
        };

        const config3 = {
            "request" : {
                "path": "test",
                "cookies" : {
                    "cookie1" : "value2"
                }
            },
            "response" : {}
        };

        let requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([config1, config2, config3], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

        it('matchRequests should match cookie', function() {
            const request = {
                "path" : "/testQuery",
                "method" : "GET",
                "cookies" : {
                    "cookie1" : "value1",
                    "cookie2" : "value3"
                }
            };

            const request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "cookies" : {
                    "cookie1" : "value1",
                    "cookie2" : "value2"
                }
            };

            const request2 = {
                "path" : "/testQuery",
                "method" : "GET",
                "cookies" : {
                    "cookie1" : "value1",
                    "cookie2" : "value2",
                    "cookie3" : "value3"
                }
            };

            const request3 = {
                "path" : "/testQuery",
                "method" : "GET",
                "cookies" : {
                    "cookie1" : "value2"
                }
            };

           assert.deepEqual(match.matchRequests(request, requestMappings), config1);
           assert.deepEqual(match.matchRequests(request1, requestMappings), config2);
           assert.deepEqual(match.matchRequests(request2, requestMappings), config2);
           assert.deepEqual(match.matchRequests(request3, requestMappings), config3);
        });

        it('matchRequests should not match query if any param not match', function() {
            const request = {
                "path" : "/testQuery",
                "method" : "GET",
                "cookies" : {
                    "cookie1" : "other values",
                    "cookie2" : "value2"
                }
            };

            const request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "cookies" : {
                    "cookie1" : "other values"
                }
            };
            assert.notDeepEqual(match.matchRequests(request, requestMappings), config1);
            assert.notDeepEqual(match.matchRequests(request1, requestMappings), config1);
            assert.notDeepEqual(match.matchRequests(request, requestMappings), config2);
            assert.notDeepEqual(match.matchRequests(request1, requestMappings), config2);
        });
    });
});