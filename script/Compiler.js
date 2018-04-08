/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/1/12
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Compiler: true, Action: true */

Compiler = function (actions) {
    'use strict';
    var _carriageReturnPressed = false,
        _currentUserInput = '',
        _lastUserInput = '',
        _undefinedAction = new Action('', ''),
        _actions = actions;

    this.doKeyDown = function (keyCode) {
        var preventDefault = false;
        _carriageReturnPressed = false;

        if (keyCode === 13) {
            _carriageReturnPressed = true;
            _lastUserInput = _currentUserInput;
            _currentUserInput = '';
        } else if (keyCode === 8) {
            _currentUserInput = _currentUserInput.substring(0, _currentUserInput.length - 1);
            preventDefault = true;
        } else if (keyCode === 37) { //Left Arrow key
            _carriageReturnPressed = true;
            _lastUserInput = "TURN LEFT";
            _currentUserInput = "";
        } else if (keyCode === 38) { //Up Arrow key
            _carriageReturnPressed = true;
            _lastUserInput = "MOVE";
            _currentUserInput = "";
        } else if (keyCode === 39) { //Right Arrow key
            _carriageReturnPressed = true;
            _lastUserInput = "TURN RIGHT";
            _currentUserInput = "";
        } else if (keyCode === 40) { //Down Arrow key
            _carriageReturnPressed = true;
            _lastUserInput = "MOVE BACK";
            _currentUserInput = "";
        } else if (keyCode === 49) { //1 key
            _carriageReturnPressed = true;
            _lastUserInput = "ATTACK LEFT";
            _currentUserInput = "";
        } else if (keyCode === 50) { //2 key
            _carriageReturnPressed = true;
            _lastUserInput = "ATTACK RIGHT";
            _currentUserInput = "";
        } else if (keyCode === 51) { //3 key
            _carriageReturnPressed = true;
            _lastUserInput = "ATTACK BOTH";
            _currentUserInput = "";
        } else if ((keyCode >= 65 && keyCode <= 90) || keyCode === 32) {
            //If it is an alpha code
            _currentUserInput += String.fromCharCode(keyCode);
        } //else ignore input

        return preventDefault;
    };

    this.wasCarriageReturnPressed = function () {
        return _carriageReturnPressed;
    };

    this.getUserInput = function () {
        return _currentUserInput;
    };

    this.getAction = function () {
        var action = _undefinedAction,
            index = _actions.length;

        action.setUserInput(_lastUserInput);

        if (_carriageReturnPressed) {
            _carriageReturnPressed = false;
            while (index--) {
                if (_actions[index].isThisAction(_lastUserInput)) {
                    action = _actions[index];
                    action.setUserInput(_lastUserInput);
                    break;
                }
            }
        }

        return action;
    };
};


