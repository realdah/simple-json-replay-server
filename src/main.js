var express = require('express');
var glob = require("glob"); //load many files and filtering with some rules at one shot
var fs = require('fs');
var _ = require('underscore');

var optionsConfig = {
    "port" : {
        "default" : 8008,
        "desc" : "port number used by mock replay server"
    },
     "folder" : {
        "default" : "app_mock",
        "desc" : "mock data folder, you can give relative or absolute path"
     }
};

var app = express();

//beautify the JSON output from mock server, this will give a lot of convenient during development. (it is not a production environment, performance is lower priority)
app.set('json spaces', 4);

var options = parseArguments();

//requestMappings should be a map with url as a key
var requestMappings = {};

app.all('*', function (req, res) {
    var mockDataConfig = matchRequest(req);
    if(mockDataConfig) {
        res.header("Content-Type", "application/json").status(mockDataConfig.response.status)
        .json(mockDataConfig.response.data);

    } else {

        res.header("Content-Type", "application/json").status(404).json(
            {
                error: 'Can not find matching mock data',
                req : _.pick(req, 'path', 'method', 'query', 'cookies', 'headers')
            });
    }
});

var server = app.listen(options.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    print('Server is listening to port: %s', port);
    print('Json data folder: %s\n', options.folder);
});


//build up the mapping trees
glob(options.folder + "/**/*.json", null, function (er, files) {

    _.each(files, function (filePath) {
        print(filePath);
        var mockDataConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        buildMappings(mockDataConfig);
    });

    print(_.size(files) + " of json files found");

});

//Watching any file changes
// fs.watch(options.folder, { encoding: 'buffer' }, (eventType, filename) => {
//     if (filename)
//         print(filename);
// });



function parseArguments() {
    var MOCK_DATA_FOLDER = "app_mock";
    var args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log("You can use below options to start the server:  (eg. --port=8990 )");
        _.each(optionsConfig, function(value, key){
            console.log("--" + key + "    "  + value.desc);
        });
        console.log("Visit https://github.com/realdah/simple-json-replay-server for more information\n\n");
    }

    //default options
    var options = {};
    _.each(optionsConfig, function(value, key){
        return options[key] = value["default"];
    });

    _.each(args, function(arg) {
        _.each(optionsConfig, function(value, key){
            var option = ('--' + key + '=');
            if(arg.startsWith(option)) {
                options[key] = arg.replace(option, "");
            }
        });
    });

    return options;
}

function print(message, ...args) {
    process.stdout.write("[SJRS] ");
    if(args) {
        console.log(message, ...args);
    } else {
        console.log(message);
    }
}

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

function matchRequest(request) {
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
