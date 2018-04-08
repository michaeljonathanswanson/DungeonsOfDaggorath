/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/19/12
 * Time: 8:24 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Shield: true */

Shield = function (shieldType, isRevealed) {
    "use strict";
    var _name = shieldType.getName(),
        _attackValue = shieldType.getAttackValue(),
        _shieldModel = shieldType.getModel(),
        _acceptableRevealedKeyWords = shieldType.getAcceptableKeyWords(),
        _acceptableKeyWords = [" SH", " SHIELD"],
        _isRevealed = isRevealed;

    this.getItemType = function () {
        return "shield";
    };

    this.reveal = function (experience) {
        if (experience >= shieldType.getExperienceNeeded()) {
            _isRevealed = true;
        }
    };

    this.getName = function (experience) {
        var shieldName = "SHIELD";

        if (_isRevealed) {
            shieldName = _name;
        }

        return shieldName;
    };

    this.getAttackValue = function() {
        return _attackValue;
    };

    this.renderRightHand = function(foregroundColor) {
        return _shieldModel.renderRightHand(foregroundColor);
    };

    this.renderItemOnFloor = function(context, foregroundColor, dimension, alphaLevel) {
        return _shieldModel.renderItemOnFloor(context, foregroundColor, dimension, alphaLevel);
    };

    this.renderAttack = function() {
        _shieldModel.renderAttack();
    };

    this.getAcceptableRevealedKeyWords = function() {
        return _acceptableRevealedKeyWords;
    };

    this.getAcceptableKeyWords = function() {
        return _acceptableKeyWords;
    };
};
