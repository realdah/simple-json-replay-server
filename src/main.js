var express = require('express');
var _ = require('underscore');
var path = require('path');

var util = require("./util");
var optionParser = require("./optionParser");
var mockDataLoader = require("./mockDataLoader");
var match = require("./match");
var watcher = require('./watcher');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')


var app = express();
app.use(cookieParser())

//beautify the JSON output from mock server, this will give a lot of convenient during development. 
//it is not a production environment, performance impact is negligible.
app.set('json spaces', 4);

initialBodyParsers(app);

var options = optionParser.parseArguments();

util.printVersion();

mockDataLoader.loadRequestMappings(options.folder);

app.all('*', function (req, res) {
    var requestMappings = mockDataLoader.getRequestMappings();

    var mockDataConfig = match.matchRequests(req, requestMappings);

    if (mockDataConfig) {
        var delay = mockDataConfig.response.delay || options.delay;

        if (delay != 0) {
            setTimeout(function () {
                response(res, mockDataConfig);
            }, delay);
        } else {
            response(res, mockDataConfig);
        }

    } else {
        res.header("Content-Type", "application/json").status(404).json(
            {
                error: 'Can not find matching mock data',
                req: _.pick(req, 'path', 'method', 'query', 'body', 'headers')
            });
    }
});

var server = app.listen(options.port, function () {
    util.print('Server is listening to port: %s', server.address().port);
    util.print('Json data folder: %s\n', options.folder);
});

//start watching the changes.
watcher.startWatching(options.folder);

//it says there might be potential cross site scripting attack if we declare global body parsers for all requests.
//However, since the mock server is really nothing but a replay with hardcoded data, this is not a concern for us.
function initialBodyParsers(app) {
    // parse application/json
    app.use(bodyParser.json());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
}

function response(res, mockDataConfig) {

    if (mockDataConfig.response.data) { //json data
        res.header("Content-Type", "application/json")
            .status(mockDataConfig.response.status)
            .json(mockDataConfig.response.data);
    } else if (mockDataConfig.response.html) {
        res.header("Content-Type", "text/html")
            .status(mockDataConfig.response.status)
            .send(mockDataConfig.response.html);
    } else if (mockDataConfig.response.file) {
        const config = mockDataConfig.response.file;

        const filePath = path.dirname(mockDataConfig.filePath) + path.sep + config.path;
        const downloadFilename = config.downloadFilename || path.basename(config.path);
        res.download(filePath, downloadFilename, function (err) {
            if (err) {
                res.header("Content-Type", "application/json").status(404).json(
                    {
                        error: 'Can not find any download file - [' + filePath + '], please check your mock data configuration file - [' + mockDataConfig.filePath + '], your download file path should be relative to your mock configuration file.'
                    });
            }
        });
    } else if (mockDataConfig.response.status === 302 && mockDataConfig.response.location) {
        res.header("location", mockDataConfig.response.location)
            .status(mockDataConfig.response.status)
            .send();
    } else {
        res.header("Content-Type", "application/json").status(404).json(
            {
                warning: 'You forget to configure the response type in ' + mockDataConfig.filePath + ', please refer document - https://github.com/realdah/simple-json-replay-server.'
            });
    }
}

