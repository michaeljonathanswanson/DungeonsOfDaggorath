/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/8/12
 * Time: 4:01 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawDoor: true */

DrawDoor = function () {
    'use strict';

    function drawDoorHelper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                            rightDoorClosetOffset, rightDoorMiddleOffset, rightDoorFurthestOffset, activeTorch) {
        var closestDoorHeight = 0.6 * closestDimension.cellHeight,
            furthestDoorHeight =  0.6 * furthestDimension.cellHeight,
            middleDoorHandleHeight = 0.7 * middleDimension.cellHeight, //From the ceiling
            bottomY = closestDimension.heightMargin + closestDimension.cellHeight,
            nextBottomY = furthestDimension.heightMargin + furthestDimension.cellHeight,
            closestDoorTopY = bottomY - closestDoorHeight,
            furthestDoorTopY = nextBottomY - furthestDoorHeight,
            doorWidth = closestDimension.cellWidth - furthestDimension.cellWidth,
            doorHandleRadius = 0.05 * doorWidth,
            doorHandleX = middleDimension.widthMargin + ((furthestDimension.widthMargin - middleDimension.widthMargin) / 2),
            doorHandleY = middleDimension.heightMargin + middleDoorHandleHeight,
            closetX = closestDimension.widthMargin + rightDoorClosetOffset,
            middleX = doorHandleX + rightDoorMiddleOffset,
            furthestX = furthestDimension.widthMargin + rightDoorFurthestOffset,
            color = activeTorch.getForegroundColor(foregroundColor, middleDimension.distanceRatio);

        context.save();
        context.beginPath();

        //closest vertical line
        context.moveTo(closetX, bottomY);
        context.lineTo(closetX, closestDoorTopY);

        //furthest vertical line
        context.moveTo(furthestX, nextBottomY);
        context.lineTo(furthestX, furthestDoorTopY);

        //top horizontal line
        context.moveTo(closetX, closestDoorTopY);
        context.lineTo(furthestX, furthestDoorTopY);

        //door handle
        context.moveTo(middleX, doorHandleY);
        context.arc(middleX, doorHandleY, doorHandleRadius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();

        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawDoorInPosition0Helper(context, foregroundColor, dimension,
                                       closestDimension, middleDimension, furthestDimension,
                                       startingPoint, rightDoorMiddleOffset, rightDoorHandleOffset, activeTorch) {
        var topY = (0.4 * middleDimension.cellHeight) + middleDimension.heightMargin, //From the ceiling
            bottomY = closestDimension.cellHeight + (closestDimension.heightMargin / 2),
            doorWidth = (furthestDimension.widthMargin - closestDimension.widthMargin) / 2,
            middleX = closestDimension.widthMargin + (doorWidth / 2) + rightDoorMiddleOffset,
            doorHandleRadius = 0.01 * dimension.cellWidth,
            doorHandleX = middleX / 2,
            doorHandleY = topY + ((bottomY - topY) / 2),
            color = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);

        context.save();
        context.beginPath();

        //top horizontal line
        context.moveTo(startingPoint, topY);
        context.lineTo(middleX, topY);

        //furthest vertical line
        context.moveTo(middleX, topY);
        context.lineTo(middleX, bottomY);

        //door handle
        context.moveTo(doorHandleX + rightDoorHandleOffset, doorHandleY);
        context.arc(doorHandleX + rightDoorHandleOffset, doorHandleY, doorHandleRadius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();

        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawLeftDoor(context, numberOfCellsAwayFromPlayer, foregroundColor, dimension, closestDimension,
                          middleDimension, furthestDimension, activeTorch) {

        if (numberOfCellsAwayFromPlayer === 0) {
            drawDoorInPosition0Helper(context, foregroundColor, dimension, closestDimension, middleDimension,
                furthestDimension, 0, 0, 0, activeTorch);
        } else {
            drawDoorHelper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                0, 0, 0, activeTorch);
        }
    }

    function drawRightDoor(context, numberOfCellsAwayFromPlayer, foregroundColor, dimension, closestDimension,
                           middleDimension, furthestDimension, activeTorch) {

        if (numberOfCellsAwayFromPlayer === 0) {
            drawDoorInPosition0Helper(context, foregroundColor, dimension, closestDimension, middleDimension, furthestDimension,
                dimension.cellWidth, (0.97 * closestDimension.cellWidth), closestDimension.cellWidth, activeTorch);
        } else {
            drawDoorHelper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                closestDimension.cellWidth, middleDimension.cellWidth, furthestDimension.cellWidth, activeTorch);
        }
    }

    function drawFrontDoor(context, foregroundColor, dimension, activeTorch) {
        var topY = (0.4 * dimension.cellHeight) + dimension.heightMargin, //From the ceiling
            bottomY = dimension.heightMargin + dimension.cellHeight,
            doorWidth = 0.25 * dimension.cellWidth,
            doorMargin = (0.75 * dimension.cellWidth) / 2,
            leftX = doorMargin + dimension.widthMargin,
            rightX = leftX + doorWidth,
            doorHandleRadius = 0.05 * doorWidth,
            doorHandleX = leftX + (doorWidth * 0.8),
            doorHandleY = topY + ((bottomY - topY) / 2),
            color = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);

        context.save();
        context.beginPath();

        //left vertical line
        context.moveTo(leftX, bottomY);
        context.lineTo(leftX, topY);

        //top horizontal line
        context.moveTo(leftX, topY);
        context.lineTo(rightX, topY);

        //right vertical line
        context.moveTo(rightX, topY);
        context.lineTo(rightX, bottomY);

        //door handle
        context.moveTo(doorHandleX, doorHandleY);
        context.arc(doorHandleX, doorHandleY, doorHandleRadius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();

        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawDoor(position, dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
                      dimension, closestDimension, middleDimension, furthestDimension, nextDimension, activeTorch) {

        if (dungeonObject === "door") {
            switch (position) {
                case "front":
                    if (numberOfCellsAwayFromPlayer === 0) {
                        drawFrontDoor(context, foregroundColor, middleDimension, activeTorch);
                    } else {
                        drawFrontDoor(context, foregroundColor, nextDimension, activeTorch);
                    }
                    break;
                case "left":
                    drawLeftDoor(context, numberOfCellsAwayFromPlayer, foregroundColor,
                        dimension, closestDimension, middleDimension, furthestDimension, activeTorch);
                    break;
                case "right":
                    drawRightDoor(context, numberOfCellsAwayFromPlayer, foregroundColor,
                        dimension, closestDimension, middleDimension, furthestDimension, activeTorch);
                    break;
            }
        }
    }

    this.draw = function (playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                          dimension, closestDimension, middleDimension, furthestDimension, nextDimension, activeTorch) {

        var dungeonObject = cellToDraw.getFront(playerFacing);

        drawDoor("front", dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
            dimension, closestDimension, middleDimension, furthestDimension, nextDimension, activeTorch);

        dungeonObject = cellToDraw.getLeft(playerFacing);

        drawDoor("left", dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
            dimension, closestDimension, middleDimension, furthestDimension, nextDimension, activeTorch);

        dungeonObject = cellToDraw.getRight(playerFacing);

        drawDoor("right", dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
            dimension, closestDimension, middleDimension, furthestDimension, nextDimension, activeTorch);
    };
};