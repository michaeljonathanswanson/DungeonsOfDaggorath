/**
 * Created by shannonaswanson on 4/15/14.
 */
/*global Action: true, GameSaver: true */

GameSaver = function (dungeonMatrix, player) {
    'use strict';
    var _dungeonMatrix = dungeonMatrix,
        _player = player;

    function saveGame(name, currentLevel) {
        var data = currentLevel + '|' + JSON.stringify(player) + "|",
            levelIndex;

        for (levelIndex = 0; levelIndex < _dungeonMatrix.length; levelIndex++) {
            
        }

        localStorage[name] = JSON.stringify(checkins);
    }

    this.save = function (userInput, currentLevel) {
        var name = userInput.substring(4).trim();
        if (name.length === 0) {
            name = "_empty";
        }

        saveGame(name, currentLevel);
    };


};