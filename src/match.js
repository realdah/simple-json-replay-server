var _ = require('underscore');

function matchRequests(request, requestMappings) {
    var path = request.path.toLowerCase();
    var query = request.query || {};
    var method = request.method;

    var matchingPaths = _.filter(_.keys(requestMappings), function(path){
        return path.indexOf(path) > -1;
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
            _.each(mockDataConfig.request.query,function(value, key){
                if(query[key] == value) {
                    score += 2;
                } else {
                    score = -99999;
                    return;
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