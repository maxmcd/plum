const recast = require("recast");

function timeIt(call, name, threshold) {
    let start = Date.now();
    let out = call();
    let end = Date.now();
    let ms = end - start;
    if (ms > threshold) {
        console.log(`${name} took ${ms} ms. Longer than expected.`);
    }
    return out;
}

module.exports = {
    timeIt: timeIt,
    keys(obj) {
        let out = [];
        for (var key in obj) {
            out.push(key);
        }
        console.log(out);
    },
    parse(program) {
        return timeIt(
            () => {
                return recast.parse(program);
            },
            "AST Parse",
            10
        );
    },
    printAst(ast) {
        return timeIt(
            () => {
                return recast.print(ast).code;
            },
            "AST Print",
            10
        );
    },
    isWithinLoc(loc, item) {
        if (loc.start.line > item.start.line) {
            // loc starts after item
            return false;
        }
        if (loc.end.line < item.end.line) {
            // loc ends before item
            return false;
        }
        if (loc.start.line < item.start.line && loc.end.line > item.end.line) {
            // loc rows encompass item
            return true;
        }
        if (
            loc.start.line == item.start.line &&
            loc.start.column > item.start.column
        ) {
            // loc and item start on the same column but loc's start column
            // is after item's start column
            return false;
        }
        if (loc.end.line == item.end.line && loc.end.column < item.end.column) {
            // loc and item end on the same column but loc's end column
            // is before item's end column
            return false;
        }
        return true;
    },
    trimAndReturnParts(string) {
        // https://jsperf.com/trim-performance-test
        let stringTrimLeft = /^[\s\u00A0]+/;
        let stringTrimRight = /[\s\u00A0]+$/;
        let leftTrimmed = string.replace(stringTrimLeft, "");
        let leftLength = string.length - leftTrimmed.length;
        let trimmed = leftTrimmed.replace(stringTrimRight, "");
        if (trimmed.length === 0) {
            return [string];
        }
        let rightLength = string.length - (leftLength + trimmed.length);
        let left = string.substring(0, leftLength);
        let right = string.substring(
            leftLength + trimmed.length,
            string.length
        );
        let out = [];
        if (left.length !== 0) {
            out.push(left);
        }
        out.push(trimmed);
        if (right.length !== 0) {
            out.push(right);
        }
        return out;
    }
};
