/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/5/12
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Cell: true, ItemHelper: true, js_cols: true */

Cell = function (north, south, east, west, rowIndex, colIndex) {
    'use strict';
    var _north = north,
        _south = south,
        _east = east,
        _west = west,
        _rowIndex = rowIndex,
        _colIndex = colIndex,
        _isValid = false,
        _items = new js_cols.LinkedList(),
        _monster;

    function getCellObject(direction) {
        switch (direction) {
            case "north":
                return _north;
            case "south":
                return _south;
            case "east":
                return _east;
            case "west":
                return _west;
        }
    }

    this.getRowIndex = function () {
        return _rowIndex;
    };

    this.getColIndex = function () {
        return _colIndex;
    };

    this.getIsValid = function () {
        return _isValid;
    };

    this.setIsValid = function (value) {
        _isValid = value;
    };

    this.getNorth = function () {
        return _north;
    };

    this.setNorth = function (value) {
        _north = value;
    };

    this.getSouth = function () {
        return _south;
    };

    this.setSouth = function (value) {
        _south = value;
    };

    this.getEast = function () {
        return _east;
    };

    this.setEast = function (value) {
        _east = value;
    };

    this.getWest = function () {
        return _west;
    };

    this.setWest = function (value) {
        _west = value;
    };

    this.getFront = function (playerFacing) {
        return getCellObject(playerFacing);
    };

    this.getLeft = function (playerFacing) {
        switch (playerFacing){
            case "north":
                return getCellObject("west");
            case "west":
                return getCellObject("south");
            case "south":
                return getCellObject("east");
            case "east":
                return getCellObject("north");
        }
    };

    this.getRight = function (playerFacing) {
        switch (playerFacing){
            case "north":
                return getCellObject("east");
            case "east":
                return getCellObject("south");
            case "south":
                return getCellObject("west");
            case "west":
                return getCellObject("north");
        }
    };

    this.items = function () {
        return _items;
    };

    this.addItem = function (item) {
        _items.addLast(item);
    };

    this.removeItem = function (userInput) {
        return ItemHelper.removeItem(userInput, _items);
    };

    this.setMonster = function (monster) {
        _monster = monster;
    };

    this.getMonster = function () {
        return _monster;
    };
};