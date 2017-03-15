var glob = require("glob"); //load many files and filtering with some rules at one shot
var fs = require('fs');
var _ = require('underscore');
var chokidar = require('chokidar');
var util = require("./util");
var watcher;
//requestMappings should be a map with path as a key
var requestMappings = {};

function buildMappings(mockDataConfig,updateDataRequest) {

    //config is not valid
    if (!mockDataConfig.request && !mockDataConfig.response) {
        return false;
    }

    if (!mockDataConfig.request.path) {
        return false;
    }

    var path = mockDataConfig.request.path.toLowerCase();

    setDefaults(mockDataConfig);

    if (requestMappings[path]) {
        if (!updateDataRequest){
            requestMappings[path].push(mockDataConfig);
        }
        else{
            var idx = _.findIndex(requestMappings[path],function(requestMapping,idx){
                return ((_.isMatch(requestMapping.request.query,mockDataConfig.request.query)))
            });
            if (idx!==-1){
                requestMappings[path][idx] = mockDataConfig
            }
            else{
                requestMappings[path].push(mockDataConfig);
            }
        }
    } else {
        requestMappings[path] = [mockDataConfig];
    }

}

function loadRequestMappings(folder) {
    //build up the mapping trees

    var log = console.log.bind(console);
    watcher = chokidar.watch(folder, {
        ignored: /[\/\\]\./, persistent: true
    });
    watcher
        .on('add', function (path) { log('File', path, 'has been added'); })
        .on('addDir', function (path) { log('Directory', path, 'has been added'); readFiles(folder) })
        .on('change', function (path) { log('File', path, 'has been changed'); readFiles(folder,path); })
      //  .on('unlink', function (path) { log('File', path, 'has been removed'); })
       // .on('unlinkDir', function (path) { log('Directory', path, 'has been removed'); })
        .on('error', function (error) { log('Error happened', error); })
        .on('ready', function () { readFiles(folder) })
      //  .on('raw', function (event, path, details) { log('Raw event info:', event, path, details); })




    return requestMappings;
}

function readFiles(folder,changedFile) {
  changedFile = changedFile && changedFile.replace('\\','/');
    glob(changedFile ||(folder +   "/**/*.json"), null, function (er, files) {

        _.each(files, function (filePath) {
            util.print(filePath);
            var mockDataConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            buildMappings(mockDataConfig,changedFile);
        });

        util.print(_.size(files) + " json mock data files are found and loaded successfully.");
    });

}

function setDefaults(mockDataConfig) {
    _.defaults(mockDataConfig.request, {
        "method": "GET"
    });

    _.defaults(mockDataConfig.response, {
        "status": 200
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

