/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/17/13
 * Time: 8:42 PM
 * To change this template use File | Settings | File Templates.
 */
/*global OneHandedSword: true, assetManager: true */

OneHandedSword = function(blackId, whiteId) {
    'use strict';
    var _blackId = blackId,
        _whiteId = whiteId,
        _offScreenCanvas = document.createElement('canvas'),
        _offScreenCtx = _offScreenCanvas.getContext('2d'),
        _counter = 0,
        _maxCounter = 3,
        _width,
        _height,
        _rotationCounter = 0,
        _img = new Image(),
        _direction = 1,
        _strikeOffset = 0,
        _jabAmount = 0.03,
        _slashAmount = 0.01,
        _rotationAmount = 3,
        _strike = false,
        _showJab = true;

    this.initialize = function(canvasWidth, canvasHeight) {
        _width = canvasWidth;
        _height = canvasHeight;
        _offScreenCanvas.width = _width;
        _offScreenCanvas.height = _height;
    };

    function incrementCounter() {
        _counter++;
        if (_counter > _maxCounter) {
            _counter = 0;
        }
    }

    function setImage(foregroundColor) {
        if (foregroundColor === 'black') {
            _img = assetManager.getAsset(_blackId);
        } else {
            _img = assetManager.getAsset(_whiteId);
        }
    }

    function getImageInRightHand() {
        var canvasWidth,
            canvasHeight,
            dWidth,
            dHeight,
            startImgX,
            startImgY;

        canvasWidth = _img.width;
        canvasHeight = _img.height;
        dWidth = _img.width;
        dHeight = _img.height;
        startImgX = -dWidth / 2;
        startImgY = -dHeight / 2;

        _counter++;
        if (_counter % 10 === 0) {
            _counter = 0;
            _rotationCounter += _direction;
        }

        if (_rotationCounter > 1) {
            _direction = -1;
        } else if (_rotationCounter < -1) {
            _direction = 1;
        }

        if (canvasWidth > canvasHeight) {
            canvasHeight = canvasWidth;
        } else {
            canvasWidth = canvasHeight;
        }

        _offScreenCanvas.width = canvasWidth * 0.5;
        _offScreenCanvas.height = canvasHeight * 0.4;

        _offScreenCtx.save();
        _offScreenCtx.translate(canvasWidth * 0.5, canvasHeight * 0.5);

        _offScreenCtx.rotate((135 + _rotationCounter) * (Math.PI / 180));
        _offScreenCtx.drawImage(_img, startImgX, startImgY);

        return _offScreenCanvas;
    }

    function getImageInRightHandJab() {
        var offScreenCanvas = document.createElement('canvas'),
            offScreenCtx = offScreenCanvas.getContext('2d'),
            canvasWidth = _img.width,
            canvasHeight = _img.height,
            dWidth = _img.width,
            dHeight = _img.height,
            startImgX = -dWidth * 0.5,
            startImgY;

        startImgY = -dHeight * (0.5 - _strikeOffset);

        _strikeOffset += _jabAmount;

        if (_strikeOffset > 0.2) {
            _jabAmount = -0.01;
        } else if (_jabAmount < 0 && _strikeOffset < 0) {
            //Done with the animation
            _strikeOffset = 0;
            _jabAmount = 0.03;
            _strike = false;
        }

        if (canvasWidth > canvasHeight) {
            canvasHeight = canvasWidth;
        } else {
            canvasWidth = canvasHeight;
        }

        offScreenCanvas.width = canvasWidth * 0.5;
        offScreenCanvas.height = canvasHeight * 0.8;

        offScreenCtx.save();
        offScreenCtx.translate(canvasWidth * 0.5, canvasHeight * 0.9);

        offScreenCtx.rotate((135 + _rotationCounter) * (Math.PI / 180));
        offScreenCtx.drawImage(_img, startImgX, startImgY); //, _img.width, _img.height, 0, 0, dWidth, dHeight);

        return offScreenCanvas;
    }

    function getImageInRightHandSlash() {
        var offScreenCanvas = document.createElement('canvas'),
            offScreenCtx = offScreenCanvas.getContext('2d'),
            canvasWidth = _img.width,
            canvasHeight = _img.height,
            dWidth = _img.width,
            dHeight = _img.height,
            startImgX = -dWidth * 0.5,
            startImgY;

        startImgY = -dHeight * (0.5 - _strikeOffset);
        _rotationCounter += _rotationAmount;

        if (_rotationCounter > 39) {
            _rotationAmount = -3;
        } else if (_rotationCounter < 0) {
            _rotationAmount = 0;
            _slashAmount = -0.03;
        }

        if (_rotationAmount <= 0) {
            _strikeOffset += _slashAmount;
            if (_slashAmount < 0 && _strikeOffset < 0) {
                //Done with the Animation
                _strikeOffset = 0;
                _slashAmount = 0.01;
                _strike = false;
                _rotationAmount = 3;
            }
        }

        if (canvasWidth > canvasHeight) {
            canvasHeight = canvasWidth;
        } else {
            canvasWidth = canvasHeight;
        }

        offScreenCanvas.width = canvasWidth * 0.5;
        offScreenCanvas.height = canvasHeight * 0.8;

        offScreenCtx.save();
        offScreenCtx.translate(canvasWidth * 0.5, canvasHeight * 0.9);

        offScreenCtx.rotate((135 + _rotationCounter) * (Math.PI / 180));
        offScreenCtx.drawImage(_img, startImgX, startImgY); //, _img.width, _img.height, 0, 0, dWidth, dHeight);

        return offScreenCanvas;
    }

    this.renderRightHand = function(foregroundColor) {
        var img;

        setImage(foregroundColor);

        if (_strike) {
            if (_showJab) {
                img = getImageInRightHandJab();
            } else {
                img = getImageInRightHandSlash();
            }

        } else {
            img = getImageInRightHand();
        }

        return img;
    };

    this.renderItemOnFloor = function(context, foregroundColor, dimension, alphaLevel) {
        var scale = 0.5 * dimension.distanceRatio,
            x = dimension.widthMargin,
            y = dimension.canvasHeight - dimension.heightMargin;

        setImage(foregroundColor);
        context.save();
        context.globalAlpha = alphaLevel;
        context.translate(x, y);
        context.rotate(55 * (Math.PI / 180));
        context.translate(-x, -y);
        context.drawImage(_img, 0, 0, _img.width, _img.height,
            x, y, _img.width * scale, _img.height * scale);
        context.restore();

    };

    this.renderAttack = function() {
        _strike = true;
        _showJab = Math.random() > 0.5;
    };

};