/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/8/13
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */
/*global SoundHelper: true, createjs: true */

SoundHelper = function () {
    'use strict';

};

SoundHelper.prototype.playRandomMiss = function() {
    'use strict';
    var randomNumber = Math.floor(Math.random() * 3) + 1;
    createjs.SoundJS.play("SwordMiss" + randomNumber, createjs.SoundJS.INTERRUPT_EARLY, 0, 0, 0, 1);
};

SoundHelper.prototype.playRandomShieldHit = function() {
    'use strict';
    var randomNumber = Math.floor(Math.random() * 2) + 1;
    createjs.SoundJS.play("ShieldHit" + randomNumber, createjs.SoundJS.INTERRUPT_EARLY, 0, 0, 0, 1);
};

SoundHelper.prototype.play = function(id, volume) {
    'use strict';
    createjs.SoundJS.play(id, createjs.SoundJS.INTERRUPT_EARLY, 0, 0, 0, volume);
};