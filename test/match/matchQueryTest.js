const assert = require('assert');
const _ = require('underscore');
const match = require('../../src/match');
const mockDataLoader = require('../../src/mockDataLoader');

describe('match', function() {

    describe('matching query', function() {

        const configQuery1 = {
            "request" : {
                "path": "testQuery",
                "query" : {
                    "param1" : "value1"
                }
            },
            "response" : {}
        };

        const configQuery2 = {
            "request" : {
                "path": "testQuery",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value2"
                }
            },
            "response" : {}
        };

        const configQuery3 = {
            "request" : {
                "path": "testQuery",
                "query" : {
                    "param1" : "value2"
                }
            },
            "response" : {}
        };

        const configQuery4 = {
            "request" : {
                "path": "defaultQueryTest"
            },
            "response" : {}
        };

        const configQuery5 = {
            "request" : {
                "path": "defaultQuery"
            },
            "response" : {}
        };

        let requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([configQuery1, configQuery2, configQuery3, configQuery4, configQuery5], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

        it('matchRequests should match query', function() {
            const request = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value3"
                }
            };

            const request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value2"
                }
            };

            const request2 = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value2",
                    "param3" : "value3"
                }
            };

            const request3 = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value2"
                }
            };

           assert.deepEqual(match.matchRequests(request, requestMappings), configQuery1);
           assert.deepEqual(match.matchRequests(request1, requestMappings), configQuery2);
           assert.deepEqual(match.matchRequests(request2, requestMappings), configQuery2);
           assert.deepEqual(match.matchRequests(request3, requestMappings), configQuery3);
        });

        it('matchRequests should not match query if any param not match', function() {
            const request = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value2"
                }
            };

            const request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value2",
                    "param2" : "value3"
                }
            };
            assert.notDeepEqual(match.matchRequests(request, requestMappings), configQuery1);
            assert.notDeepEqual(match.matchRequests(request1, requestMappings), configQuery1);
            assert.notDeepEqual(match.matchRequests(request, requestMappings), configQuery2);
            assert.notDeepEqual(match.matchRequests(request1, requestMappings), configQuery2);
        });

        it('matchRequests should match exact path if it exists', function() {
            const request4 = {
                "path" : "/defaultQueryTest",
                "method" : "GET"
            };

            const request5 = {
                "path" : "/defaultQuery",
                "method" : "GET"
            };
            assert.deepEqual(match.matchRequests(request4, requestMappings), configQuery4);
            assert.deepEqual(match.matchRequests(request5, requestMappings), configQuery5);
        });
    });
});