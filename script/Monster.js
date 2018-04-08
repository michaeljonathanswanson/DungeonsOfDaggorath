/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/3/13
 * Time: 9:14 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Monster: true, Enum: true, js_cols: true, SoundHelper: true */

Monster = function(model, item) {
    "use strict";
    var _model = model,
        _hitPoints = model.getHitPoints(),
        _isDead = false,
        _itemsQueue = new js_cols.Queue(),
        _cell,
        _pathStackTowardPosition,
        _towardRowIndex = 0,
        _towardColIndex = 0,
        _nextTimeMonsterCanMove = 0,
        _directionHeading;

    _itemsQueue.enqueue(item);

    this.playerAttacks = function(isLeft, attackPower, playSound) {
        var playerRoll = Math.random(),
            monsterRoll,
            monsterDefense,
            outCome = Enum.AttackOutcome.HIT;

        //Does the player Crit
        if (playerRoll > 0.95) {
            outCome = Enum.AttackOutcome.CRIT;
        } else if (playerRoll < 0.05) {
            //Does the player fumble
            outCome = Enum.AttackOutcome.DODGE;
        } else {
            monsterRoll = Math.random();
            if (monsterRoll < _model.getParry()) {
                outCome = Enum.AttackOutcome.PARRY;
            } else {
                monsterRoll = Math.random();
                if (monsterRoll < _model.getBlock()) {
                    outCome = Enum.AttackOutcome.BLOCK;
                } else {
                    monsterDefense = _model.getAttackPower() * _model.getSpeed();
                    attackPower *= playerRoll;
                    if (monsterDefense > attackPower) {
                        outCome = Enum.AttackOutcome.DODGE;
                    }
                }
            }
        }

        if (outCome.value > 0) {
            if (isLeft) {
                _model.hitLeft(playSound);
            } else {
                _model.hitRight(playSound);
            }

            _hitPoints -= ((attackPower * outCome.value) * (1 - _model.getArmor()));

            if (_hitPoints <= 0) {
                _isDead = true;
                _model.killMonster();
            }
        } else if (playSound) {
            SoundHelper.prototype.playRandomMiss();
        }

        return outCome;
    };

    this.isDead = function () {
        return _isDead;
    };

    this.getExperience = function () {
        return _model.getExperience();
    };

    this.pickUpItem = function (item) {
        _itemsQueue.enqueue(item);
    };

    this.drawMonster = function (context, foregroundColor, dimension, activeTorch) {
        var offScreenCanvas,
            color = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio),
            alphaLevel = activeTorch.getAlphaLevel(dimension.distanceRatio);

        _model.initialize(color, dimension, alphaLevel);

        offScreenCanvas = _model.render();
        context.drawImage(offScreenCanvas, 0, 0, offScreenCanvas.width, offScreenCanvas.height,
            dimension.widthMargin, dimension.heightMargin, dimension.cellWidth, dimension.cellHeight);

        if (_model.getIsDeathAnimationDone()) {
            _cell.setMonster(undefined);

            while (!_itemsQueue.isEmpty()) {
                _cell.addItem(_itemsQueue.dequeue());
            }
        }
    };

    this.getIsDeathAnimationDone = function () {
        return _model.getIsDeathAnimationDone();
    };

    this.setCell = function (currentCell) {
        _cell = currentCell;
    };

    this.getCell = function () {
        return _cell;
    };

    this.setDirectionHeading = function(direction) {
        _directionHeading = direction;
    };

    this.getDirectionHeading = function () {
        return _directionHeading;
    };

    this.setPathStackTowardPosition = function (pathStack) {
        _pathStackTowardPosition = pathStack;
    };

    this.getPathStackTowardPosition = function () {
        return _pathStackTowardPosition;
    };

    this.clearPathStackTowardPosition = function () {
        if (_pathStackTowardPosition) {
            _pathStackTowardPosition.clear();
        }
    };

    this.setTowardRowIndex = function (towardRowIndex) {
        _towardRowIndex = towardRowIndex;
    };

    this.getTowardRowIndex = function () {
        return _towardRowIndex;
    };

    this.setTowardColIndex = function (towardColIndex) {
        _towardColIndex = towardColIndex;
    };

    this.getTowardColIndex = function () {
        return _towardColIndex;
    };

    this.canMonsterMove = function () {
        var currentTime = new Date().getTime();

        if (currentTime > _nextTimeMonsterCanMove) {
            _nextTimeMonsterCanMove = currentTime + ((1 - _model.getSpeed()) * 2000);
            _model.monsterMoved();
            return true;
        }

        return false;
    };
};