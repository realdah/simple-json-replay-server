var express = require('express');
var glob = require("glob"); //load many files and filtering with some rules at one shot
var fs = require('fs');
var _ = require('underscore');

var app = express();

app.set('json spaces', 4);

var options = parseArguments();

//requestMappings should be a map with url as a key
var requestMappings = {};

app.all('*', function (req, res) {
    
    res.header("Content-Type", "application/json").status(404).json(
        {
            error: 'Can not find matching mock data',
            req : _.pick(req, 'method', 'hostname', 'baseUrl', 'headers' , 'params', 'cookies')
        });
});

var server = app.listen(options.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    print('Server is listening to port: %s', port);
    print('Json data folder: %s\n', options.mockDataFolder);
});



glob(options.mockDataFolder + "/**/*.json", null, function (er, files) {

    _.each(files, function (filePath) {
        print(filePath);
        var jsonObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    });

    print(_.size(files) + " of json files found");

});

//Watching any file changes
fs.watch(options.mockDataFolder, { encoding: 'buffer' }, (eventType, filename) => {
    if (filename)
        print(filename);
});

function parseArguments() {
    var MOCK_DATA_FOLDER = "app_mock";
    var args = process.argv.slice(2);

    if (args.length === 0) {
        print("Type --help to get more information.\n\n");
    }


    return {
        mockDataFolder: MOCK_DATA_FOLDER,
        port: 8008
    }
}


function print(message, ...args) {
    process.stdout.write("[Simple Json Replay Server] ");
    if(args) {
        console.log(message, ...args);
    } else {
        console.log(message);
    }
}