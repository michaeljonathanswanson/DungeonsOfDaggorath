/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/3/13
 * Time: 10:46 PM
 * To change this template use File | Settings | File Templates.
 */
/*global PineTorch: true, Enum: true */

PineTorch = function () {
    "use strict";
    var _acceptableKeyWords = ["P T", "PINE TORCH", "PINE T", "P TORCH"];

    this.getName = function () {
        return "PINE TORCH";
    };

    this.getExperienceNeeded = function () {
        return 0;
    };

    this.getTotalLifeInMinutes = function () {
        return 15;
    };

    this.getAttackValue = function () {
        return 5;
    };

    this.getLightType = function () {
        return Enum.LIGHT_TYPE.NOT_MAGICAL;
    };

    this.getModel = function () {

    };

    this.getAcceptableKeyWords = function() {
        return _acceptableKeyWords;
    };
};
