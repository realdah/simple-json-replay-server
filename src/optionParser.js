const _ = require('underscore');

const MOCK_DATA_FOLDER = "app_mock";

const optionsConfig = {
    port: {
        "default" : 8008,
        "desc" : "port number used by mock replay server",
        "type" : "number"
    },
     folder: {
        "default" : MOCK_DATA_FOLDER,
        "desc" : "mock data folder, you can give relative or absolute path"
     },
     delay: {
         "default" : 0,
         "desc" : "global settings for delay a response in milliseconds, 0 means no delay, negative value means timeout",
         "type" : "number"
     }
};

function parseArguments() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log("You can use below options to start the server:  (eg. --port=8990 )");
        _.each(optionsConfig, function(value, key){
            console.log("--" + key + "    "  + value.desc);
        });
        console.log("Visit https://github.com/realdah/simple-json-replay-server for more information\n\n");
    }

    //default options
    const options = {};
    _.each(optionsConfig, function(value, key){
        return options[key] = value["default"];
    });

    _.each(args, function(arg) {
        _.each(optionsConfig, function(option, key){
            const optionName = ('--' + key + '=');
            if(arg.startsWith(optionName)) {
                if(option.type === "number") {
                    const value = Number(arg.replace(optionName, ""));
                    if(!isNaN(value)) {
                        options[key] = value;
                    } else {
                        console.log(key + " is not a valid number, use default value [" + options[key] + "]\n");
                    }
                } else {
                    options[key] = arg.replace(option, "");
                }
            }
        });
    });

    return options;
}

exports.parseArguments = parseArguments;


