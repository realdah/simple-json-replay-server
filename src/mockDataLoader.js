var glob = require("glob"); //load many files and filtering with some rules at one shot
var fs = require('fs');
var _ = require('underscore');

var util = require("./util");

//requestMappings should be a map with url as a key
var requestMappings = {};

function buildMappings( mockDataConfig ){

    //config is not valid
    if(!mockDataConfig.request && !mockDataConfig.response) {
        return false;
    }

    if(!mockDataConfig.request.url) {
        return false;
    }

    var url = mockDataConfig.request.url.toLowerCase();

    _.defaults(mockDataConfig.request, {
        "method" : "get"
    });

    _.defaults(mockDataConfig.response, {
        "status" : 200
    });

    if(requestMappings[url]) {
        requestMappings[url].push(mockDataConfig);
    } else {
        requestMappings[url] = [mockDataConfig];
    }
}

function loadRequestMappings(folder) {
    //build up the mapping trees
    glob(folder + "/**/*.json", null, function (er, files) {

        _.each(files, function (filePath) {
            util.print(filePath);
            var mockDataConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            buildMappings(mockDataConfig);
        });

        util.print(_.size(files) + " of json files found");
    });

    return requestMappings;
}

exports.loadRequestMappings = loadRequestMappings;