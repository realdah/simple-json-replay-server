var _ = require('underscore');

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

//Check if a value in a deep branch of a map exists in another map object
function partialContains(fullObject, partialObject) {
    if(!partialObject || _.isEmpty(partialObject)) {
        return true;
    }

    if(!fullObject) {
        return false;
    }

    var match = true;

    _.each(partialObject, function(value, key) {
        var fullObjectValue = fullObject[key];
        if(typeof value === "object" && typeof fullObjectValue === "object") {
            match =  partialContains(fullObject[key], value);
            if(!match) {
                return;
            }
        } else if(fullObjectValue != value) {
            match = false;
            return;
        }
    });
    
    return match;
}

exports.partialContains = partialContains;
exports.printVersion = printVersion;
exports.print = print;
