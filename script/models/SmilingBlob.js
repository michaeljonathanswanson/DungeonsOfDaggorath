/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/1/13
 * Time: 2:33 PM
 * To change this template use File | Settings | File Templates.
 */
/*global SmilingBlob: true, SoundHelper: true */

SmilingBlob = function() {
    'use strict';
    var _offScreenCanvas = document.createElement('canvas'),
        _offScreenCtx = _offScreenCanvas.getContext('2d'),
        _counter = 0,
        _direction = 2,
        _maxCounter = 100,
        _percentSizeOfMonster = 0.4,
        _width,
        _height,
        _foregroundColor,
        _alphaLevel,
        _displayLeftHitAnimation = false,
        _displayRightHitAnimation = false,
        _isDead = false,
        _maxHitCounter = 30,
        _hitLeftCounter = 0,
        _hitRightCounter = 0,
        _deathCounter = 0,
        _maxDeathCounter = 60,
        _moveCounter = 0,
        _stopAnimation = false;

    function incrementCounter() {
        _counter += _direction;

        if (_counter > _maxCounter) {
            _direction = -3;
        }
        else if (_counter === 0) {
            _direction = 3;
        }
    }

    function modifyYValueForDeath(yValue) {
        return yValue - (yValue * (_deathCounter / _maxDeathCounter));
    }

    function createQuadraticCurve(controlX, controlY, currentX, currentY) {
        if (_isDead) {
            _offScreenCtx.quadraticCurveTo(controlX, modifyYValueForDeath(controlY), currentX, modifyYValueForDeath(currentY));
        }
        else {
            _offScreenCtx.quadraticCurveTo(controlX, controlY, currentX, currentY);
        }
    }

    function createMoveTo(startX, startY) {
        if (_isDead) {
            _offScreenCtx.moveTo(startX, modifyYValueForDeath(startY));
        }
        else {
            _offScreenCtx.moveTo(startX, startY);
        }
    }

    function drawBody() {
        var controlX,
            controlY,
            startX = _width * ((1 - _percentSizeOfMonster)) / 2,
            startY = _width * 0.01,
            currentX,
            currentY,
            pulsing = _counter / 15;

        incrementCounter();

        _offScreenCtx.save();
        _offScreenCtx.beginPath();
        _offScreenCtx.strokeStyle = "rgba(0, 255, 0, " + _alphaLevel + ")";
        _offScreenCtx.fillStyle = "rgba(34, 139, 34, " + (0.25 * _alphaLevel) + ")";
        _offScreenCtx.lineWidth = pulsing / 2;

        if (_displayRightHitAnimation) {
            startX -= ((_width * 0.05) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createMoveTo(startX, startY);

        controlX = startX;
        controlY = startY + (_height * 0.05) + pulsing;
        currentX = startX + (_width * 0.05);
        currentY = startY + (_height * 0.07);
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        currentX += _width * 0.005;
        currentY += _height * 0.07;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.01) - pulsing;
        controlY = currentY + (_height * 0.025);
        currentX += _width * 0.005;
        currentY += _height * 0.07;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX;
        controlY = currentY + (_height * 0.1) + pulsing;
        currentX += _width * 0.05;
        currentY += _height * 0.15;

        if (_displayLeftHitAnimation) {
            currentX += ((_width * 0.05) * (1 - (_hitLeftCounter / _maxHitCounter)));
            currentY -= ((_height * 0.05) * (1 - (_hitLeftCounter / _maxHitCounter)));
        }

        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.05);
        controlY = currentY + (_height * 0.075) + pulsing;
        currentX += _width * 0.05;
        currentY += _height * 0.05;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.075);
        controlY = currentY + (_height * 0.05) + pulsing;
        currentX += _width * 0.15;
        currentY -= _height * 0.1;

        if (_displayRightHitAnimation) {
            currentX -= ((_width * 0.05) * (1 - (_hitRightCounter / _maxHitCounter)));
            currentY -= ((_height * 0.05) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.05) + pulsing;
        controlY = currentY - (_height * 0.1);
        currentX += _width * 0.05;
        currentY -= _height * 0.2;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.025);
        controlY = currentY + (_height * 0.01) + pulsing;
        currentX += _width * 0.05;
        currentY -= _height * 0.05;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = currentY - (_height * 0.025) - pulsing;
        currentX -= _width * 0.075;
        currentY += _height * 0.01;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = (_height * 0.01) - pulsing;
        currentX -= _width * 0.05;
        currentY = startY;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = (_height * 0.01) - pulsing;
        currentX -= _width * 0.025;
        currentY += _height * 0.025;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = (_height * 0.01) - pulsing;
        currentX -= _width * 0.15;
        currentY += _height * 0.025;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = (_height * 0.01) - pulsing;
        currentX -= _width * 0.04;
        currentY -= _height * 0.025;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = (_height * 0.01) - pulsing;
        currentX -= _width * 0.01;
        currentY += _height * 0.02;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = startX + (_width * 0.025);
        controlY = startY + (_height * 0.01) - pulsing;
        createQuadraticCurve(controlX, controlY, startX, startY);

        _offScreenCtx.stroke();
        _offScreenCtx.fill();

        _offScreenCtx.closePath();
        _offScreenCtx.restore();
    }

    function drawLeftEye() {
        var controlX,
            controlY,
            startX = _width * ((1 - _percentSizeOfMonster)) / 2,
            startY = _height * 0.25,
            centerX,
            centerY = _height * 0.27,
            innerCenterR = 0,
            outerCenterR = _width * 0.09,
            currentX,
            currentY,
            gradient,
            pulsing = _counter / 15;

        startX += _width * 0.1;
        centerX = startX + (_width * 0.015);

        _offScreenCtx.save();
        _offScreenCtx.beginPath();
        _offScreenCtx.strokeStyle = _foregroundColor;

        gradient = _offScreenCtx.createRadialGradient(centerX, centerY, innerCenterR, centerX, centerY, outerCenterR);
        gradient.addColorStop(0, "rgba(0, " + _counter + ", 0, 0)");
        gradient.addColorStop(1, "rgba(0, 255, 0, " + _alphaLevel + ")");

        _offScreenCtx.fillStyle = gradient;

        if (_displayRightHitAnimation) {
            startX -= ((_width * 0.025) * (1 - (_hitRightCounter / _maxHitCounter)));
            startY -= ((_height * 0.025) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createMoveTo(startX, startY);

        controlX = startX;
        controlY = startY + (_height * 0.075) + pulsing;
        currentX = startX + (_width * 0.075);
        currentY = startY + (_height * 0.1);

        if (_displayLeftHitAnimation) {
            currentX += ((_width * 0.025) * (1 - (_hitLeftCounter / _maxHitCounter)));
            currentY -= ((_height * 0.025) * (1 - (_hitLeftCounter / _maxHitCounter)));
        }

        if (_displayRightHitAnimation) {
            currentX -= ((_width * 0.025) * (1 - (_hitRightCounter / _maxHitCounter)));
            currentY -= ((_height * 0.025) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.01);
        controlY = currentY - (_height * 0.05) - pulsing;
        currentX -= _width * 0.01;
        currentY -= _height * 0.075;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = startX;
        controlY = startY - (_height * 0.025) - pulsing;
        createQuadraticCurve(controlX, controlY, startX, startY);

        _offScreenCtx.stroke();
        _offScreenCtx.fill();
        _offScreenCtx.closePath();
        _offScreenCtx.restore();
    }

    function drawRightEye() {
        var controlX,
            controlY,
            startX = _width * ((1 - _percentSizeOfMonster)) / 2,
            startY = _height * 0.3,
            centerX,
            centerY = _height * 0.3,
            innerCenterR = 0,
            outerCenterR = _width * 0.075,
            currentX,
            currentY,
            gradient,
            pulsing = _counter / 15;

        startX += _width * 0.275;
        centerX = startX - (_width * 0.015);

        _offScreenCtx.save();
        _offScreenCtx.beginPath();
        _offScreenCtx.strokeStyle = _foregroundColor;

        gradient = _offScreenCtx.createRadialGradient(centerX, centerY, innerCenterR, centerX, centerY, outerCenterR);
        gradient.addColorStop(0, "rgba(0, " + (_maxCounter -  _counter) + ", 0, 0)");
        gradient.addColorStop(1, "rgba(0, 255, 0, " + _alphaLevel + ")");

        _offScreenCtx.fillStyle = gradient;

        if (_displayRightHitAnimation) {
            startX -= ((_width * 0.075) * (1 - (_hitRightCounter / _maxHitCounter)));
            startY -= ((_height * 0.025) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createMoveTo(startX, startY);

        controlX = startX;
        controlY = startY + (_height * 0.075) + pulsing;
        currentX = startX - (_width * 0.05);
        currentY = startY + (_height * 0.07);

        if (_displayLeftHitAnimation) {
            currentX += ((_width * 0.025) * (1 - (_hitLeftCounter / _maxHitCounter)));
            currentY -= ((_height * 0.025) * (1 - (_hitLeftCounter / _maxHitCounter)));
        }

        if (_displayRightHitAnimation) {
            controlX -= ((_width * 0.05) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025) - pulsing;
        controlY = currentY - (_height * 0.025);
        currentX -= _width * 0.025;
        currentY -= _height * 0.075;

        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = startX - (_width * 0.025);
        controlY = startY - (_height * 0.025) - pulsing;

        createQuadraticCurve(controlX, controlY, startX, startY);

        _offScreenCtx.stroke();
        _offScreenCtx.fill();
        _offScreenCtx.closePath();
        _offScreenCtx.restore();
    }

    function drawMouth() {
        var controlX,
            controlY,
            startX = _width * ((1 - _percentSizeOfMonster)) / 2,
            startY = _height * 0.125,
            centerX = _width * 0.5,
            centerY = _height * 0.15,
            innerCenterR = _width * 0.01,
            outerCenterR = _width * 0.5,
            currentX,
            currentY,
            gradient,
            pulsing = _counter / 15;

        startX += _width * 0.075;

        _offScreenCtx.save();
        _offScreenCtx.beginPath();
        _offScreenCtx.strokeStyle = _foregroundColor;

        gradient = _offScreenCtx.createRadialGradient(centerX, centerY, innerCenterR, centerX, centerY, outerCenterR);
        gradient.addColorStop(0, "rgba(0, " + (_counter * 2) + ", 0, 0)");
        gradient.addColorStop(1, "rgba(0, 255, 0, " + _alphaLevel + ")");

        _offScreenCtx.fillStyle = gradient;

        if (_displayRightHitAnimation) {
            startX -= ((_width * 0.05) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createMoveTo(startX, startY);

        controlX = startX + (_width * 0.15);
        controlY = startY - (_height * 0.075) - pulsing;
        currentX = startX + (_width * 0.25);
        currentY = startY + (_height * 0.075);

        if (_displayLeftHitAnimation) {
            currentX += ((_width * 0.025) * (1 - (_hitLeftCounter / _maxHitCounter)));
            currentY -= ((_height * 0.025) * (1 - (_hitLeftCounter / _maxHitCounter)));
        }

        if (_displayRightHitAnimation) {
            currentX -= ((_width * 0.075) * (1 - (_hitRightCounter / _maxHitCounter)));
            currentY -= ((_height * 0.025) * (1 - (_hitRightCounter / _maxHitCounter)));
        }

        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.05);
        controlY = currentY + (_height * 0.075) + pulsing;
        currentX -= _width * 0.13;
        currentY += _height * 0.03;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = startX + (_width * 0.075);
        controlY = startY + (_height * 0.075) + pulsing;
        createQuadraticCurve(controlX, controlY, startX, startY);

        _offScreenCtx.stroke();
        _offScreenCtx.fill();
        _offScreenCtx.closePath();
        _offScreenCtx.restore();
    }

    function drawLeftHitAnimation() {
        var controlX,
            controlY,
            startX = _width * ((1 - _percentSizeOfMonster)) / 2,
            startY = _width * 0.01,
            currentX,
            currentY;

        _offScreenCtx.save();
        _offScreenCtx.beginPath();
        _offScreenCtx.strokeStyle = "rgba(0, 255, 0, " + _alphaLevel + ")";
        _offScreenCtx.fillStyle = "rgba(34, 139, 34, " + (0.25 * _alphaLevel) + ")";

        startX += (_width * 0.05);
        startY += (_height * 0.07);

        startX += _width * 0.005;
        startY += _height * 0.07;

        startX += _width * 0.005;
        startY += _height * 0.07;

        startX += (_width * 0.05);
        startY += (_height * 0.15);

        startX -= (startX * (_hitLeftCounter / _maxHitCounter));
        startY -= (startY * Math.pow((_hitLeftCounter / _maxHitCounter), 2));

        createMoveTo(startX, startY);

        controlX = startX - (_width * 0.075);
        controlY = startY - (_height * 0.01);
        currentX = startX - _width * 0.04;
        currentY = startY + _height * 0.05;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.025);
        controlY = currentY + (_height * 0.01);
        currentX += _width * 0.025;
        currentY -= _height * 0.025;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.025);
        controlY = currentY + (_height * 0.01);
        createQuadraticCurve(controlX, controlY, startX, startY);

        _offScreenCtx.stroke();
        _offScreenCtx.fill();

        _offScreenCtx.closePath();
        _offScreenCtx.restore();
    }

    function drawRightHitAnimation() {
        var controlX,
            controlY,
            startX = _width * ((1 - _percentSizeOfMonster)) / 2,
            startY = _width * 0.01,
            currentX,
            currentY;

        _offScreenCtx.save();
        _offScreenCtx.beginPath();
        _offScreenCtx.strokeStyle = "rgba(0, 255, 0, " + _alphaLevel + ")";
        _offScreenCtx.fillStyle = "rgba(34, 139, 34, " + (0.25 * _alphaLevel) + ")";

        startX += (_width * 0.05);
        startY += (_height * 0.07);

        startX += (_width * 0.005);
        startY += (_height * 0.07);

        startX += (_width * 0.005);
        startY += (_height * 0.07);

        startX += (_width * 0.05);
        startY += (_height * 0.15);

        startX += (_width * 0.05);
        startY += (_height * 0.05);

        startX += (_width * 0.15);
        startY -= (_height * 0.1);

        startX += (((_width - startX) * 0.7) * (_hitRightCounter / _maxHitCounter));
        startY -= (startY * Math.pow((_hitRightCounter / _maxHitCounter), 2));

        createMoveTo(startX, startY);

        controlX = startX + (_width * 0.05);
        controlY = startY - (_height * 0.01);
        currentX = startX + _width * 0.03;
        currentY = startY + _height * 0.05;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX + (_width * 0.025);
        controlY = currentY + (_height * 0.025);
        currentX -= _width * 0.025;
        currentY += _height * 0.05;
        createQuadraticCurve(controlX, controlY, currentX, currentY);

        controlX = currentX - (_width * 0.025);
        controlY = currentY + (_height * 0.01);
        createQuadraticCurve(controlX, controlY, startX, startY);

        _offScreenCtx.stroke();
        _offScreenCtx.fill();

        _offScreenCtx.closePath();
        _offScreenCtx.restore();
    }

    function playSwordHitSound(playSound) {
        _displayLeftHitAnimation = true;

        if (playSound) {
            SoundHelper.prototype.play("SwordHitBlob", 0.5);
        }
    }

    this.initialize = function(foregroundColor, dimension, alphaLevel) {
        _foregroundColor = foregroundColor;
        _alphaLevel = alphaLevel;
        _width = dimension.canvasWidth;
        _height = dimension.canvasHeight;
        _offScreenCanvas.width = dimension.canvasWidth;
        _offScreenCanvas.height = dimension.canvasHeight;
        _offScreenCtx.translate(0, _height);
        _offScreenCtx.scale(1, -1);

    };

    this.render = function () {
        _offScreenCtx.clearRect(0, 0, _width, _height);
        if (!_stopAnimation) {
        drawBody();
        drawLeftEye();
        drawRightEye();
        drawMouth();

        if (_displayLeftHitAnimation) {
            drawLeftHitAnimation();
            _hitLeftCounter++;

            if (_hitLeftCounter > _maxHitCounter) {
                _hitLeftCounter = 0;
                _displayLeftHitAnimation = false;
            }
        }

        if (_displayRightHitAnimation) {
            drawRightHitAnimation();
            _hitRightCounter++;

            if (_hitRightCounter > _maxHitCounter) {
                _hitRightCounter = 0;
                _displayRightHitAnimation = false;
            }
        }

        if (_isDead) {
            _deathCounter++;

            if (_deathCounter > _maxDeathCounter) {
                _deathCounter = 0;
                _stopAnimation = true;
            }
        }
        }
        return _offScreenCanvas;
    };

    this.hitLeft = function (playSound) {
        playSwordHitSound(playSound);
    };

    this.hitRight = function (playSound) {
        playSwordHitSound(playSound);
    };

    this.killMonster = function () {
        _isDead = true;
        SoundHelper.prototype.play("BlobDeath", 0.5);
    };

    this.getHitPoints = function () {
        return 10;
    };

    this.getAttackPower = function () {
        return 10;
    };

    this.getExperience = function () {
        return 10;
    };

    this.getSpeed = function () {
        return 0.05;
    };

    this.getBlock = function () {
        return 0;
    };

    this.getParry = function () {
        return 0;
    };

    this.getArmor = function () {
        return 0;
    };

    this.getIsDeathAnimationDone = function () {
        return _stopAnimation;
    };

    this.playParry = function () {
        SoundHelper.playRandomMiss();
    };

    this.playBlock = function () {
        SoundHelper.playRandomMiss();
    };

    this.getMoveCounter = function () {
        _moveCounter++;

        return _moveCounter;
    };

    this.monsterMoved = function () {
        _moveCounter = 0;
    };
};