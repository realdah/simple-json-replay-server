function print(message, ...args) {
    process.stdout.write("[SJRS] ");
    if(args) {
        console.log(message, ...args);
    } else {
        console.log(message);
    }
}

exports.print = print;
