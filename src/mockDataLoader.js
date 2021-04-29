const glob = require("glob"); //load many files and filtering with some rules at one shot
const fs = require('fs');
const _ = require('underscore');

const util = require("./util");

//requestMappings should be a map with path as a key
let requestMappings = {};

function buildMappings( mockDataConfig ){

    //config is not valid
    if(!mockDataConfig.request && !mockDataConfig.response) {
        return false;
    }

    if(!mockDataConfig.request.path) {
        return false;
    }

    const path = mockDataConfig.request.path.toLowerCase();

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

        const successLoaded = _.size(files);

        _.each(files, function (filePath) {
            
            try {
                const mockDataConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
