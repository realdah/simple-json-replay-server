var _ = require('underscore');
var util = require('./util');

var NOT_MATCH = -999999;

function matchRequests(request, requestMappings) {
    var path = request.path.toLowerCase();
    var query = request.query;
    var body = request.body;
    var headers = request.headers;
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

            var queryScore = util.partialContains(query, mockDataConfig.request.query);

            if(queryScore < 0) {
                return;
            }

            var bodyScore = util.partialContains(body, mockDataConfig.request.body);

            if(bodyScore < 0) {
                return;
            }

            var headerScore = util.partialContains(headers, mockDataConfig.request.headers);

            var score = queryScore + bodyScore + headerScore;

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