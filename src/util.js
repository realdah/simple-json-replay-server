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
        return 0;
    }

    if(!fullObject) {
        return -1;
    }

    var match = 0;

    //use _.find because we want to break from the loop if anything not match.
    //_.each will not be able to break completely.
    _.find(_.keys(partialObject), function(key) {
        var value = partialObject[key];
        var fullObjectValue = fullObject[key];

        if((typeof value === "object") && (typeof fullObjectValue === "object")) {
            match = partialContains(fullObjectValue, value);
            if(match < 0) {
                return true;
            }
        } else if(fullObjectValue != value) {
            match = -1;
            return true;
        }
        match++;
    });

    return match;
}

exports.partialContains = partialContains;
exports.printVersion = printVersion;
exports.print = print;
