var glob = require("glob"); //load many files and filtering with some rules at one shot
var fs = require('fs');
var _ = require('underscore');

var util = require("./util");

//requestMappings should be a map with path as a key
var requestMappings = {};

function buildMappings( mockDataConfig ){

    //config is not valid
    if(!mockDataConfig.request && !mockDataConfig.response) {
        return false;
    }

    if(!mockDataConfig.request.path) {
        return false;
    }

    var path = mockDataConfig.request.path.toLowerCase();

    setDefaults(mockDataConfig);

    if(requestMappings[path]) {
        requestMappings[path].push(mockDataConfig);
    } else {
        requestMappings[path] = [mockDataConfig];
    }

}

function loadRequestMappings(folder) {
    //build up the mapping trees
    glob(folder + "/**/*.json", null, function (er, files) {

        var successLoaded = _.size(files);

        _.each(files, function (filePath) {
            
            try {
                var mockDataConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                mockDataConfig.filePath = filePath;
                buildMappings(mockDataConfig);
            } catch(e) {
                successLoaded--;
                util.warning(filePath + ' - failed: ' + e.message);
            }
            util.print(filePath + ' - loaded');
        });

        util.print(successLoaded + " json mock data files are found and loaded successfully.");
    });

    return requestMappings;
}

function setDefaults(mockDataConfig) {
    _.defaults(mockDataConfig.request, {
        "method" : "GET"
    });

    _.defaults(mockDataConfig.response, {
        "status" : 200
    });

    return mockDataConfig;
}

function getRequestMappings() {
    return requestMappings;
}

function reset() {
    requestMappings = {};
}

//used by unit testing
exports.reset = reset;
exports.getRequestMappings = getRequestMappings;
exports.buildMappings = buildMappings;

//used by app
exports.loadRequestMappings = loadRequestMappings;
