var chokidar = require('chokidar');
var mockDataLoader = require("./mockDataLoader");
var util = require("./util");

var log = console.log;

function startWatching(folder) {

    var watcher = chokidar.watch(folder, {
        ignored: /[\/\\]\./, persistent: true
    });

    watcher.on('change', function (path) {
            util.print("Change detected for mock data, reload...");
            mockDataLoader.reset();
            mockDataLoader.loadRequestMappings(folder);
        })

}
exports.startWatching = startWatching;

