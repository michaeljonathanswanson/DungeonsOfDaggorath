/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/11/12
 * Time: 8:15 PM
 * To change this template use File | Settings | File Templates.
 */
/*global CreateActions: true, Action: true */

CreateActions = function () {
    'use strict';

    this.getActions = function () {
        var actions = [],
            _actionCount = -1;

		actions[_actionCount++] = new Action("L", "LOOK", true, "look");
        actions[_actionCount++] = new Action("T L", "TURN LEFT", true, "turn left");
        actions[_actionCount++] = new Action("T R", "TURN RIGHT", true, "turn right");
        actions[_actionCount++] = new Action("T A", "TURN AROUND", true, "turn around");
        actions[_actionCount++] = new Action("M", "MOVE", true, "move");
        actions[_actionCount++] = new Action("M L", "MOVE LEFT", true, "move left");
		actions[_actionCount++] = new Action("M R", "MOVE RIGHT", true, "move right");
        actions[_actionCount++] = new Action("M B", "MOVE BACK", true, "move back");
        actions[_actionCount++] = new Action("A L", "ATTACK LEFT", true, "attack left");
        actions[_actionCount++] = new Action("A R", "ATTACK RIGHT", true, "attack right");
        actions[_actionCount++] = new Action("A B", "ATTACK BOTH", true, "attack both");
        actions[_actionCount++] = new Action("MAP", "MAP", true, "map");        
        actions[_actionCount++] = new Action("C D", "CLIMB DOWN", true, "climb down");
        actions[_actionCount++] = new Action("C U", "CLIMB UP", true, "climb up");
        actions[_actionCount++] = new Action("D L", "DROP LEFT", true, "drop left");
        actions[_actionCount++] = new Action("D R", "DROP RIGHT", true, "drop right");
        actions[_actionCount++] = new Action("S L", "STOW LEFT", true, "stow left");
        actions[_actionCount++] = new Action("S R", "STOW RIGHT", true, "stow right");
        actions[_actionCount++] = new Action("G L", "GET LEFT", true, "get left");
        actions[_actionCount++] = new Action("G R", "GET RIGHT", true, "get right");
        actions[_actionCount++] = new Action("P L", "PULL LEFT", true, "pull left");
        actions[_actionCount++] = new Action("P R", "PULL RIGHT", true, "pull right");
        actions[_actionCount++] = new Action("SAVE", "SAVE", true, "save");
        actions[_actionCount++] = new Action("LOAD", "LOAD", true, "load");

        return actions;
    };
};