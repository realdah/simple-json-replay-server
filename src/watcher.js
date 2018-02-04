var chokidar = require('chokidar');
var Rx = require('rx');
var mockDataLoader = require("./mockDataLoader");
var util = require("./util");

function startWatching(folder) {

    var dirWatcher = chokidar.watch(folder, {
        ignored: /[\/\\]\./, persistent: true
    });

    //Only reload the files until user stops changing files after 1500 milliseconds, to avoid repeat loading when saving/copying multiple files.
    var changedFiles = Rx.Observable.fromEvent(dirWatcher, 'change').debounce(function (x) { return Rx.Observable.timer(1500); });

    var subscription = changedFiles.subscribe(
        function (filename) {
            util.print("Change detected for mock data, reload...");
            mockDataLoader.reset();
            mockDataLoader.loadRequestMappings(folder);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        });
}
exports.startWatching = startWatching;

