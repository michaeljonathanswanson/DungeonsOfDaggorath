/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/23/12
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawHitWall: true */

DrawHitWall = function () {
    'use strict';

    this.drawHitFrontWall = function (context, _canvasWidth, _canvasHeight) {
        context.beginPath();

        //Now the rectangle
        context.rect(4, 4, _canvasWidth - 8, _canvasHeight - 8);
        context.lineWidth = 4;
        context.strokeStyle = "red";
        context.stroke();

        context.globalAlpha = 0.1;
        context.fillStyle = "red";
        context.fill();

        context.lineWidth = 1;
        context.globalAlpha = 1;
    };
};