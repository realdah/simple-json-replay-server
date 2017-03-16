var express = require('express');
var _ = require('underscore');

var util = require("./util");
var optionParser = require("./optionParser");
var mockDataLoader = require("./mockDataLoader");
var match = require("./match");
var watcher = require('./watcher');
var app = express();

//beautify the JSON output from mock server, this will give a lot of convenient during development. 
//it is not a production environment, performance impact is negligible.

app.set('json spaces', 4);

var options = optionParser.parseArguments();

util.printVersion();

var requestMappings = mockDataLoader.loadRequestMappings(options.folder);

app.all('*', function (req, res) {
    var mockDataConfig = match.matchRequests(req, requestMappings);

    if (mockDataConfig) {
        var delay = mockDataConfig.response.delay || options.delay;

        if(delay != 0) {
            setTimeout(function() {
                response(res, mockDataConfig);
            }, delay);
        } else {
            response(res, mockDataConfig);
        }

    } else {
        res.header("Content-Type", "application/json").status(404).json(
            {
                error: 'Can not find matching mock data',
                req: _.pick(req, 'path', 'method', 'query', 'cookies', 'headers')
            });
    }
});

var server = app.listen(options.port, function () {
    util.print('Server is listening to port: %s', server.address().port);
    util.print('Json data folder: %s\n', options.folder);
});

function response(res, mockDataConfig) {
    res.header("Content-Type", "application/json")
                .status(mockDataConfig.response.status)
                .json(mockDataConfig.response.data);
}

watcher.startWatch(options.folder,requestMappings);