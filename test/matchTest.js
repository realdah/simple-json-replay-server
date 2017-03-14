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

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([configPathGet, configSamePathGet, configSamePathPost], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

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

        var configQuery1 = {
            "request" : {
                "path": "testQuery",
                "query" : {
                    "param1" : "value1"
                }
            },
            "response" : {}
        };

        var configQuery2 = {
            "request" : {
                "path": "testQuery",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value2"
                }
            },
            "response" : {}
        };

        var configQuery3 = {
            "request" : {
                "path": "testQuery",
                "query" : {
                    "param1" : "value2"
                }
            },
            "response" : {}
        };

        var requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([configQuery1, configQuery2, configQuery3], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

        it('matchRequests should match query with match', function() {
            var request = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value3"
                }
            };

            var request1 = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value2"
                }
            };

            var request2 = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value1",
                    "param2" : "value2",
                    "param3" : "value3"
                }
            };

            var request3 = {
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
            var request = {
                "path" : "/testQuery",
                "method" : "GET",
                "query" : {
                    "param1" : "value2"
                }
            };

            var request1 = {
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
    });
});