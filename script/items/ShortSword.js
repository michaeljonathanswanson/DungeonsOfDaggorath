/**
 * Created with JetBrains WebStorm.
 * User: shannonaswanson
 * Date: 2/4/13
 * Time: 7:37 PM
 * To change this template use File | Settings | File Templates.
 */
/*global ShortSword: true, OneHandedSword: true */

ShortSword = function () {
    "use strict";
    var _swordModel = new OneHandedSword("ShortSwordBlack", "ShortSwordWhite"),
        _acceptableKeyWords = ["SH SW", "SHORT SWORD", "SHORT SW", "SH SWORD"];

    this.getName = function () {
        return "SHORT SWORD";
    };

    this.getExperienceNeeded = function () {
        return 0;
    };

    this.getAttackValue = function () {
        return 50;
    };

    this.getModel = function () {
        return _swordModel;
    };

    this.getAcceptableKeyWords = function() {
        return _acceptableKeyWords;
    };
};
