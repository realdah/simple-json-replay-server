function print(message, option) {
    process.stdout.write("[SJRS] ");
    if(option) {
        console.log(message, option);
    } else {
        console.log(message);
    }
}

function printVersion() {
    var pjson = require('../package.json');
    console.log("version: " + pjson.version);
}

exports.printVersion = printVersion;
exports.print = print;
