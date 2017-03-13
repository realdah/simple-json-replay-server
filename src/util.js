function print(message, option) {
    process.stdout.write("[SJRS] ");
    if(option) {
        console.log(message, option);
    } else {
        console.log(message);
    }
}

exports.print = print;
