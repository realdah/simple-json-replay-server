var _ = require('underscore');
var util = require('./util');

function matchRequests(request, requestMappings) {
    var path = request.path.toLowerCase();
    var query = request.query;
    var cookies = request.cookies;
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
            var trimmedMockRequestPath = mockDataConfig.request.path.toLowerCase().replace(/^\/+/g, '');
            var trimmedPath = path.toLowerCase().replace(/^\/+/g, '');       

            // Exact path scores 10
            var pathScore = trimmedMockRequestPath === trimmedPath ? 10 : 0;

            var queryScore = util.partialContains(query, mockDataConfig.request.query);

            if(queryScore < 0) {
                return;
            }

            var bodyScore = util.partialContains(body, mockDataConfig.request.body);

            if(bodyScore < 0) {
                return;
            }

            var headerScore = util.partialContains(headers, mockDataConfig.request.headers);

            if(headerScore < 0) {
                return;
            }

            var cookieScore = util.partialContains(cookies, mockDataConfig.request.cookies);

            var score = pathScore + queryScore + bodyScore + headerScore + cookieScore;

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