/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/17/12
 * Time: 10:31 PM
 * To change this template use File | Settings | File Templates.
 */
/*global StarterCell: true */

StarterCell = function (rowIndex, colIndex, holeLocation, starterCellType) {
    "use strict";
    var _rowIndex = rowIndex,
        _colIndex = colIndex,
        _holeLocation = holeLocation,
        _starterCellType = starterCellType;

    this.isHole = function () {
        return _holeLocation.length > 0;
    };

    this.getRowIndex = function () {
        return _rowIndex;
    };

    this.getColIndex = function () {
        return _colIndex;
    };

    this.getHoleLocation = function () {
        return _holeLocation;
    };

    this.getStarterCellType = function () {
        return _starterCellType;
    };

    this.getCellItem = function () {
        return _holeLocation + _starterCellType;
    };

    this.containsAnyCoordinates = function(rowIndex, colIndex) {
        return rowIndex === _rowIndex || colIndex === _colIndex ||
            rowIndex - 1 === _rowIndex || colIndex - 1 === _colIndex ||
            rowIndex + 1 === _rowIndex || colIndex + 1 === _colIndex;
    };
};
