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

            _.each(mockDataConfig.request.query,function(value, key){

                if(query[key] != undefined ) { //if key exists
                    if(query[key] == value) { 
                        score += 1000;
                    } else {
                        score = NOT_MATCH;
                    }
                } else {
                    score = NOT_MATCH;
                }
            });

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