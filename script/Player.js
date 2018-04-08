/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/19/12
 * Time: 6:10 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Player: true, js_cols: true, ItemHelper: true */

Player = function (experience, rowIndex, colIndex, facing, leftHand, rightHand, activeTorch, itemsInBackpack) {
    "use strict";
    var _experience = experience,
        _rowIndex = rowIndex,
        _colIndex = colIndex,
        _facing = facing,
        _leftHand = leftHand,
        _rightHand = rightHand,
        _activeTorch = activeTorch,
        _itemsInBackpack = itemsInBackpack,
        _playerAttackedWithShield = false;

        _itemsInBackpack.insert(_activeTorch);

    function getAttackPower(item) {
        var attackPowerOfItem = 1,
            attackPower;

        if (item) {
            attackPowerOfItem = item.getAttackValue();
        }

        attackPower = ((_experience + 1) / 10) + attackPowerOfItem;
        return attackPower;
    }

    function activateTorch(torch) {
        if (_activeTorch) {
            _itemsInBackpack.insert(_activeTorch);
        }

        _activeTorch = torch;
    }

    function useItem(item) {
        switch (item.getItemType()) {
            case "torch":
                activateTorch(item);
                break;
        }
    }

    function pullItem(userInput, itemInHand) {
        var itemFromBackPack = ItemHelper.removeItem(userInput, _itemsInBackpack);

        if (itemFromBackPack) {
            if (itemInHand) {
                _itemsInBackpack.insert(itemInHand);
            }

            return itemFromBackPack;
        }

        return itemInHand;
    }

    function getPlayerAttackedWithLeftShield() {
        return _leftHand.getItemType() === "shield";
    }

    function getPlayerAttackedWithRightShield() {
        return _rightHand.getItemType() === "shield";
    }

    function setPlayerAttackedWithShield(attackedLeft, attackBoth) {
        if (attackBoth) {
            _playerAttackedWithShield = getPlayerAttackedWithLeftShield() || getPlayerAttackedWithRightShield();
        } else if (attackedLeft) {
            _playerAttackedWithShield = getPlayerAttackedWithLeftShield();
        } else {
            _playerAttackedWithShield = getPlayerAttackedWithRightShield();
        }

    }

    this.addExperience = function(experience) {
        _experience += experience;
    };

    this.getExperience = function() {
        return _experience;
    };

    this.getActiveTorch = function() {
        return _activeTorch;
    };

    this.getRowIndex = function () {
        return _rowIndex;
    };

    this.getColIndex = function () {
        return _colIndex;
    };

    this.move = function (direction) {
        switch (direction) {
            case "north":
                _rowIndex--;
                break;
            case "south":
                _rowIndex++;
                break;
            case "east":
                _colIndex++;
                break;
            case "west":
                _colIndex--;
                break;
        }
    };

    this.getFacingDirection = function () {
        return _facing;
    };

    this.setFacingDirection = function (direction) {
        _facing = direction;
    };

    this.dropLeft = function () {
        var item = _leftHand;
        _leftHand = undefined;

        return item;
    };

    this.dropRight = function () {
        var item = _rightHand;
        _rightHand = undefined;

        return item;
    };

    this.getLeftHandImage = function (foregroundColor) {
        if (_leftHand) {
            //All in hand images are render in the right hand, and the GameEngine will translate the image if it needs to be in the left hand.
            return _leftHand.renderRightHand(foregroundColor);
        }

        return undefined;
    };

    this.setLeftHand = function(item) {
        _leftHand = item;
    };

    this.displayLeftHand = function () {
        if (!_leftHand) {
            return "EMPTY";
        }

        return _leftHand.getName();
    };

    this.getRightHandImage = function (foregroundColor) {
        if (_rightHand) {
            return _rightHand.renderRightHand(foregroundColor);
        }

        return undefined;
    };

    this.setRightHand = function(item) {
        _rightHand = item;
    };

    this.displayRightHand = function () {
        if (!_rightHand) {
            return "EMPTY";
        }

        return _rightHand.getName();
    };

    this.addItemToBackPack = function(item) {
        _itemsInBackpack.insert(item);
    };

    this.pullLeftItem = function(userInput) {
        _leftHand = pullItem(userInput, _leftHand);
    };

    this.pullRightItem = function(userInput) {
        _rightHand = pullItem(userInput, _rightHand);
    };

    this.getLightLevel = function () {
        return _activeTorch.getPercentUsed();
    };

    this.useLeft = function() {
        useItem(_leftHand);
    };

    this.useRight = function() {
        useItem(_rightHand);
    };

    this.attackLeft = function(attackBoth) {
        var attackPower = getAttackPower(_leftHand);

        if (_leftHand) {
            setPlayerAttackedWithShield(true, attackBoth);
            _leftHand.renderAttack();
        } else {
            _playerAttackedWithShield = false;
        }

        return attackPower;
    };

    this.attackRight = function(attackBoth) {
        var attackPower = getAttackPower(_rightHand);

        if (_rightHand) {
            setPlayerAttackedWithShield(false, attackBoth);
            _rightHand.renderAttack();
        } else {
            _playerAttackedWithShield = false;
        }

        return attackPower;
    };

    this.getPlayerAttackedWithShield = function() {
        return _playerAttackedWithShield;
    };

};
