var chokidar = require('chokidar');
var mockDataLoader = require("./mockDataLoader");

var log = console.log;

function startWatch(folder, requestMapping) {

    var watcher = chokidar.watch(folder, {
        ignored: /[\/\\]\./, persistent: true
    });
    watcher
        .on('change', function (path) {
            console.log("Change Happened", "Initiating reload...")
            requestMapping = mockDataLoader.loadRequestMappings(folder);
        })

}
exports.startWatch = startWatch;

