/**
 * Created with JetBrains WebStorm.
 * User: shannonaswanson
 * Date: 2/7/13
 * Time: 7:24 PM
 * To change this template use File | Settings | File Templates.
 */

/*global MonsterEngine: true, js_cols: true */

MonsterEngine = function () {
    "use strict";
    var _monsterQueue = new js_cols.Queue(),
        _validDirection = new js_cols.LinkedList();

    function getKey(rowIndex, colIndex) {
        return (rowIndex * 1000) + colIndex;
    }

    function getCellFromKey(level, key) {
        var rowIndex = Math.floor(key / 1000),
            colIndex = key - (rowIndex * 1000);

        return level[rowIndex][colIndex];
    }

    function findMonsters(level, cell) {
        var monster,
            north,
            south,
            east,
            west,
            keepGoing = false,
            rowIndex = 0,
            colIndex = 0,
            key = 0,
            goBackToList = new js_cols.Queue(),
            cellChecked = new js_cols.HashSet();

        do {
            rowIndex = cell.getRowIndex();
            colIndex = cell.getColIndex();
            key = getKey(rowIndex, colIndex);

            if (!cellChecked.contains(key)) {
                cellChecked.insert(key);

                monster = cell.getMonster();
                north = cell.getNorth();
                south = cell.getSouth();
                east = cell.getEast();
                west = cell.getWest();

                if (monster) {
                    _monsterQueue.enqueue(monster);
                }

                if (north !== "wall") {
                    goBackToList.enqueue(level[rowIndex - 1][colIndex]);
                }

                if (south !== "wall") {
                    goBackToList.enqueue(level[rowIndex + 1][colIndex]);
                }

                if (east !== "wall") {
                    goBackToList.enqueue(level[rowIndex][colIndex + 1]);
                }

                if (west !== "wall") {
                    goBackToList.enqueue(level[rowIndex][colIndex - 1]);
                }
            }

            if (goBackToList.isEmpty()) {
                keepGoing = false;
            } else {
                keepGoing = true;
                cell = goBackToList.dequeue();
            }
        } while(keepGoing);
    }

    function canMonsterSeePlayer(monster, level, playerRowIndex, playerColIndex) {
        var cell = monster.getCell(),
            rowIndex = cell.getRowIndex(),
            colIndex = cell.getColIndex(),
            monsterSeesPlayer = false;

        if (playerRowIndex === rowIndex && playerColIndex === colIndex) {
            monsterSeesPlayer = true;
        } else if (playerColIndex === colIndex) {
            if (rowIndex < playerRowIndex) {
                //south of player
                while (cell && cell.getNorth() === "open") {
                    rowIndex++;
                    if (rowIndex === playerRowIndex) {
                        monsterSeesPlayer = true;
                        break;
                    }

                    cell = level[rowIndex][colIndex];
                }
            } else {
                //north of player
                while (cell && cell.getSouth() === "open") {
                    rowIndex--;
                    if (rowIndex === playerRowIndex) {
                        monsterSeesPlayer = true;
                        break;
                    }

                    cell = level[rowIndex][colIndex];
                }
            }
        } else if (playerRowIndex === rowIndex) {
            if (colIndex < playerColIndex) {
                //west of player
                while (cell && cell.getEast() === "open") {
                    colIndex++;
                    if (colIndex === playerColIndex) {
                        monsterSeesPlayer = true;
                        break;
                    }

                    cell = level[rowIndex][colIndex];
                }
            } else {
                //east of player
                while (cell && cell.getWest() === "open") {
                    colIndex--;
                    if (colIndex === playerColIndex) {
                        monsterSeesPlayer = true;
                        break;
                    }

                    cell = level[rowIndex][colIndex];
                }
            }
        }

        return monsterSeesPlayer;
    }

    function moveMonsterToTheNextCell(monster, level, rowIndex, colIndex, direction, nextCell) {
        var nextMonster,
            success = false;

        if (!nextCell) {
            if (direction) {
                switch (direction) {
                    case "north":
                        nextCell = level[rowIndex - 1][colIndex];
                        break;
                    case "south":
                        nextCell = level[rowIndex + 1][colIndex];
                        break;
                    case "east":
                        nextCell = level[rowIndex][colIndex + 1];
                        break;
                    case "west":
                        nextCell = level[rowIndex][colIndex - 1];
                        break;
                }
            } else {
                direction = monster.getDirectionHeading();

                //if we get here the monster needs to turn around and go the opposite direction it came from
                if (direction) {
                    switch (direction) {
                        case "north":
                            nextCell = level[rowIndex - 1][colIndex];
                            break;
                        case "south":
                            nextCell = level[rowIndex + 1][colIndex];
                            break;
                        case "east":
                            nextCell = level[rowIndex][colIndex - 1];
                            break;
                        case "west":
                            nextCell = level[rowIndex][colIndex + 1];
                            break;
                    }
                }
            }
        }

        if (nextCell) {
            nextMonster = nextCell.getMonster();

            if (!nextMonster) {
                //Cell is not occupied my a monster
                nextCell.setMonster(monster);
                monster.setCell(nextCell);
                monster.setDirectionHeading(direction);
                level[rowIndex][colIndex].setMonster(undefined);
                success = true;
            }
        }
        return success;
    }

    function setPossibleMovesForMonster(monster) {
        var cell = monster.getCell(),
            directionHeaded = monster.getDirectionHeading();
        _validDirection.clear();

        if (cell.getNorth() !== "wall" && (!directionHeaded || directionHeaded !== "south")) {
            _validDirection.addLast("north");
        }

        if (cell.getSouth() !== "wall" && (!directionHeaded || directionHeaded !== "north")) {
            _validDirection.addLast("south");
        }

        if (cell.getEast() !== "wall" && (!directionHeaded || directionHeaded !== "west")) {
            _validDirection.addLast("east");
        }

        if (cell.getWest() !== "wall" && (!directionHeaded || directionHeaded !== "east")) {
            _validDirection.addLast("west");
        }

        if (_validDirection.isEmpty()) {
            switch (directionHeaded) {
                case "north":
                    _validDirection.addLast("south");
                    break;
                case "south":
                    _validDirection.addLast("north");
                    break;
                case "east":
                    _validDirection.addLast("west");
                    break;
                case "west":
                    _validDirection.addLast("east");
                    break;
            }
        }
    }

    function monsterSeesPlayerAndMovesTowardPlayer(monster, level, monsterRowIndex, monsterColIndex, playerRowIndex, playerColIndex) {
        if (monsterColIndex === playerColIndex) {
            if (monsterRowIndex < playerRowIndex) {
                //monster north of player
                moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, "south", undefined);
            } else {
                //monster south of player
                moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, "north", undefined);
            }
        } else {
            if (monsterColIndex < playerColIndex) {
                //monster west of player
                moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, "east", undefined);
            } else {
                //monster east of player
                moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, "west", undefined);
            }
        }

        monster.clearPathStackTowardPosition();
    }

    function moveMonsterRandomly(monster, level, monsterRowIndex, monsterColIndex) {
        var direction,
            directionArray,
            randomNumber,
            monsterMoved = false;

        setPossibleMovesForMonster(monster);

        while (!monsterMoved && !_validDirection.isEmpty()) {
            directionArray = _validDirection.toArray();
            randomNumber = Math.floor(Math.random() * _validDirection.getCount());
            direction = directionArray[randomNumber];
            monsterMoved = moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, direction, undefined);

            if (!monsterMoved) {
                _validDirection.removeIndex(randomNumber);
            }
        }

        if (!monsterMoved) {
            //lets see if the monster can turn around and move the opposite direction
            moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, undefined, undefined);
        }
    }

    function populateOpenCells(level, cell, openQueue, closedHash) {
        var rowIndex = cell.getRowIndex(),
            colIndex = cell.getColIndex(),
            key = getKey(rowIndex - 1, colIndex); //North's key

        if (cell.getNorth() !== "wall" && !closedHash.contains(key)) {
            openQueue.enqueue(level[rowIndex - 1][colIndex]);
        }

        key = getKey(rowIndex + 1, colIndex); //South's key

        if (cell.getSouth() !== "wall" && !closedHash.contains(key)) {
            openQueue.enqueue(level[rowIndex + 1][colIndex]);
        }

        key = getKey(rowIndex, colIndex + 1); //East's key

        if (cell.getEast() !== "wall" && !closedHash.contains(key)) {
            openQueue.enqueue(level[rowIndex][colIndex + 1]);
        }

        key = getKey(rowIndex, colIndex - 1); //West's key

        if (cell.getWest() !== "wall" && !closedHash.contains(key)) {
            openQueue.enqueue(level[rowIndex][colIndex - 1]);
        }
    }

    function setPathForMonster(monster, level, towardRowIndex, towardColIndex) {
        var currentCell,
            parentCell = monster.getCell(),
            towardKey = getKey(towardRowIndex, towardColIndex),
            parentKey = getKey(parentCell.getRowIndex(), parentCell.getColIndex()),
            monsterKey = parentKey,
            key,
            pathFound = false,
            tree = new js_cols.ABTreeMap(),
            openQueue = new js_cols.Queue(),
            parentQueue = new js_cols.Queue(),
            childCloseHash = new js_cols.HashSet(),
            parentCloseHash = new js_cols.HashSet(),
            returnStack = new js_cols.Stack();

        tree.insert(parentKey, parentKey);
        populateOpenCells(level, parentCell, openQueue, childCloseHash);

        do {
            while (!openQueue.isEmpty()) {
                //Populate the child nodes of a parent
                currentCell = openQueue.dequeue();
                key = getKey(currentCell.getRowIndex(), currentCell.getColIndex());

                if (key === towardKey) {
                    pathFound = true;
                    break;
                }

                //Add child to the potential parents if it hasn't already been added
                if (!parentCloseHash.contains(key)) {
                    parentCloseHash.insert(key);
                    parentQueue.enqueue(currentCell);
                }

                //Add the child to the the child hash table so it can't be added to the open queue
                childCloseHash.insert(key);

                //Add child to the tree
                tree.insert(key, parentKey);
            }
            //Get a new parent
            if (parentQueue.isEmpty()) {
                pathFound = true;
            } else if (!pathFound) {
                parentCell = parentQueue.dequeue();
                parentKey = getKey(parentCell.getRowIndex(), parentCell.getColIndex());
                populateOpenCells(level, parentCell, openQueue, childCloseHash);
            }
        } while (!pathFound);

        returnStack.push(currentCell);

        while (parentKey !== monsterKey) {
            returnStack.push(getCellFromKey(level, parentKey));
            parentKey = tree.get(parentKey);
        }

        monster.setPathStackTowardPosition(returnStack);
        monster.setTowardColIndex(towardColIndex);
        monster.setTowardRowIndex(towardRowIndex);
    }

    function moveMonsterTowardPosition(monster, level, monsterRowIndex, monsterColIndex, towardRowIndex, towardColIndex) {
        var pathStack,
            nextCell;

        if (towardRowIndex === monster.getTowardRowIndex() && towardColIndex === monster.getTowardColIndex()) {
            pathStack = monster.getPathStackTowardPosition();

            if (pathStack.isEmpty()) {
                moveMonsterRandomly(monster, level, monsterRowIndex, monsterColIndex);
            } else {
                nextCell = pathStack.peek();
                if (moveMonsterToTheNextCell(monster, level, monsterRowIndex, monsterColIndex, undefined, nextCell)) {
                    pathStack.pop();
                    monster.setPathStackTowardPosition(pathStack);
                }
            }
        } else {
            setPathForMonster(monster, level, towardRowIndex, towardColIndex);
        }
    }

    function moveMonsters(level, moveMonsterDelegate, playerRowIndex, playerColIndex, towardRowIndex, towardColIndex) {
        var monster,
            cell = level[towardRowIndex][towardColIndex],
            monsterRowIndex,
            monsterColIndex;

        findMonsters(level, cell);

        while (!_monsterQueue.isEmpty()) {
            monster = _monsterQueue.dequeue();
            if (monster.canMonsterMove()) {
                cell = monster.getCell();
                monsterRowIndex = cell.getRowIndex();
                monsterColIndex = cell.getColIndex();

                //if the monster is not already in the same cell see if it can move
                if (!(monsterRowIndex === playerRowIndex && monsterColIndex === playerColIndex)) {
                    //can the monster see the player
                    if (canMonsterSeePlayer(monster, level, playerRowIndex, playerColIndex)) {
                        monsterSeesPlayerAndMovesTowardPlayer(monster, level, monsterRowIndex, monsterColIndex, playerRowIndex, playerColIndex);
                    } else {
                        moveMonsterDelegate(monster, level, monsterRowIndex, monsterColIndex, towardRowIndex, towardColIndex);
                    }
                }
            }
        }
    }

    this.moveMonsters = function (level, playerRowIndex, playerColIndex) {
        moveMonsters(level, moveMonsterRandomly, playerRowIndex, playerColIndex, playerRowIndex, playerColIndex);
    };

    this.moveMonstersTowardPosition = function (level, playerRowIndex, playerColIndex, towardRowIndex, towardColIndex) {
        moveMonsters(level, moveMonsterTowardPosition, playerRowIndex, playerColIndex, towardRowIndex, towardColIndex);
    };
};
