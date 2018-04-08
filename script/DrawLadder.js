/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/9/12
 * Time: 10:24 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawLadder: true */

DrawLadder = function () {
    'use strict';

    function getLadderLineWidth(numberOfCellsAwayFromPlayer) {
        var lineWidth = 3;

        if (numberOfCellsAwayFromPlayer > 7) {
            lineWidth = 1;
        } else if (numberOfCellsAwayFromPlayer > 4) {
            lineWidth = 2;
        }

        return lineWidth;
    }

    function drawFloorLadder(context, numberOfCellsAwayFromPlayer,
                             foregroundColor, backgroundColor, dimension, middleDimension, activeTorch) {
        var closestY = dimension.cellHeight + dimension.heightMargin,
            furthestY = middleDimension.cellHeight + middleDimension.heightMargin,
            furthestLeftX = middleDimension.widthMargin + (middleDimension.cellWidth * 0.425),
            furthestRightX = middleDimension.widthMargin + (middleDimension.cellWidth * 0.575),
            ladderSizeUnit = furthestY - closestY,
            distanceBetweenSteps = ladderSizeUnit / 2;

        //Draw Ladder in the hole
        context.save();
        context.beginPath();

        //left vertical line
        context.moveTo(furthestLeftX, furthestY);
        context.lineTo(furthestLeftX, closestY);

        //right vertical line
        context.moveTo(furthestRightX, furthestY);
        context.lineTo(furthestRightX, closestY);

        //first horizontal step
        context.moveTo(furthestLeftX, closestY + distanceBetweenSteps);
        context.lineTo(furthestRightX, closestY + distanceBetweenSteps);

        context.strokeStyle = backgroundColor;
        context.lineWidth = getLadderLineWidth(numberOfCellsAwayFromPlayer);
        context.stroke();
        context.closePath();

        //Draw Ladder above the hole
        context.beginPath();

        //first horizontal step
        context.moveTo(furthestLeftX, furthestY);
        context.lineTo(furthestLeftX, furthestY + (2 * ladderSizeUnit));

        //right vertical line
        context.moveTo(furthestRightX, furthestY);
        context.lineTo(furthestRightX, furthestY + (2 * ladderSizeUnit));

        //second horizontal step
        context.moveTo(furthestLeftX, furthestY + (2 * distanceBetweenSteps));
        context.lineTo(furthestRightX, furthestY + (2 * distanceBetweenSteps));

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, middleDimension.distanceRatio);
        context.lineWidth = getLadderLineWidth(numberOfCellsAwayFromPlayer);
        context.stroke();

        context.closePath();
        context.restore();
    }

    function drawCeilingLadder(context, numberOfCellsAwayFromPlayer, foregroundColor, backgroundColor,
                               dimension, middleDimension, activeTorch) {
        var closestBottomY = dimension.cellHeight + dimension.heightMargin,
            closestTopY = dimension.heightMargin,
            furthestTopY = middleDimension.heightMargin,
            furthestLeftX = middleDimension.widthMargin + (middleDimension.cellWidth * 0.425),
            furthestRightX = middleDimension.widthMargin + (middleDimension.cellWidth * 0.575),
            ladderSizeUnit = (closestBottomY - furthestTopY),
            numberOfSteps = 8,
            distanceBetweenSteps = ladderSizeUnit / numberOfSteps,
            stepY = 0,
            step = 0;

        //Draw Ladder in the hole
        context.save();
        context.beginPath();

        //left vertical line
        context.moveTo(furthestLeftX, closestBottomY);
        context.lineTo(furthestLeftX, furthestTopY);

        //right vertical line
        context.moveTo(furthestRightX, closestBottomY);
        context.lineTo(furthestRightX, furthestTopY);

        //horizontal steps
        for (step = 1; step < numberOfSteps; step++) {
            stepY = furthestTopY + (step * distanceBetweenSteps);
            context.moveTo(furthestLeftX, stepY);
            context.lineTo(furthestRightX, stepY);
        }

        context.strokeStyle = activeTorch.getForegroundColor(foregroundColor, middleDimension.distanceRatio);
        context.lineWidth = getLadderLineWidth(numberOfCellsAwayFromPlayer);
        context.stroke();
        context.closePath();

        //Draw Ladder above the hole
        context.beginPath();

        //left vertical line
        context.moveTo(furthestLeftX, furthestTopY);
        context.lineTo(furthestLeftX, closestTopY);

        //right vertical line
        context.moveTo(furthestRightX, furthestTopY);
        context.lineTo(furthestRightX, closestTopY);

        context.strokeStyle = backgroundColor;
        context.lineWidth = getLadderLineWidth(numberOfCellsAwayFromPlayer);
        context.stroke();

        context.closePath();
        context.restore();
    }

    this.draw = function (item, context, numberOfCellsAwayFromPlayer, foregroundColor, backgroundColor,
                          dimension, middleDimension, activeTorch) {
        if (item === "floorLadder") {
            drawFloorLadder(context, numberOfCellsAwayFromPlayer, foregroundColor, backgroundColor,
                dimension, middleDimension, activeTorch);
        } else if (item === "ceilingLadder") {
            drawCeilingLadder(context, numberOfCellsAwayFromPlayer, foregroundColor, backgroundColor,
                dimension, middleDimension, activeTorch);
        }
    };
};