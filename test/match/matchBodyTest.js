var assert = require('assert');
var _ = require('underscore');
var match = require('../../src/match');
var mockDataLoader = require('../../src/mockDataLoader');

describe('match', function() {

    describe('matching json body when post', function() {

        var configQuery1 = {
            "request" : {
                "path": "testQuery",
                "method" : "post",
                "body" : {
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

        });

    });
});