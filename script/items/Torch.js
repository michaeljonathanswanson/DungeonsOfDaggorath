/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/19/12
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Torch: true, Enum: true */

Torch = function (torchType) {
    "use strict";
    var _name = torchType.getName(),
        _experienceNeeded = torchType.getExperienceNeeded(),
        _totalLife = torchType.getTotalLifeInMinutes() * 60,
        _revealedLightType = torchType.getLightType(),
        _acceptableKeyWords = torchType.getAcceptableKeyWords(),
        _acceptableRevealedKeyWords = [" T", " TORCH"],
        _lifeUsed = 0,
        _isRevealed = false,
        _attackValue = torchType.getAttackValue(),
        //_lightType = Enum.LIGHT_TYPE.NOT_MAGICAL;
        _lightType = Enum.LIGHT_TYPE.VERY_MAGICAL;

    function getPercentUsed() {
        var percentUsed = _lifeUsed / _totalLife;

        if (percentUsed > 1) {
            percentUsed = 1;
        }

        return percentUsed;
    }

    this.getColorPart = function(foregroundColor, currentDistanceRatio) {
        var colorPart = (255 * currentDistanceRatio) + _lightType.value;

        if (colorPart > 255) {
            colorPart = 255;
        }

        if (foregroundColor.toLowerCase() === "black") {
            colorPart = 255 - colorPart;
        }

        return Math.round(colorPart);
    };

    this.getAlphaLevel = function(currentDistanceRatio) {
        var percentUsed = getPercentUsed(),
            alphaPart = currentDistanceRatio + (_lightType.value / 100);

        if (alphaPart > 1) {
            alphaPart = 1;
        }

        if (percentUsed > 0.9) {
            alphaPart *= (1 - ((percentUsed - 0.9) * 10));
        }

        alphaPart = Math.round(alphaPart * 100) / 100;

        return alphaPart;
    };

    this.Reveal = function (experience) {
        if (experience >= _experienceNeeded) {
            _isRevealed = true;
            _lightType = _revealedLightType;
        }
    };

    this.getItemType = function () {
        return "torch";
    };

    this.getLightType = function () {
        return _lightType;
    };

    this.getName = function () {
        var torchName = "TORCH";

        if (getPercentUsed() > 0.9) {
            torchName = "DEAD TORCH";
        } else if (_isRevealed) {
            torchName = _name;
        }

        return torchName;
    };

    //only call this every second
    this.updateTorchUsage = function() {
        _lifeUsed++;
    };

    this.getAttackValue = function() {
        return _attackValue;
    };

    this.getForegroundColor = function(foregroundColor, currentDistanceRatio) {
        var colorPart = this.getColorPart(foregroundColor, currentDistanceRatio),
            alphaPart = this.getAlphaLevel(currentDistanceRatio);

        return "rgba(" + colorPart + ", " + colorPart + ", " + colorPart + ", " + alphaPart + ")";
    };

    this.renderRightHand = function(foregroundColor) {

    };

    this.renderItemOnFloor = function(context, foregroundColor, dimension, alphaLevel) {

    };

    this.renderAttack = function() {

    };


    this.getAcceptableRevealedKeyWords = function() {
        return _acceptableRevealedKeyWords;
    };

    this.getAcceptableKeyWords = function() {
        return _acceptableKeyWords;
    };
};
