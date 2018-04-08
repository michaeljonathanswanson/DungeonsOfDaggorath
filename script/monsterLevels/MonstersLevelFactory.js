/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/6/13
 * Time: 8:52 PM
 * To change this template use File | Settings | File Templates.
 */
/*global MonsterLevelFactory: true, MonstersLevel1: true, MonstersLevel2: true, MonstersLevel3: true, MonstersLevel4: true, MonstersLevel5: true */

MonsterLevelFactory = function() {
    "use strict";
    var _level1 = new MonstersLevel1(),
        _level2 = new MonstersLevel2(),
        _level3 = new MonstersLevel3(),
        _level4 = new MonstersLevel4(),
        _level5 = new MonstersLevel5();

    this.getMonsterQueue = function(currentLevel) {
        var monsterLevel;

        switch (currentLevel) {
            case 0:
                monsterLevel = _level1;
                break;
            case 1:
                monsterLevel = _level2;
                break;
            case 2:
                monsterLevel = _level3;
                break;
            case 3:
                monsterLevel = _level4;
                break;
            case 4:
                monsterLevel = _level5;
                break;
        }

        return monsterLevel.getMonsterQueue();
    };
};