/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/4/12
 * Time: 9:50 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Action: true */

Action = function (actionSmallKeyWord, actionLongKeyWord, validAction, name) {
    'use strict';
    var _actionSmallKeyWord = actionSmallKeyWord,
        _actionLongKeyWord = actionLongKeyWord,
        _validAction = validAction,
        _name = name,
        _userInput = '';

    this.isThisAction = function (userInput) {
        return userInput.indexOf(_actionSmallKeyWord) === 0 || userInput.indexOf(_actionLongKeyWord) === 0;
    };

    this.isValidAction = function () {
        return _validAction;
    };

    this.setUserInput = function (userInput) {
        _userInput = userInput;
    };

    this.getUserInput = function () {
        return _userInput;
    };

    this.getActionName = function () {
        return _name;
    };
};