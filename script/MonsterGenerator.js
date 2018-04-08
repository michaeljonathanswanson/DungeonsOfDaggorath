/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/3/13
 * Time: 6:53 PM
 * To change this template use File | Settings | File Templates.
 */
/*global MonsterGenerator: true, MonsterLevelFactory: true, Monster: true, Torch: true, PineTorch: true */

MonsterGenerator = function(dungeonMaxRows, dungeonMaxCols) {
  "use strict";

    var _avgMaxDistance = Math.sqrt(Math.pow(dungeonMaxRows - (dungeonMaxRows / 2), 2) + Math.pow(dungeonMaxCols - (dungeonMaxCols / 2), 2)),
        _startRowIndex,
        _startColIndex,
        _monsterLevelFactory = new MonsterLevelFactory(),
        _monsterQueue;


    this.setStartCoordinates = function(currentLevel, rowIndex, colIndex) {
        _startRowIndex = rowIndex;
        _startColIndex = colIndex;
        _monsterQueue = _monsterLevelFactory.getMonsterQueue(currentLevel);
    };

    this.shouldAddMonster = function(rowIndex, colIndex) {
        var distance,
            randomNumber;

        if (_monsterQueue.isEmpty()) {
            return false;
        }

        distance = Math.sqrt(Math.pow(rowIndex - _startRowIndex, 2) + Math.pow(colIndex - _startColIndex, 2));

        randomNumber = Math.random() * 2;

        return randomNumber < ((distance - 1) / _avgMaxDistance);
    };

    this.getMonster = function() {
        return _monsterQueue.dequeue();
    };
};