/**
 * Created with JetBrains WebStorm.
 * User: shannonaswanson
 * Date: 2/19/13
 * Time: 7:46 PM
 * To change this template use File | Settings | File Templates.
 */
/*global HeaterShield: true, OneHandedShield: true */

HeaterShield = function () {
    "use strict";
    var _swordModel = new OneHandedShield("HeaterShieldBlack", "HeaterShieldWhite"),
        _acceptableKeyWords = ["HE SH", "HEATER SHIELD", "HEATER SH", "HE SHIELD"];

    this.getName = function () {
        return "HEATER SHIELD";
    };

    this.getExperienceNeeded = function () {
        return 0;
    };

    this.getAttackValue = function () {
        return 25;
    };

    this.getModel = function () {
        return _swordModel;
    };

    this.getAcceptableKeyWords = function() {
        return _acceptableKeyWords;
    };
};
