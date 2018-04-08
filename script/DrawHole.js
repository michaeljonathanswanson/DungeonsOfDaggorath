/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/9/12
 * Time: 7:56 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawHole: true */

DrawHole = function () {
    'use strict';

    function drawHole(context, foregroundColor, backgroundColor, closestDimension, furthestDimension, closestY,
                      furthestY, activeTorch) {
        var closestLeftX = closestDimension.widthMargin + (closestDimension.cellWidth * 0.3),
            furthestLeftX = furthestDimension.widthMargin + (furthestDimension.cellWidth * 0.3),
            closestRightX = closestDimension.widthMargin + (closestDimension.cellWidth * 0.7),
            furthestRightX = furthestDimension.widthMargin + (furthestDimension.cellWidth * 0.7),
            foreColor = activeTorch.getForegroundColor(foregroundColor, closestDimension.distanceRatio);

        context.save();
        context.beginPath();

        //left line
        context.moveTo(furthestLeftX, furthestY);
        context.lineTo(closestLeftX, closestY);

        //bottom line
        context.lineTo(closestRightX, closestY);

        //right line
        context.lineTo(furthestRightX, furthestY);

        //top line
        context.lineTo(furthestLeftX, furthestY);

        context.strokeStyle = foreColor;
        context.stroke();

        context.fillStyle = foreColor;
        context.fill();
        context.closePath();

        context.beginPath();

        //left vertical line
        context.moveTo(furthestLeftX, furthestY);
        context.lineTo(furthestLeftX, closestY);

        //right vertical line
        context.moveTo(furthestRightX, furthestY);
        context.lineTo(furthestRightX, closestY);

        context.strokeStyle = activeTorch.getForegroundColor(backgroundColor, closestDimension.distanceRatio);
        context.stroke();

        context.closePath();
        context.restore();

    }

    this.draw = function (item, context, foregroundColor, backgroundColor, dimension, middleDimension, activeTorch) {
        if (item === "floorHole" || item === "floorLadder") {
            drawHole(context, foregroundColor, backgroundColor, dimension, middleDimension,
                dimension.cellHeight + dimension.heightMargin,
                middleDimension.cellHeight + middleDimension.heightMargin, activeTorch);
        } else if (item === "ceilingHole" || item === "ceilingLadder") {
            drawHole(context, foregroundColor, backgroundColor, dimension, middleDimension,
                dimension.heightMargin, middleDimension.heightMargin, activeTorch);
        }
    };
};