/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/3/13
 * Time: 9:54 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Enum: true */

Enum = function() {
   'use strict';
};

Enum.LIGHT_TYPE = {
    NOT_MAGICAL : {value: 1},
    SOMEWHAT_MAGICAL: {value: 50},
    VERY_MAGICAL : {value: 100}
};

Enum.AttackOutcome = {
    PARRY: {value: 0},
    BLOCK: {value: 0},
    DODGE: {value: 0},
    HIT: {value: 1},
    CRIT: {value: 2}
};

Enum.AttackType = {
  LEFT: {value: 0},
  RIGHT: {value: 1},
  BOTH: {value: 2}
};