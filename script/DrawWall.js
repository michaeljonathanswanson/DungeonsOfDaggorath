/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/8/12
 * Time: 9:19 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawWall: true */

DrawWall = function () {
    'use strict';

    function drawCellLeftSide(context, foregroundColor, dimension, activeTorch) {
        var bottomY = dimension.heightMargin + dimension.cellHeight;

        context.save();
        context.beginPath();

        //left vertical line
        context.moveTo(dimension.widthMargin, dimension.heightMargin);
        context.lineTo(dimension.widthMargin, bottomY);

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawCellRightSide(context, foregroundColor, dimension, activeTorch) {
        var rightX = dimension.widthMargin + dimension.cellWidth,
            bottomY = dimension.heightMargin + dimension.cellHeight;

        context.save();
        context.beginPath();

        //right vertical line
        context.moveTo(rightX, dimension.heightMargin);
        context.lineTo(rightX, bottomY);

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawCellTop(context, foregroundColor, dimension, activeTorch) {
        context.save();
        context.beginPath();

        //top horizontal line
        context.moveTo(dimension.widthMargin, dimension.heightMargin);
        context.lineTo(dimension.widthMargin + dimension.cellWidth, dimension.heightMargin);

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawCellLeftSideAngles(dungeonObjectsToDraw, context, foregroundColor, dimension, nextDimension, activeTorch) {
        var bottomY = dimension.heightMargin + dimension.cellHeight,
            nextBottomY = nextDimension.heightMargin + nextDimension.cellHeight;

        context.save();
        context.beginPath();

        //top left diagonal line
        context.moveTo(dimension.widthMargin, dimension.heightMargin);
        context.lineTo(nextDimension.widthMargin, nextDimension.heightMargin);

        if (dungeonObjectsToDraw === "open") { //was corridor
            //top left diagonal line outwards
            context.moveTo(nextDimension.widthMargin, nextDimension.heightMargin);
            context.lineTo(dimension.widthMargin, nextDimension.heightMargin);

            //bottom left diagonal line outwards
            context.moveTo(nextDimension.widthMargin, nextBottomY);
            context.lineTo(dimension.widthMargin, nextBottomY);
        } else {
            //bottom left diagonal line
            context.moveTo(dimension.widthMargin, bottomY);
            context.lineTo(nextDimension.widthMargin, nextBottomY);
        }

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawCellRightSideAngles(dungeonObjectsToDraw, context, foregroundColor, dimension, nextDimension, activeTorch) {
        var rightX = dimension.widthMargin + dimension.cellWidth,
            bottomY = dimension.heightMargin + dimension.cellHeight,
            nextRightX = nextDimension.widthMargin + nextDimension.cellWidth,
            nextBottomY = nextDimension.heightMargin + nextDimension.cellHeight;

        context.save();
        context.beginPath();

        //top right diagonal line
        context.moveTo(rightX, dimension.heightMargin);
        context.lineTo(nextRightX, nextDimension.heightMargin);

        if (dungeonObjectsToDraw === "open") { //was corridor
            //top right diagonal line outwards
            context.moveTo(nextRightX, nextDimension.heightMargin);
            context.lineTo(rightX, nextDimension.heightMargin);

            //bottom right diagonal line outwards
            context.moveTo(rightX, nextBottomY);
            context.lineTo(nextRightX, nextBottomY);
        } else {
            //bottom right diagonal line
            context.moveTo(rightX, bottomY);
            context.lineTo(nextRightX, nextBottomY);
        }
        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawFrontWall(context, foregroundColor, middleDimension, activeTorch) {
        var nextRightX = middleDimension.widthMargin + middleDimension.cellWidth,
            nextBottomY = middleDimension.heightMargin + middleDimension.cellHeight;

        context.save();
        context.beginPath();

        //Now the rectangle
        context.rect(middleDimension.widthMargin, middleDimension.heightMargin,
            nextRightX - middleDimension.widthMargin, nextBottomY - middleDimension.heightMargin);

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, middleDimension.distanceRatio);
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawRightSide(dungeonObjectsToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor, dimension,
                           middleDimension, nextDimension, activeTorch) {
        var dimensionForAngles;

        if (numberOfCellsAwayFromPlayer === 9) {
            dimensionForAngles = middleDimension;
        } else {
            dimensionForAngles = nextDimension;
        }

        drawCellRightSide(context, foregroundColor, dimension, activeTorch);
        drawCellRightSideAngles(dungeonObjectsToDraw, context, foregroundColor, dimension, dimensionForAngles, activeTorch);
    }

    function drawLeftSide(dungeonObjectsToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor, dimension,
                          middleDimension, nextDimension, activeTorch) {
        var dimensionForAngles;

        if (numberOfCellsAwayFromPlayer === 9) {
            dimensionForAngles = middleDimension;
        } else {
            dimensionForAngles = nextDimension;
        }

        drawCellLeftSide(context, foregroundColor, dimension, activeTorch);
        drawCellLeftSideAngles(dungeonObjectsToDraw, context, foregroundColor, dimension, dimensionForAngles, activeTorch);
    }

    this.draw = function (playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                          dimension, middleDimension, nextDimension, activeTorch) {

        drawCellTop(context, foregroundColor, middleDimension, activeTorch);

        var dungeonObject = cellToDraw.getFront(playerFacing);

        if (dungeonObject !== "open") {
            //if the numberOfCellsAwayFromPlayer == 0 then it will always be front
            if (numberOfCellsAwayFromPlayer === 0) {
                drawFrontWall(context, foregroundColor, middleDimension, activeTorch);
            } else {
                drawFrontWall(context, foregroundColor, nextDimension, activeTorch);
            }
        }

        if (dungeonObject !== "open" && numberOfCellsAwayFromPlayer === 0) {
            dungeonObject = cellToDraw.getLeft(playerFacing);
            drawLeftSide(dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor, dimension, dimension,
                middleDimension, activeTorch);

            dungeonObject = cellToDraw.getRight(playerFacing);
            drawRightSide(dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor, dimension, dimension,
                middleDimension, activeTorch);
        } else {
            dungeonObject = cellToDraw.getLeft(playerFacing);
            drawLeftSide(dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor, dimension,
                middleDimension, nextDimension, activeTorch);

            dungeonObject = cellToDraw.getRight(playerFacing);
            drawRightSide(dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor, dimension,
                middleDimension, nextDimension, activeTorch);
        }
    };
};