/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/16/12
 * Time: 7:43 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawMap: true, js_cols: true */

DrawMap = function (dungeonMatrix, rows, cols, context) {
    'use strict';
    var _dungeonMatrix = dungeonMatrix,
        _rows = rows,
        _cols = cols,
        _context = context;

    function drawDoorLine(cellObject, fromX, fromY, toX, toY, color) {
        _context.save();
        _context.beginPath();

        _context.lineWidth = 2;
        _context.strokeStyle = color;
        _context.moveTo(fromX, fromY);
        _context.lineTo(toX, toY);
        _context.stroke();

        _context.closePath();
        _context.restore();
    }

    function drawHoleRectangle(cell, currentX, currentY, cellWidth, cellHeight, color) {
        var holeWidthMargin = cellWidth * 0.25,
            holeHeightMargin = cellHeight * 0.25,
            holeWidthSize = holeWidthMargin * 2,
            holeHeightSize = holeHeightMargin * 2,
            x = currentX + holeWidthMargin,
            y = currentY + holeHeightMargin;

        _context.save();
        _context.beginPath();

        _context.strokeStyle = color;
        _context.strokeRect(x, y, holeWidthSize, holeHeightSize);
        _context.stroke();

        _context.closePath();
        _context.restore();
    }

    function drawLadderRectangle(cell, currentX, currentY, cellWidth, cellHeight, color) {
        var holeWidthMargin = cellWidth * 0.25,
            holeHeightMargin = cellHeight * 0.25,
            holeWidthSize = holeWidthMargin * 2,
            holeHeightSize = holeHeightMargin * 2,
            x = currentX + holeWidthMargin,
            y = currentY + holeHeightMargin;

        _context.save();

        _context.fillStyle = color;
        _context.fillRect(x, y, holeWidthSize, holeHeightSize);

        _context.restore();
    }

    function drawDoor(cellObject, fromX, fromY, toX, toY) {
        if (cellObject === "door") {
            drawDoorLine(cellObject, fromX, fromY, toX, toY, "#A8B1B8");
        } else if (cellObject === "magicDoor") {
            drawDoorLine(cellObject, fromX, fromY, toX, toY, "#FEB729");
        } else if (cellObject === "wall") {
            drawDoorLine(cellObject, fromX, fromY, toX, toY, "brown");
        }
    }

    function drawDoors(cell, currentX, currentY, cellWidth, cellHeight) {
        var leftX = currentX,
            rightX = currentX + cellWidth,
            topY = currentY,
            bottomY = currentY + cellHeight;

        drawDoor(cell.getNorth(), leftX, topY, rightX, topY);
        drawDoor(cell.getSouth(), leftX, bottomY, rightX, bottomY);
        drawDoor(cell.getEast(), rightX, topY, rightX, bottomY);
        drawDoor(cell.getWest(), leftX, topY, leftX, bottomY);
    }

    function drawHole(cell, currentX, currentY, cellWidth, cellHeight) {
        var items = cell.items(),
            iterator = items.iterator(0),
            item,
            ceilingColor = "#73AF59",
            floorColor = "magenta";

        while (iterator.hasNext()) {
            item = iterator.next();

            switch (item) {
                case "ceilingHole":
                    drawHoleRectangle(cell, currentX, currentY, cellWidth, cellHeight, ceilingColor);
                    break;
                case "ceilingLadder":
                    drawLadderRectangle(cell, currentX, currentY, cellWidth, cellHeight, ceilingColor);
                    break;
                case "floorHole":
                    drawHoleRectangle(cell, currentX, currentY, cellWidth, cellHeight, floorColor);
                    break;
                case "floorLadder":
                    drawLadderRectangle(cell, currentX, currentY, cellWidth, cellHeight, floorColor);
                    break;
            }
        }
    }

    function drawPlayer (facing, rowIndex, colIndex, cellWidth, cellHeight, color) {
        var widthMargin = cellWidth * 0.25,
            heightMargin = cellHeight * 0.25,
            middleX = (colIndex * cellWidth) + (cellWidth / 2),
            middleY = (rowIndex * cellHeight) + (cellHeight / 2),
            leftX = (colIndex * cellWidth) + widthMargin,
            rightX = leftX + (widthMargin * 2),
            topY = rowIndex * cellHeight + heightMargin,
            bottomY = topY + (heightMargin * 2);

        _context.save();
        _context.beginPath();

        _context.strokeStyle = color;
        _context.lineWidth = 2;

        switch (facing) {
            case "north":
                _context.moveTo(leftX, bottomY);
                _context.lineTo(middleX, topY);
                _context.lineTo(rightX, bottomY);
                break;
            case "south":
                _context.moveTo(leftX, topY);
                _context.lineTo(middleX, bottomY);
                _context.lineTo(rightX, topY);
                break;
            case "east":
                _context.moveTo(leftX, topY);
                _context.lineTo(rightX, middleY);
                _context.lineTo(leftX, bottomY);
                break;
            case "west":
                _context.moveTo(rightX, topY);
                _context.lineTo(leftX, middleY);
                _context.lineTo(rightX, bottomY);
                break;
        }

        _context.stroke();
        _context.closePath();
        _context.restore();
    }

    function drawMonsters(rowIndex, colIndex, cellWidth, cellHeight, color) {
        var widthMargin = cellWidth * 0.25,
            heightMargin = cellHeight * 0.25,
            leftX = (colIndex * cellWidth) + widthMargin,
            rightX = leftX + (widthMargin * 2),
            topY = rowIndex * cellHeight + heightMargin,
            bottomY = topY + (heightMargin * 2);

        _context.save();
        _context.beginPath();

        _context.strokeStyle = color;
        _context.lineWidth = 2;

        _context.moveTo(leftX, bottomY);
        _context.lineTo(rightX, topY);
        _context.moveTo(leftX, topY);
        _context.lineTo(rightX, bottomY);

        _context.stroke();

        _context.closePath();
        _context.restore();
    }

    function getMonsterColor(monsterNumber, forPath) {
        var step = 100,
            red = step * (monsterNumber - 1),
            green = 255 - (step * (monsterNumber - 1)),
            blue = step * (monsterNumber - 1),
            alpha = 1;

        if (forPath) {
            alpha = 0.5;
        }

        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }

    function drawMonsterPath(monsterQueue, canvasWidth, canvasHeight) {
        var monster,
            pathStack,
            pathArray,
            cell,
            index,
            pathLength,
            rowIndex,
            colIndex,
            cellWidth = Math.floor(canvasWidth / _cols),
            cellHeight = Math.floor(canvasHeight / _rows),
            cellWidthOffset = cellWidth / 4,
            cellHeightOffset = cellHeight / 4,
            currentX,
            currentY,
            monsterNumber = 0;

        _context.save();

        while (!monsterQueue.isEmpty()) {
            monsterNumber++;
            _context.fillStyle = getMonsterColor(monsterNumber, true);
            monster = monsterQueue.dequeue();

            pathStack = monster.getPathStackTowardPosition();

            if (pathStack) {
                pathArray = pathStack.toArray();
                pathLength = pathArray.length;

                for (index = 0; index < pathLength; index++) {
                    cell = pathArray[index];
                    rowIndex = cell.getRowIndex();
                    colIndex = cell.getColIndex();
                    currentY = rowIndex * cellHeight;
                    currentX = colIndex * cellWidth;

//                    if (pathObj.direction === "north" || pathObj.direction === "south") {
//                        _context.fillRect(currentX + cellWidthOffset, currentY, cellWidth / 4, cellHeight);
//                    } else {
//                        _context.fillRect(currentX, currentY + cellHeightOffset, cellWidth, cellHeight / 4);
//                    }
                    _context.fillRect(currentX + cellWidthOffset, currentY + cellHeightOffset, cellWidth / 2, cellHeight / 2);
                }
            }
        }
        _context.restore();
    }

    this.draw = function (currentLevel, foregroundColor, backgroundColor, canvasWidth, canvasHeight,
                          playerRowIndex, playerColIndex, playerFacing) {

        var level = _dungeonMatrix[currentLevel - 1],
            cell,
            rowIndex = 0,
            colIndex = 0,
            currentX = 0,
            currentY = 0,
            cellWidth = Math.floor(canvasWidth / _cols),
            cellHeight = Math.floor(canvasHeight / _rows),
            monsterQueue = new js_cols.Queue();

        _context.save();

        _context.fillStyle = foregroundColor;
        _context.fillRect(0, 0, canvasWidth, canvasHeight);

        for (rowIndex = 0; rowIndex < _rows; rowIndex++) {
            currentY = rowIndex * cellHeight;
            for (colIndex = 0; colIndex < _cols; colIndex++) {
                cell = level[rowIndex][colIndex];

                if (typeof cell === "object") {
                    currentX = colIndex * cellWidth;

                    if (cell.getIsValid()) {
                        _context.fillStyle = backgroundColor;
                    } else {
                        _context.fillStyle = "yellow";
                    }
                    _context.fillRect(currentX, currentY, cellWidth, cellHeight);

                    drawDoors(cell, currentX, currentY, cellWidth, cellHeight);
                    drawHole(cell, currentX, currentY, cellWidth, cellHeight);

                    if (cell.getMonster()) {
                        monsterQueue.enqueue(cell.getMonster());
                        drawMonsters(rowIndex, colIndex, cellWidth, cellHeight, getMonsterColor(monsterQueue.getCount(), false));
                    }
                }
            }
        }

        _context.restore();

        drawMonsterPath(monsterQueue, canvasWidth, canvasHeight);

        drawPlayer(playerFacing, playerRowIndex, playerColIndex, cellWidth, cellHeight, "orange");
    };
};