/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/12/12
 * Time: 9:16 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DungeonEngine: true, js_cols: true, MonsterEngine: true */

//Responsible for interpreting the Matrix of the dungeon and returning back what the player sees, to be drawn

DungeonEngine = function (dungeonMatrix, player, currentLevel, transitionLength) {
    'use strict';
    var _dungeonMatrix = dungeonMatrix,
        _player = player,
        _currentLevel = currentLevel,
        _transitionLength = transitionLength,
        _monsterEngine = new MonsterEngine(),
        _transitionRequests = 0,
        _needMoveTransition = false,
        _needTurnLeftTransition = false,
        _needTurnRightTransition = false,
        _needTurnAroundTransition = false,
        _numberOfTurnAroundTurns = 0,
        _towardColIndex = -1,
        _towardRowIndex = -1;


    function getLevel() {
        return _dungeonMatrix[_currentLevel - 1];
    }

    function getCell(rowIndex, colIndex) {
        var level = getLevel();

        return level[rowIndex][colIndex];
    }

    function getCurrentCell() {
        var rowIndex = _player.getRowIndex(),
            colIndex = _player.getColIndex();

        return getCell(rowIndex, colIndex);
    }

    function getDirectionToRight(direction) {
        switch (direction) {
            case "north":
                return "east";
            case "east":
                return "south";
            case "south":
                return "west";
            case "west":
                return "north";
        }
    }

    function getDirectionToLeft(direction) {
        switch (direction) {
            case "north":
                return "west";
            case "west":
                return "south";
            case "south":
                return "east";
            case "east":
                return "north";
        }
    }

    function getDirectionToBehind(direction) {
        switch (direction) {
            case "north":
                return "south";
            case "east":
                return "west";
            case "south":
                return "north";
            case "west":
                return "east";
        }
    }

    function validateMove(direction) {
        var cell = getCell(_player.getRowIndex(), _player.getColIndex());
        switch (direction) {
            case "north":
                return cell.getNorth() !== "wall";
            case "south":
                return cell.getSouth() !== "wall";
            case "east":
                return cell.getEast() !== "wall";
            case "west":
                return cell.getWest() !== "wall";
        }

        return false;
    }

    function moveHelper(moveInDirection) {
        if (validateMove(moveInDirection)) {
            _player.move(moveInDirection);

            return true;
        }

        return false;
    }

    function getEquippedText(hand) {
        var equippedText = "";

        if (hand === "left") {
            equippedText = _player.displayLeftHand();
        } else {
            equippedText = _player.displayRightHand();
        }

        return equippedText;
    }

    function needTransitionHelper (needTransition) {
        var tempNeedTransition = needTransition;

        if (tempNeedTransition) {
            _transitionRequests++;

            if (_transitionRequests > _transitionLength) {
                _transitionRequests = 0;
                tempNeedTransition = false;
            }
        }

        return tempNeedTransition;
    }

    function getItemFromFloor (userInput){
        var cell = getCurrentCell();
        return cell.removeItem(userInput);
    }

    function stowItem(item) {
        if (item) {
            _player.addItemToBackPack(item);
        }
    }

    this.getActiveTorch = function () {
        return _player.getActiveTorch();
    };

    this.getTransitionPercentage = function () {
        return _transitionRequests / _transitionLength;
    };

    this.getNeedTurnTransition = function () {
        return _needTurnLeftTransition || _needTurnRightTransition || _needTurnAroundTransition;
    };

    this.turnRight = function () {
        _needTurnRightTransition = true;
        _player.setFacingDirection(getDirectionToRight(_player.getFacingDirection()));
    };

    this.getNeedTurnRightTransition = function () {
        _needTurnRightTransition = needTransitionHelper(_needTurnRightTransition);

        return _needTurnRightTransition;
    };

    this.turnLeft = function () {
        _needTurnLeftTransition = true;
        _player.setFacingDirection(getDirectionToLeft(_player.getFacingDirection()));
    };

    this.getNeedTurnLeftTransition = function () {
        _needTurnLeftTransition = needTransitionHelper(_needTurnLeftTransition);

        return _needTurnLeftTransition;
    };

    this.getNeedTurnAroundTransition = function () {
        if (_needTurnAroundTransition) {
            _transitionRequests++;

            if (_transitionRequests > _transitionLength) {
                _transitionRequests = 0;
                _numberOfTurnAroundTurns++;

                if (_numberOfTurnAroundTurns > 1) {
                    _numberOfTurnAroundTurns = 0;
                    _needTurnAroundTransition = false;
                }
            }
        }

        return _needTurnAroundTransition;
    };

    this.turnAround = function () {
        _needTurnAroundTransition = true;
        _player.setFacingDirection(getDirectionToBehind(_player.getFacingDirection()));
    };

    this.getNeedMoveTransition = function () {
        return needTransitionHelper(_needMoveTransition);
    };

    this.move = function () {
        _needMoveTransition = true;
        return moveHelper(_player.getFacingDirection());
    };

    this.moveBack = function () {
        return moveHelper(getDirectionToBehind(_player.getFacingDirection()));
    };

    this.moveLeft = function () {
        return moveHelper(getDirectionToLeft(_player.getFacingDirection()));
    };

    this.moveRight = function () {
        return moveHelper(getDirectionToRight(_player.getFacingDirection()));
    };

    this.getPlayerFacingDirection = function () {
        return _player.getFacingDirection();
    };

    this.getPlayerLeftHandText = function () {
       return getEquippedText("left");
    };

    this.getPlayerRightHandText = function () {
        return getEquippedText("right");
    };

    this.getPlayerLeftHandImage = function (foregroundColor) {
        return _player.getLeftHandImage(foregroundColor);
    };

    this.getPlayerRightHandImage = function (foregroundColor) {
        return _player.getRightHandImage(foregroundColor);
    };

    this.getPlayerRowIndex = function () {
        return _player.getRowIndex();
    };

    this.getPlayerColIndex = function () {
        return _player.getColIndex();
    };

    this.getLeftItemFromFloor = function (userInput) {
        var item = getItemFromFloor(userInput);

        if (item) {
            this.stowLeftItem();
            _player.setLeftHand(item);
        }
    };

    this.getRightItemFromFloor = function (userInput) {
        var item = getItemFromFloor(userInput);

        if (item) {
            this.stowRightItem();
            _player.setRightHand(item);
        }
    };

    this.stowLeftItem = function () {
        stowItem(_player.dropLeft());
    };

    this.stowRightItem = function () {
        stowItem(_player.dropRight());
    };

    this.pullLeftItem = function (userInput) {
        _player.pullLeftItem(userInput);
    };

    this.pullRightItem = function (userInput) {
        _player.pullRightItem(userInput);
    };

    this.dropLeft = function () {
        var cell = getCurrentCell(),
            item = _player.dropLeft();

        cell.addItem(item);
    };

    this.dropRight = function () {
        var cell = getCurrentCell(),
            item = _player.dropRight();

        cell.addItem(item);
    };

    this.getWhatThePlayerSees = function () {
        var direction = _player.getFacingDirection(),
            rowIndex = _player.getRowIndex(),
            colIndex = _player.getColIndex(),
            cellObjectItem,
            cell,
            items,
            itemIndex,
            cells = new js_cols.LinkedList();

        do {
			cell = getCell(rowIndex, colIndex);
            cells.addFirst(cell);

            switch (direction) {
                case "north":
                    rowIndex--;
					cellObjectItem = cell.getNorth();
                    break;
                case "south":
                    rowIndex++;
					cellObjectItem = cell.getSouth();
                    break;
                case "east":
                    colIndex++;
					cellObjectItem = cell.getEast();
                    break;
                case "west":
                    colIndex--;
					cellObjectItem = cell.getWest();
                    break;
            }
        } while (cellObjectItem === "open");

        return cells;
    };

    this.getCurrentLevel = function() {
        return _currentLevel;
    };

    this.climbDown = function() {
        _currentLevel++;
    };

    this.climbUp = function() {
        _currentLevel--;
    };

    this.getPlayer = function() {
        return _player;
    };

    this.moveMonsters = function() {
        if (_towardColIndex > -1 && _towardRowIndex > -1) {
            _monsterEngine.moveMonstersTowardPosition(getLevel(), _player.getRowIndex(), _player.getColIndex(), _towardRowIndex, _towardColIndex);
        } else {
            _monsterEngine.moveMonsters(getLevel(), _player.getRowIndex(), _player.getColIndex());
        }

    };

    this.setTowardPositions = function() {
        _towardColIndex = _player.getColIndex();
        _towardRowIndex = _player.getRowIndex();
    };
};