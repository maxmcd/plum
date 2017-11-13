"use strict";
const util = require('./util')


function locForCoords(startRow, startCol, endCol, endRow) {
    return {
        start: {column: startCol, line: startRow},
        end: {column: endCol, line: endRow}
    }
}

it("isWithinLoc detects children correctly", () => {
    expect(util.isWithinLoc(
        locForCoords(0,0,5,5), locForCoords(1,0,5,4)
    )).toEqual(true)

    expect(util.isWithinLoc(
        locForCoords(0,0,0,0), locForCoords(1,0,5,4)
    )).toEqual(false)
   
    expect(util.isWithinLoc(
        locForCoords(0,2,3,0), locForCoords(0,1,4,0)
    )).toEqual(false)

   expect(util.isWithinLoc(
       locForCoords(0,1,4,0), locForCoords(0,2,3,0)
   )).toEqual(true)

   expect(util.isWithinLoc(
       locForCoords(0,1,4,1), locForCoords(0,2,3,1)
   )).toEqual(true) 
});

it("trimAndReturnParts should return correct parts", () => {
    let string = "    " + "word" + "  "
    let parts = util.trimAndReturnParts(string)
    expect(parts[1]).toEqual("word")
    expect(parts[0]).toEqual("    ")
    expect(parts[2]).toEqual("  ")


    let whitespaceString = "       "
    parts = util.trimAndReturnParts(whitespaceString)
    expect(parts).toEqual([whitespaceString])
})