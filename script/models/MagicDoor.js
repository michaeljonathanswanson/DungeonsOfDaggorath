/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 12/12/12
 * Time: 3:27 PM
 * To change this template use File | Settings | File Templates.
 */
/*global MagicDoor: true */

MagicDoor = function() {
    'use strict';
    var _offScreenCanvas = document.createElement('canvas'),
        _offScreenCtx = _offScreenCanvas.getContext('2d'),
        _counter = 0,
        _maxCounter = 3,
        _percentOfGlow = 0.07,
        _doorHeightPercentage = 0.5 + _percentOfGlow,
        _percentOfTotalWidth = 0.2 + (_percentOfGlow * 2),
        _percentOfTotalHeight = _doorHeightPercentage + (_percentOfGlow * 3),
        _rotateAngle = Math.PI * 0.385,
        _widthAdjustment = 37,
        _width,
        _height,
        _leftX,
        _rightX,
        _bottomY = 1,
        _widthMargin = 15,
        _heightMargin = 25,
        _leftDoorRightX,
        _rightDoorSideLeftX;

    this.initialize = function(canvasWidth, canvasHeight) {
        var middleX,
            topY,
            lineWidth;

        _width = (canvasWidth * _percentOfTotalWidth);
        _height = canvasHeight * _percentOfTotalHeight;
        _offScreenCanvas.width = _width;
        _offScreenCanvas.height = _height;
        _offScreenCtx.translate(0, _height);
        _offScreenCtx.scale(1, -1);
        _widthAdjustment = (_width / 7.57) - 11.45;

        _leftX = (_width * _percentOfGlow) + _widthMargin + _maxCounter;
        middleX = _width * 0.5;
        _rightX = _width - ((_width * _percentOfGlow) + _widthMargin) + _maxCounter;
        topY = canvasHeight * _doorHeightPercentage;

        lineWidth = Math.sqrt(Math.pow(middleX - _leftX, 2) + Math.pow(topY - _bottomY, 2)) - _heightMargin;
        _leftDoorRightX = _leftX + lineWidth;
        _rightDoorSideLeftX = _rightX - lineWidth;

    };

    function incrementCounter() {
        _counter++;
        if (_counter > _maxCounter) {
            _counter = 0;
        }
    }

    function createGlowStyle(foregroundColor, backgroundColor, heightOfGlow) {
        var gradient = _offScreenCtx.createLinearGradient(_leftX, _bottomY, _leftX, _bottomY + heightOfGlow);
        gradient.addColorStop(0, foregroundColor);
        gradient.addColorStop(1, backgroundColor);

        return gradient;
    }

    this.render = function (foregroundColor, backgroundColor) {
        var heightOfGlow,
            widthOfGlow,
            topDoorAdjustment,
            bottomDoorAdjustment;

        incrementCounter();

        heightOfGlow = (_height * _percentOfGlow) + _counter;
        widthOfGlow = (_width * _percentOfGlow) + _counter;
        bottomDoorAdjustment = (heightOfGlow / 2) - 3;
        topDoorAdjustment = (4 * widthOfGlow) + (((Math.log(_width) / Math.LN10) - 2) * 2.5 * Math.sqrt(_width)) + (_counter);

        _offScreenCtx.clearRect(0, 0, _width, _height);
        _offScreenCtx.fillStyle = createGlowStyle(foregroundColor, backgroundColor, heightOfGlow);

        //left side of magic door
        _offScreenCtx.save();
        _offScreenCtx.translate(_leftX, _bottomY);
        _offScreenCtx.rotate(_rotateAngle);
        _offScreenCtx.translate(-1 * _leftX, -_bottomY);
        _offScreenCtx.beginPath();
        _offScreenCtx.moveTo(_leftX, _bottomY);
        _offScreenCtx.lineTo(_leftDoorRightX + _widthAdjustment, _bottomY);
        _offScreenCtx.lineTo(_leftDoorRightX + topDoorAdjustment, heightOfGlow);
        _offScreenCtx.lineTo(_leftX - bottomDoorAdjustment, heightOfGlow);
        _offScreenCtx.lineTo(_leftX, _bottomY);
        _offScreenCtx.fill();
        _offScreenCtx.closePath();
        _offScreenCtx.restore();

        //right side of magic door
        _offScreenCtx.save();
        _offScreenCtx.translate(_rightX, _bottomY);
        _offScreenCtx.rotate(-1 * _rotateAngle);
        _offScreenCtx.translate(-1 * _rightX, -_bottomY);
        _offScreenCtx.beginPath();
        _offScreenCtx.moveTo(_rightX, _bottomY);
        _offScreenCtx.lineTo(_rightDoorSideLeftX - _widthAdjustment, _bottomY);
        _offScreenCtx.lineTo(_rightDoorSideLeftX - topDoorAdjustment, heightOfGlow);
        _offScreenCtx.lineTo(_rightX + bottomDoorAdjustment, heightOfGlow);
        _offScreenCtx.lineTo(_rightX, _bottomY);
        _offScreenCtx.fill();
        _offScreenCtx.closePath();
        _offScreenCtx.restore();

        _offScreenCtx.restore();
        return _offScreenCanvas;
    };
};