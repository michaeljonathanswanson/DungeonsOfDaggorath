/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/8/12
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawCell: true, DrawWall: true, DrawDoor: true, DrawMagicDoor: true, DrawHole: true, DrawLadder: true, distanceRatio: true, distanceRatioPlusHalf: true, distanceRatioPlusQuarter: true, distanceRatioPlus3Quarter: true */

DrawCell = function (drawHelper) {
    'use strict';
    var _drawHelper = drawHelper,
        _drawWall = new DrawWall(),
        _drawDoor = new DrawDoor(),
        _drawMagicDoor = new DrawMagicDoor(),
        _drawHole = new DrawHole(),
        _drawLadder = new DrawLadder();

    function drawCellSides(context, foregroundColor, canvasWidth, canvasHeight, distanceRatio) {
        var dimension = _drawHelper.calcDims(canvasWidth, canvasHeight, distanceRatio),
            rightX = dimension.widthMargin + dimension.cellWidth,
            bottomY = dimension.heightMargin + dimension.cellHeight;

        context.beginPath();

        //left vertical line
        context.moveTo(dimension.widthMargin, dimension.heightMargin);
        context.lineTo(dimension.widthMargin, bottomY);

        //right vertical line
        context.moveTo(rightX, dimension.heightMargin);
        context.lineTo(rightX, bottomY);

        context.strokeStyle = foregroundColor;
        context.stroke();
    }

    function drawCellObjects(playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                             backgroundColor, dimension, closestDimension, middleDimension, furthestDimension,
                             nextDimension, originalWidth, originalHeight, activeTorch) {
        var monster = cellToDraw.getMonster();

        _drawWall.draw(playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
            dimension, middleDimension, nextDimension, activeTorch);

        if (numberOfCellsAwayFromPlayer < 9) {
            _drawDoor.draw(playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                dimension, closestDimension, middleDimension, furthestDimension, nextDimension, activeTorch);

            _drawMagicDoor.draw(playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                dimension, closestDimension, middleDimension, furthestDimension, nextDimension, backgroundColor,
                originalWidth, originalHeight, activeTorch);

            if (monster) {
                monster.drawMonster(context, foregroundColor, dimension, activeTorch);
            }
        }
    }


    function drawCellItems(itemsToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                           backgroundColor, dimension, middleDimension, activeTorch, currentDistanceRatio) {
        var iterator = itemsToDraw.iterator(0),
            item,
            alphaLevel;

        while (iterator.hasNext()) {
            item = iterator.next();

            switch (item) {
                case "floorHole":
                case "ceilingHole":
                    _drawHole.draw(item, context, foregroundColor, backgroundColor, dimension, middleDimension,
                    activeTorch);
                    break;
                case "floorLadder":
                case "ceilingLadder":
                    _drawHole.draw(item, context, foregroundColor, backgroundColor, dimension, middleDimension,
                    activeTorch, activeTorch);
                    _drawLadder.draw(item, context, numberOfCellsAwayFromPlayer, foregroundColor, backgroundColor,
                        dimension, middleDimension, activeTorch);
                    break;
                default:
                    if (item && typeof item.renderItemOnFloor === 'function') {
                        alphaLevel = activeTorch.getAlphaLevel(currentDistanceRatio);
                        item.renderItemOnFloor(context, foregroundColor, middleDimension, alphaLevel);
                    }
                    break;
            }
        }
    }

    function drawCellHelper (playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                             backgroundColor, canvasWidth, canvasHeight, currentDistanceRatio, closestDistanceRatio,
                             middleDistanceRatio, furthestDistanceRatio, originalWidth, originalHeight, activeTorch) {
        var nextDistanceRatio = middleDistanceRatio,
            dimension,
            nextDimension,
            closestDimension,
            middleDimension,
            furthestDimension;

        if (numberOfCellsAwayFromPlayer < 9) {
            nextDistanceRatio = distanceRatio[numberOfCellsAwayFromPlayer + 1];
        }

        dimension = _drawHelper.calcDims(canvasWidth, canvasHeight, currentDistanceRatio);
        nextDimension = _drawHelper.calcDims(canvasWidth, canvasHeight, nextDistanceRatio);
        closestDimension = _drawHelper.calcDims(canvasWidth, canvasHeight, closestDistanceRatio);
        middleDimension = _drawHelper.calcDims(canvasWidth, canvasHeight, middleDistanceRatio);
        furthestDimension = _drawHelper.calcDims(canvasWidth, canvasHeight, furthestDistanceRatio);

        drawCellObjects(playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
            backgroundColor, dimension, closestDimension, middleDimension, furthestDimension, nextDimension,
            originalWidth, originalHeight, activeTorch);

        if (!cellToDraw.items().isEmpty()) {
            drawCellItems(cellToDraw.items(), context, numberOfCellsAwayFromPlayer,
                foregroundColor, backgroundColor, dimension, middleDimension, activeTorch, currentDistanceRatio);
        }
    }

    this.drawCell = function (playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                              backgroundColor, canvasWidth, canvasHeight, originalWidth, originalHeight, activeTorch) {

        drawCellHelper(playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor, backgroundColor,
            canvasWidth, canvasHeight, distanceRatio[numberOfCellsAwayFromPlayer],
            distanceRatioPlusQuarter[numberOfCellsAwayFromPlayer], distanceRatioPlusHalf[numberOfCellsAwayFromPlayer],
            distanceRatioPlus3Quarter[numberOfCellsAwayFromPlayer], originalWidth, originalHeight, activeTorch);
    };
};