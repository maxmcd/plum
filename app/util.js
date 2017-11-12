module.exports = {
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
            loc.start.column > item.start.column) {
            // loc and item start on the same column but loc's start column
            // is after item's start column
            return false
        }
        if (
            loc.end.line == item.end.line && 
            loc.end.column < item.end.column) {
            // loc and item end on the same column but loc's end column
            // is before item's end column
            return false
        }
        return true
    }
};
