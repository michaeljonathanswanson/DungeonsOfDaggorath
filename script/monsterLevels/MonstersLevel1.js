/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/6/13
 * Time: 8:43 PM
 * To change this template use File | Settings | File Templates.
 */
/*global MonstersLevel1: true, js_cols: true, Monster: true, SmilingBlob: true, Torch: true, PineTorch: true, Sword: true, OneHandedSword: true, ShortSword: true */

MonstersLevel1 = function() {
"use strict";

    this.getMonsterQueue = function() {
        var monsterQueue = new js_cols.Queue();
        monsterQueue.enqueue(new Monster(new SmilingBlob(), new Sword(new ShortSword(), false)));
        //monsterQueue.enqueue(new Monster(new SmilingBlob(), new Sword(new ShortSword(), false)));

        return monsterQueue;
    };
};