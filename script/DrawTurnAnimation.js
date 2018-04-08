/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/22/12
 * Time: 9:59 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawTurnAnimation: true, distanceRatioPlusQuarter: true */

DrawTurnAnimation = function (drawHelper) {
    'use strict';
    var _drawHelper = drawHelper;

    function drawTurnAnimation(context, foregroundColor, middleDimension, verticalXPercentage) {
        var nextBottomY = middleDimension.heightMargin + middleDimension.cellHeight,
            verticalX = (middleDimension.cellWidth * verticalXPercentage) + middleDimension.widthMargin;

        context.beginPath();

        //Now the rectangle
        context.rect(middleDimension.widthMargin, middleDimension.heightMargin,
            middleDimension.cellWidth, middleDimension.cellHeight);

        context.moveTo(verticalX, middleDimension.heightMargin);
        context.lineTo(verticalX, nextBottomY);
        context.strokeStyle = foregroundColor;
        context.stroke();
    }

    this.drawTurnAnimation = function (context, foregroundColor, canvasWidth, canvasHeight, transitionPercentage) {
        var middleDimension = _drawHelper.calcDims(canvasWidth, canvasHeight, distanceRatioPlusQuarter[0]);

        drawTurnAnimation(context, foregroundColor, middleDimension, transitionPercentage);
    };
};