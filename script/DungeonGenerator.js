/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/2/12
 * Time: 9:52 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DungeonGenerator: true, js_cols: true, Cell: true, MonsterGenerator: true */

DungeonGenerator = function () {
    'use strict';
    var _currentLevel = 0,
        _monsterGenerator;

    function create2DArray(rows, cols) {
        var arr = [rows],
            index = 0;

        for (index = 0; index < rows; index++) {
            arr[index] = [cols];
        }

        return arr;
    }

    function getRandomNumber(maxNumber) {
        return Math.floor(Math.random() * (maxNumber + 1));
    }

    function isCellObjectOpen(cellObject) {
        return cellObject === "open" || cellObject === "door" || cellObject === "magicDoor";
    }

    function doesCellObjectHaveDoor(cellObject) {
        return cellObject === "door" || cellObject === "magicDoor";
    }

    function getDoor(defaultCellObject) {
        var randomNumber,
            door = defaultCellObject;

        randomNumber = getRandomNumber(100);
        if (randomNumber < 5) {
            door = "magicDoor";
        } else if (randomNumber < 30) {
            door = "door";
        }

        return door;
    }

    function reachedBoundary(rowIndex, colIndex, rows, cols) {
        return rowIndex === rows || colIndex === cols || rowIndex === -1 || colIndex === -1;
    }

    function keepGoing(level, rowIndex, colIndex, rows, cols) {
        if (reachedBoundary(rowIndex, colIndex, rows, cols)) {
            return false;
        }

        return typeof level[rowIndex][colIndex] !== "object";
    }

    function getNumberOfCellsInDirection(rowIndex, colIndex, rows, cols, direction) {
        var distance = 0;

        switch (direction) {
            case "north":
                distance = getRandomNumber(rowIndex);
                break;
            case "south":
                distance = getRandomNumber((rows - 1) - rowIndex);
                break;
            case "east":
                distance = getRandomNumber((cols - 1) - colIndex);
                break;
            case "west":
                distance = getRandomNumber(colIndex);
                break;
        }

        return distance;
    }

    function willThereBeACellNextToThisCell(level, rowIndex, colIndex, rows, cols) {
        if (reachedBoundary(rowIndex, colIndex, rows, cols)) {
            return false;
        }

        return typeof level[rowIndex][colIndex] === "object";
    }

    function createStarterCell(rowIndex, colIndex, rows, cols) {
        var north,
            south,
            east,
            west;

        //Check to see if we are up against the boundary, if so back it a wall
        if (rowIndex === 0) {
            north = "wall";
        } else {
            north = getDoor("open");
        }

        if (rowIndex === rows - 1) {
            south = "wall";
        } else {
            south = getDoor("open");
        }

        if (colIndex === cols - 1) {
            east = "wall";
        } else {
            east = getDoor("open");
        }

        if (colIndex === 0) {
            west = "wall";
        } else {
            west = getDoor("open");
        }

//        east = "magicDoor";
//        west = "megicDoor";

        return new Cell(north, south, east, west, rowIndex, colIndex);
    }

    function buildDungeonCells(level, rowIndex, colIndex, rows, cols, direction, numberOfCells) {
        var north,
            south,
            east,
            west,
            lastRowIndex = rowIndex,
            lastColIndex = colIndex,
            cell,
            monster,
            index = 0;

        for (index = 1; index <= numberOfCells; index++) {
            north = "wall";
            south = "wall";
            east = "wall";
            west = "wall";

            //Set the new index to move in the direction of the direction passed in and check to see
            //if the new cell will be next to an existing cell, if so bail
            switch (direction) {
                case "north":
                    lastRowIndex = rowIndex - index;

                    if (willThereBeACellNextToThisCell(level, lastRowIndex, lastColIndex + 1, rows, cols) ||
                        willThereBeACellNextToThisCell(level, lastRowIndex, lastColIndex - 1, rows, cols)) {
                        return;
                    }
                    break;
                case "south":
                    lastRowIndex = rowIndex + index;

                    if (willThereBeACellNextToThisCell(level, lastRowIndex, lastColIndex + 1, rows, cols) ||
                        willThereBeACellNextToThisCell(level, lastRowIndex, lastColIndex - 1, rows, cols)) {
                        return;
                    }
                    break;
                case "east":
                    lastColIndex = colIndex + index;

                    if (willThereBeACellNextToThisCell(level, lastRowIndex + 1, lastColIndex, rows, cols) ||
                        willThereBeACellNextToThisCell(level, lastRowIndex - 1, lastColIndex, rows, cols)) {
                        return;
                    }
                    break;
                case "west":
                    lastColIndex = colIndex - index;

                    if (willThereBeACellNextToThisCell(level, lastRowIndex + 1, lastColIndex, rows, cols) ||
                        willThereBeACellNextToThisCell(level, lastRowIndex - 1, lastColIndex, rows, cols)) {
                        return;
                    }
                    break;
            }

            //If this is true we have hit a already populated cell so bail
            if (index > 0 && typeof level[lastRowIndex][lastColIndex] === "object") {
                return;
            }

            if (index === numberOfCells) {
                //The last cell we want to branch out in many directions
                level[lastRowIndex][lastColIndex] = createStarterCell(lastRowIndex, lastColIndex, rows, cols);
            } else {

                if (direction === "north" || direction === "south") {
                    north = "open";
                    south = "open";
                }

                if (direction === "east" || direction === "west") {
                    east = "open";
                    west = "open";
                }

                cell = new Cell(north, south, east, west, lastRowIndex, lastColIndex);
                if (_monsterGenerator.shouldAddMonster(lastRowIndex, lastColIndex)) {
                    monster = _monsterGenerator.getMonster();
                    cell.setMonster(monster);
                    monster.setCell(cell);
                }

                level[lastRowIndex][lastColIndex] = cell;
            }
        }

        north = level[lastRowIndex][lastColIndex].getNorth();
        south = level[lastRowIndex][lastColIndex].getSouth();
        east = level[lastRowIndex][lastColIndex].getEast();
        west = level[lastRowIndex][lastColIndex].getWest();

        if (direction !== "north" && isCellObjectOpen(north) &&
            keepGoing(level, lastRowIndex - 1, lastColIndex, rows, cols)) {
            level[lastRowIndex][lastColIndex].setNorth(north);
            numberOfCells = getNumberOfCellsInDirection(lastRowIndex, lastColIndex, rows, cols, "north");

            buildDungeonCells(level, lastRowIndex, lastColIndex, rows, cols, "north", numberOfCells);
        }

        if (direction !== "south" && isCellObjectOpen(south) &&
            keepGoing(level, lastRowIndex + 1, lastColIndex, rows, cols)) {
            level[lastRowIndex][lastColIndex].setSouth(south);
            numberOfCells = getNumberOfCellsInDirection(lastRowIndex, lastColIndex, rows, cols, "south");

            buildDungeonCells(level, lastRowIndex, lastColIndex, rows, cols, "south", numberOfCells);
        }

        if (direction !== "east" && isCellObjectOpen(east) &&
            keepGoing(level, lastRowIndex, lastColIndex + 1, rows, cols)) {
            level[lastRowIndex][lastColIndex].setEast(east);
            numberOfCells = getNumberOfCellsInDirection(lastRowIndex, lastColIndex, rows, cols, "east");

            buildDungeonCells(level, lastRowIndex, lastColIndex, rows, cols, "east", numberOfCells);
        }

        if (direction !== "west" && isCellObjectOpen(west) &&
            keepGoing(level, lastRowIndex, lastColIndex + 1, rows, cols)) {
            level[lastRowIndex][lastColIndex].setWest(west);
            numberOfCells = getNumberOfCellsInDirection(lastRowIndex, lastColIndex, rows, cols, "west");

            buildDungeonCells(level, lastRowIndex, lastColIndex, rows, cols, "west", numberOfCells);
        }
    }

    function cleanUpInvalidCellObjects(level, rows, cols) {
        var rowIndex = 0,
            colIndex = 0,
            cell,
            north,
            south,
            east,
            west;

        for (rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (colIndex = 0; colIndex < cols; colIndex++) {
                cell = level[rowIndex][colIndex];

                if (typeof cell === "object") {
                    north = cell.getNorth();
                    south = cell.getSouth();
                    east = cell.getEast();
                    west = cell.getWest();

                    if (isCellObjectOpen(north)) {
                        if (rowIndex === 0) {
                            cell.setNorth("wall");
                        } else if (typeof level[rowIndex - 1][colIndex] === "object") {
                            //Make sure both adjacent cells have matching doors
                            level[rowIndex - 1][colIndex].setSouth(north);
                        } else {
                            cell.setNorth("wall");
                            //get rid of the random array element pointing to the rows number
                            level[rowIndex - 1][colIndex] = undefined;
                        }
                    }

                    if (isCellObjectOpen(south)) {
                        if (rowIndex + 1 === rows) {
                            cell.setSouth("wall");
                        } else if (typeof level[rowIndex + 1][colIndex] === "object") {
                            //Make sure both adjacent cells have matching doors
                            level[rowIndex + 1][colIndex].setNorth(south);
                        } else {
                            cell.setSouth("wall");
                            //get rid of the random array element pointing to the rows number
                            level[rowIndex + 1][colIndex] = undefined;
                        }
                    }

                    if (isCellObjectOpen(east)) {
                        if (colIndex + 1 === cols) {
                            cell.setEast("wall");
                        } else if (typeof level[rowIndex][colIndex + 1] === "object") {
                            //Make sure both adjacent cells have matching doors
                            level[rowIndex][colIndex + 1].setWest(east);
                        } else {
                            cell.setEast("wall");
                            //get rid of the random array element pointing to the rows number
                            level[rowIndex][colIndex + 1] = undefined;
                        }
                    }

                    if (isCellObjectOpen(west)) {
                        if (colIndex === 0) {
                            cell.setWest("wall");
                        } else if (typeof level[rowIndex][colIndex - 1] === "object") {
                            //Make sure both adjacent cells have matching doors
                            level[rowIndex][colIndex - 1].setEast(west);
                        } else {
                            cell.setWest("wall");
                            //get rid of the random array element pointing to the rows number
                            level[rowIndex][colIndex - 1] = undefined;
                        }
                    }

                    north = cell.getNorth();
                    south = cell.getSouth();
                    east = cell.getEast();
                    west = cell.getWest();

                    //Have an invalid wall, instead of putting all the logic to fix it just rebuild it.
                    if (north === "wall" && south === "wall" && east === "wall" && west === "wall") {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function addToCollectionIfValid(level, rowIndex, colIndex, rows, cols, collection) {
        var cell;

        if (!reachedBoundary(rowIndex, colIndex, rows, cols)) {
            cell = level[rowIndex][colIndex];

            if (typeof cell === "object" && !cell.getIsValid()){
                if (!collection.contains(cell)){
                    collection.push(cell);
                }
            }
        }
    }

    function validatePathing(level, rows, cols, cell) {
        var north = cell.getNorth(),
            south = cell.getSouth(),
            east = cell.getEast(),
            west = cell.getWest(),
            currentCell = cell,
            keepGoing = false,
            rowIndex = 0,
            colIndex = 0,
            goBackToList = new js_cols.Stack();

        do {
            rowIndex = currentCell.getRowIndex();
            colIndex = currentCell.getColIndex();
            north = currentCell.getNorth();
            south = currentCell.getSouth();
            east = currentCell.getEast();
            west = currentCell.getWest();
            currentCell.setIsValid(true);

            if (north !== "wall") {
                addToCollectionIfValid(level, rowIndex - 1, colIndex, rows, cols, goBackToList);
            }

            if (south !== "wall") {
                addToCollectionIfValid(level, rowIndex + 1, colIndex, rows, cols, goBackToList);
            }

            if (east !== "wall") {
                addToCollectionIfValid(level, rowIndex, colIndex + 1, rows, cols, goBackToList);
            }

            if (west !== "wall") {
                addToCollectionIfValid(level, rowIndex, colIndex - 1, rows, cols, goBackToList);
            }

            if (goBackToList.isEmpty()) {
                keepGoing = false;
            } else {
                keepGoing = true;
                currentCell = goBackToList.pop();
            }
        } while(keepGoing);
    }

    function validateLevel(level, rows, cols, firstStarterCellInLevel) {
        var rowIndex = 0,
            colIndex = 0,
            currentCell;

        if (cleanUpInvalidCellObjects(level, rows, cols)) {
            validatePathing(level, rows, cols, firstStarterCellInLevel);

            for (rowIndex = 0; rowIndex < rows; rowIndex++) {
                for (colIndex = 0; colIndex < cols; colIndex++) {
                    currentCell = level[rowIndex][colIndex];

                    if (typeof currentCell === "object" && !currentCell.getIsValid()) {
                        return false;
                    }
                }
            }
            return true;
        }

        return false;
    }

    function createLevel (starterCellsInLevel, rows, cols) {
        var level = create2DArray(rows, cols),
            index = 0,
            numberOfStarterCells = starterCellsInLevel.length,
            starterCell,
            numberOfCells = 0,
            rowIndex = 0,
            colIndex = 0,
            currentCell;

        //create the starter cells first
        for (index = 0; index < numberOfStarterCells; index++) {
            starterCell = starterCellsInLevel[index];
            rowIndex = starterCell.getRowIndex();
            colIndex = starterCell.getColIndex();

            if (index === 0) {
                _monsterGenerator.setStartCoordinates(_currentLevel, rowIndex, colIndex);
            }

            currentCell = createStarterCell(rowIndex, colIndex, rows, cols);

            //TODO REMOVE USED FOR TESTING ONLY
            if (index === 0) {
                currentCell.addItem(new Sword(new ShortSword(), true));
            }

            if (starterCell.isHole()) {
                currentCell.addItem(starterCell.getCellItem());
            }

            level[rowIndex][colIndex] = currentCell;
        }

        //Now create the dungeon
        for (index = 0; index < numberOfStarterCells; index++) {
            starterCell = starterCellsInLevel[index];
            rowIndex = starterCell.getRowIndex();
            colIndex = starterCell.getColIndex();

            if (isCellObjectOpen(currentCell.getNorth())) {
                numberOfCells = getNumberOfCellsInDirection(rowIndex, colIndex, rows, cols, "north");
                buildDungeonCells(level, rowIndex, colIndex, rows, cols, "north", numberOfCells);
            }

            if (isCellObjectOpen(currentCell.getSouth())) {
                numberOfCells = getNumberOfCellsInDirection(rowIndex, colIndex, rows, cols, "south");
                buildDungeonCells(level, rowIndex, colIndex, rows, cols, "south", numberOfCells);
            }

            if (isCellObjectOpen(currentCell.getEast())) {
                numberOfCells = getNumberOfCellsInDirection(rowIndex, colIndex, rows, cols, "east");
                buildDungeonCells(level, rowIndex, colIndex, rows, cols, "east", numberOfCells);
            }

            if (isCellObjectOpen(currentCell.getWest())) {
                numberOfCells = getNumberOfCellsInDirection(rowIndex, colIndex, rows, cols, "west");
                buildDungeonCells(level, rowIndex, colIndex, rows, cols, "west", numberOfCells);
            }
        }

        starterCell = starterCellsInLevel[0];
        rowIndex = starterCell.getRowIndex();
        colIndex = starterCell.getColIndex();

        if (validateLevel(level, rows, cols, level[rowIndex][colIndex])) {
            return level;
        }

        return createLevel(starterCellsInLevel, rows, cols);
    }

    this.createDungeon = function (rows, cols, numberOfLevels, levelHoleHelper) {
        var dungeon = [numberOfLevels],
            holesInLevel = [],
            levelIndex = 0;

        _monsterGenerator = new MonsterGenerator(rows, cols);

        for (levelIndex = 0; levelIndex < numberOfLevels; levelIndex++) {
            holesInLevel = levelHoleHelper.getHolesInLevel(levelIndex + 1);
            _currentLevel = levelIndex;

            dungeon[levelIndex] = createLevel(holesInLevel, rows, cols);
        }

        return dungeon;
    };
};