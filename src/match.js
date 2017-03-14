var _ = require('underscore');

var NOT_MATCH = -999999;

function matchRequests(request, requestMappings) {
    var path = request.path.toLowerCase();
    var query = request.query || {};
    var headers = request.headers || {};
    var method = request.method;

    var matchingPaths = _.filter(_.keys(requestMappings), function(pathMapping){
        return path.indexOf(pathMapping) > -1;
    });

    var listOfMockDataConfigures = [];
    _.each(matchingPaths, function(path) {
        listOfMockDataConfigures = listOfMockDataConfigures.concat(requestMappings[path]);
    });

    if(listOfMockDataConfigures.length > 0) {
        var bestMatchConfig = null;
        var bestScore = 0;

        var listOfMockDataConfigures = _.filter(listOfMockDataConfigures, function(mockDataConfig){
             return mockDataConfig.request.method.toUpperCase() === method.toUpperCase();
        });

        _.each(listOfMockDataConfigures, function(mockDataConfig){

            var score = 0;

            //check query
            _.each(query,function(value, key){
                var configValue = mockDataConfig.request.query[key];
                if(configValue != undefined && configValue == value) {  //if key exists and match
                    score += 1000;
                } else {
                    score = NOT_MATCH;
                }
            });

            // //check headers
            // _.each(mockDataConfig.request.headers,function(value, key){
            //     if(headers[key] == value) {
            //         score += 100;
            //     } else {
            //         score = NOT_MATCH;
            //         return;
            //     }
            // });

            if(score >= bestScore) {
                bestScore = score;
                bestMatchConfig = mockDataConfig;
            }

        });

        return bestMatchConfig;

    } else {
        return null;
    }
}

exports.matchRequests = matchRequests;