/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/19/12
 * Time: 8:24 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Sword: true */

Sword = function (swordType, isRevealed) {
    "use strict";
    var _name = swordType.getName(),
        _attackValue = swordType.getAttackValue(),
        _swordModel = swordType.getModel(),
        _acceptableRevealedKeyWords = swordType.getAcceptableKeyWords(),
        _acceptableKeyWords = [" SW", " SWORD"],
        _isRevealed = isRevealed;

    this.getItemType = function () {
        return "sword";
    };

    this.reveal = function (experience) {
        if (experience >= swordType.getExperienceNeeded()) {
            _isRevealed = true;
        }
    };

    this.getName = function (experience) {
        var swordName = "SWORD";

        if (_isRevealed) {
            swordName = _name;
        }

        return swordName;
    };

    this.getAttackValue = function() {
        return _attackValue;
    };

    this.renderRightHand = function(foregroundColor) {
        return _swordModel.renderRightHand(foregroundColor);
    };

    this.renderItemOnFloor = function(context, foregroundColor, dimension, alphaLevel) {
        return _swordModel.renderItemOnFloor(context, foregroundColor, dimension, alphaLevel);
    };

    this.renderAttack = function() {
        _swordModel.renderAttack();
    };

    this.getAcceptableRevealedKeyWords = function() {
        return _acceptableRevealedKeyWords;
    };

    this.getAcceptableKeyWords = function() {
        return _acceptableKeyWords;
    };
};
