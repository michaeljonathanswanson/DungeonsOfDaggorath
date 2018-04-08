/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/8/12
 * Time: 4:01 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawMagicDoor: true, DrawEffects: true, MagicDoor: true, Enum: true */

DrawMagicDoor = function () {
    'use strict';
    var _magicDoor = new MagicDoor(),
        _counter = 0,
        _maxCounter = 3,
        _maxGlowSize = 20;

    function drawDoorHelper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                            rightDoorClosetOffset, rightDoorMiddleOffset, rightDoorFurthestOffset,
                            numberOfCellsAwayFromPlayer, isLeftDoor, activeTorch) {
        var middleDoorHeight = (0.5 * middleDimension.cellHeight) + middleDimension.heightMargin, //From the ceiling
            bottomY = closestDimension.heightMargin + closestDimension.cellHeight,
            nextBottomY = furthestDimension.heightMargin + furthestDimension.cellHeight,
            doorWidth = furthestDimension.widthMargin - closestDimension.widthMargin,
            closetX = closestDimension.widthMargin + rightDoorClosetOffset,
            middleX = closestDimension.widthMargin + (doorWidth / 2) + rightDoorMiddleOffset,
            furthestX = furthestDimension.widthMargin + rightDoorFurthestOffset,
            colorPart = 0,
            colorPartBase = activeTorch.getColorPart(foregroundColor, middleDimension.distanceRatio),
            sizeOfGlow = _maxGlowSize / numberOfCellsAwayFromPlayer,
            alphaBase = activeTorch.getAlphaLevel(middleDimension.distanceRatio),
            glowPercent = 0,
            adjustedCounter = 0,
            counter;

        context.save();
        if (numberOfCellsAwayFromPlayer < 3) {
            for(counter = 0; counter < sizeOfGlow; counter++) {
                adjustedCounter = counter / 2;

                if (!isLeftDoor) {
                    adjustedCounter = -1 * adjustedCounter;
                }

                if (counter === 0) {
                    glowPercent = alphaBase;
                } else {
                    glowPercent = ((sizeOfGlow - counter) / sizeOfGlow) * alphaBase;
                }

                if (foregroundColor === "white") {
                    colorPart = colorPartBase * glowPercent;
                } else {
                    colorPart = colorPartBase * (1 - glowPercent);
                }

                colorPart = Math.round(colorPart);

                context.beginPath();

                if (!isLeftDoor) {
                    context.moveTo(closetX - adjustedCounter, bottomY - (adjustedCounter / 2));
                    context.lineTo(middleX, middleDoorHeight - (counter + Math.abs(adjustedCounter)));
                    //furthest angle line
                    context.lineTo(furthestX + adjustedCounter, nextBottomY + (adjustedCounter / 2));
                } else {
                    //closest angle line
                    context.moveTo(closetX - adjustedCounter, bottomY + (adjustedCounter / 2));
                    context.lineTo(middleX, middleDoorHeight - (counter + adjustedCounter));
                    //furthest angle line
                    context.lineTo(furthestX + adjustedCounter, nextBottomY - (adjustedCounter / 2));
                }

                context.strokeStyle = "rgba(" + colorPart + ", " + colorPart + ", " + colorPart + ", " + glowPercent + ")";
                context.stroke();
                context.closePath();
            }
        } else {
            context.beginPath();

            //closest angle line
            context.moveTo(closetX, bottomY);
            context.lineTo(middleX, middleDoorHeight);

            //furthest angle line
            context.lineTo(furthestX, nextBottomY);

            context.strokeStyle = foregroundColor;
            context.stroke();
            context.closePath();
        }
        context.restore();
    }

    function drawDoorInPosition0Helper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                                       startingPoint, rightDoorMiddleOffset, isLeftDoor, activeTorch) {
        var middleDoorHeight = (0.5 * middleDimension.cellHeight) + middleDimension.heightMargin, //From the ceiling
            bottomY = closestDimension.cellHeight + (closestDimension.heightMargin / 2),
            doorWidth = (furthestDimension.widthMargin - closestDimension.widthMargin) / 2,
            middleX = closestDimension.widthMargin + (doorWidth / 2) + rightDoorMiddleOffset,
            colorPart = 0,
            colorPartBase = activeTorch.getColorPart(foregroundColor, middleDimension.distanceRatio),
            sizeOfGlow = _maxGlowSize * 1.5,
            alphaBase = activeTorch.getAlphaLevel(middleDimension.distanceRatio),
            glowPercent = 0,
            adjustedCounter = 0,
            counter;

        context.beginPath();

        //furthest angle line
        context.moveTo(startingPoint, middleDoorHeight);
        context.lineTo(middleX, bottomY);

        context.strokeStyle = foregroundColor;
        context.stroke();

        context.save();
        for(counter = 0; counter < sizeOfGlow; counter++) {
            adjustedCounter = counter / 2;

            if (!isLeftDoor) {
                adjustedCounter = -1 * adjustedCounter;
            }

            if (counter === 0) {
                glowPercent = alphaBase;
            } else {
                glowPercent = ((sizeOfGlow - counter) / sizeOfGlow) * alphaBase;
            }

            if (foregroundColor === "white") {
                colorPart = colorPartBase * glowPercent;
            } else {
                colorPart = colorPartBase * (1 - glowPercent);
            }

            colorPart = Math.round(colorPart);

            context.beginPath();

            if (!isLeftDoor) {
                context.moveTo(startingPoint, middleDoorHeight - (counter + Math.abs(adjustedCounter)));
                context.lineTo(middleX + adjustedCounter, bottomY + (adjustedCounter / 2));
            } else {
                context.moveTo(startingPoint, middleDoorHeight - (counter + Math.abs(adjustedCounter)));
                context.lineTo(middleX + adjustedCounter, bottomY - (adjustedCounter / 2));

            }

            context.strokeStyle = "rgba(" + colorPart + ", " + colorPart + ", " + colorPart + ", " + glowPercent + ")";
            context.stroke();
            context.closePath();
        }
        context.restore();
    }

    function drawLeftDoor(context, numberOfCellsAwayFromPlayer, foregroundColor,
                          closestDimension, middleDimension, furthestDimension, activeTorch) {
        if (numberOfCellsAwayFromPlayer === 0) {
            drawDoorInPosition0Helper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                0, 0, true, activeTorch);
        } else {
            drawDoorHelper(context, foregroundColor, closestDimension, middleDimension, furthestDimension, 0, 0, 0,
                numberOfCellsAwayFromPlayer, true, activeTorch);
        }
    }

    function drawRightDoor(context, numberOfCellsAwayFromPlayer, foregroundColor,
                           dimension, closestDimension, middleDimension, furthestDimension, activeTorch) {

        if (numberOfCellsAwayFromPlayer === 0) {
            drawDoorInPosition0Helper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                dimension.cellWidth, (0.97 * closestDimension.cellWidth), false, activeTorch);
        } else {
            drawDoorHelper(context, foregroundColor, closestDimension, middleDimension, furthestDimension,
                closestDimension.cellWidth, middleDimension.cellWidth, furthestDimension.cellWidth,
                numberOfCellsAwayFromPlayer, false, activeTorch);
        }
    }

    function drawFrontDoor(context, foregroundColor, dimension, numberOfCellsAwayFromPlayer, backgroundColor,
                           originalWidth, originalHeight, activeTorch) {
        var topY = (0.4 * dimension.cellHeight) + dimension.heightMargin, //From the ceiling
            bottomY = dimension.heightMargin + dimension.cellHeight,
            doorHeight = bottomY - topY,
            doorWidth = 0.25 * dimension.cellWidth,
            doorMargin = (0.75 * dimension.cellWidth) / 2,
            leftX = doorMargin + dimension.widthMargin,
            rightX = leftX + doorWidth,
            middleX = leftX + (doorWidth / 2),
            magicDoorCanvas,
            color = activeTorch.getForegroundColor(foregroundColor, dimension.distanceRatio);

        context.save();
        if (numberOfCellsAwayFromPlayer > 5) {
            context.beginPath();

            //left angle line
            context.moveTo(leftX, bottomY);
            context.lineTo(middleX, topY);

            //right angle line
            context.moveTo(middleX, topY);
            context.lineTo(rightX, bottomY);

            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        } else {
            _magicDoor.initialize(originalWidth, originalHeight);
            magicDoorCanvas = _magicDoor.render(color, backgroundColor);

            context.drawImage(magicDoorCanvas, 0, 0, magicDoorCanvas.width, magicDoorCanvas.height,
                leftX, topY, doorWidth, doorHeight);
        }
        context.restore();
    }

    function drawMagicDoor(position, dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
                           dimension, closestDimension, middleDimension, furthestDimension, nextDimension, backgroundColor,
                           originalWidth, originalHeight, activeTorch) {

        if (dungeonObject === "magicDoor") {
            switch (position) {
                case "front":
                    if (numberOfCellsAwayFromPlayer === 0) {
                        drawFrontDoor(context, foregroundColor, middleDimension, numberOfCellsAwayFromPlayer, backgroundColor,
                            originalWidth, originalHeight, activeTorch);
                    } else {
                        drawFrontDoor(context, foregroundColor, nextDimension, numberOfCellsAwayFromPlayer, backgroundColor,
                            originalWidth, originalHeight, activeTorch);
                    }
                    break;
                case "left":
                    drawLeftDoor(context, numberOfCellsAwayFromPlayer, foregroundColor,
                        closestDimension, middleDimension, furthestDimension, activeTorch);
                    break;
                case "right":
                    drawRightDoor(context, numberOfCellsAwayFromPlayer, foregroundColor,
                        dimension, closestDimension, middleDimension, furthestDimension, activeTorch);
                    break;
            }
        }
    }

    this.draw = function (playerFacing, cellToDraw, context, numberOfCellsAwayFromPlayer, foregroundColor,
                          dimension, closestDimension, middleDimension, furthestDimension, nextDimension, backgroundColor,
                          originalWidth, originalHeight, activeTorch) {

        if (activeTorch.getLightType() !== Enum.LIGHT_TYPE.NOT_MAGICAL) {
            var dungeonObject = cellToDraw.getFront(playerFacing);

            _counter++;
            if (_counter > _maxCounter)
            {
                _counter = 0;
            }

            drawMagicDoor("front", dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
                dimension, closestDimension, middleDimension, furthestDimension, nextDimension, backgroundColor,
                originalWidth, originalHeight, activeTorch);

            dungeonObject = cellToDraw.getLeft(playerFacing);

            drawMagicDoor("left", dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
                dimension, closestDimension, middleDimension, furthestDimension, nextDimension, backgroundColor,
                originalWidth, originalHeight, activeTorch);

            dungeonObject = cellToDraw.getRight(playerFacing);

            drawMagicDoor("right", dungeonObject, context, numberOfCellsAwayFromPlayer, foregroundColor,
                dimension, closestDimension, middleDimension, furthestDimension, nextDimension, backgroundColor,
                originalWidth, originalHeight, activeTorch);
        }
    };
};