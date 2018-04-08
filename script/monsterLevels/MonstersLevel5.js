/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/6/13
 * Time: 8:58 PM
 * To change this template use File | Settings | File Templates.
 */
/*global MonstersLevel5: true, js_cols: true, Monster: true, SmilingBlob: true, Torch: true, PineTorch: true */

MonstersLevel5 = function() {
    "use strict";

    this.getMonsterQueue = function() {
        var monsterQueue = new js_cols.Queue();
        monsterQueue.enqueue(new Monster(new SmilingBlob(), new Torch(new PineTorch())));
        monsterQueue.enqueue(new Monster(new SmilingBlob(), new Torch(new PineTorch())));

        return monsterQueue;
    };
};