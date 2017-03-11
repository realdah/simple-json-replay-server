var _ = require('underscore');

function matchRequests(request, requestMappings) {
    var path = request.path.toLowerCase();
    var params = request.query;
    var method = request.method;

    var matchingURLs = _.filter(_.keys(requestMappings), function(url){
        return path.indexOf(url) > -1;
    });

    var listOfMockDataConfigures = [];
    _.each(matchingURLs, function(url) {
        listOfMockDataConfigures = listOfMockDataConfigures.concat(requestMappings[url]);
    });

    if(listOfMockDataConfigures.length > 0) {
        var bestMatchConfig = null;
        var bestScore = 0;

        var listOfMockDataConfigures = _.filter(listOfMockDataConfigures, function(mockDataConfig){
             return mockDataConfig.request.method.toUpperCase() === method;
        });

        _.each(listOfMockDataConfigures, function(mockDataConfig){

            var score = 0;

            //check params
            _.each(mockDataConfig.request.params,function(value, key){
                if(params[key] == value) {
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