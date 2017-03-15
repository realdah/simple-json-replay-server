var assert = require('assert');
var _ = require('underscore');
var mockDataLoader = require('../src/mockDataLoader');
var match = require('../src/match');
describe('FileLoad',function(){
   
    var config1 = {
            "request" : {
                "path": "test",
                "query":{
                     "aa" : 345
                }
            },
            "response" : {
                 "aa" : 345
            }
        };

      
        var requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            mockDataLoader.buildMappings(config1);
        });

    it('update request mapping on new value ',function(){
        var config2 = _.clone(config1);
            // changed expectation
            var changed_aa = 347
            config2.response.aa = changed_aa
            mockDataLoader.buildMappings(config2,"filename");

            requestMappings = mockDataLoader.getRequestMappings();
            assert(match.matchRequests(config1.request, requestMappings).response.aa ==changed_aa,"Changed value reflected in response")
    });
 
})
