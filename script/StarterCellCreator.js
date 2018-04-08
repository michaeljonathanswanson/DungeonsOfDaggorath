/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/12/12
 * Time: 9:35 PM
 * To change this template use File | Settings | File Templates.
 */
/*global StarterCellCreator: true, StarterCell: true */

StarterCellCreator = function (rows, cols, numberOfStarterCells) {
    'use strict';
    var _rows = rows,
        _cols = cols,
        _numberOfStarterCells = numberOfStarterCells,
        _starterCellsInDungeon = [];

    function getRandomNumber(maxNumber) {
        return Math.floor(Math.random() * (maxNumber + 1));
    }

    function containInAnyLevel(starterCellInLevel, rowIndex, colIndex) {
        var index = 0,
            length = starterCellInLevel.length;

        for (index = 0; index < length; index++) {
            if (starterCellInLevel[index].containsAnyCoordinates(rowIndex, colIndex)) {
                return true;
            }
        }

        return false;
    }

    function createNewStarterCell(starterCellsInLevel, holeLocation, holeType) {
        var rowIndex = 0,
            colIndex = 0;

        do {
            rowIndex = getRandomNumber(_rows - 1);
            colIndex = getRandomNumber(_cols - 1);
        } while (containInAnyLevel(starterCellsInLevel, rowIndex, colIndex));

        return new StarterCell(rowIndex, colIndex, holeLocation, holeType);
    }

    function setCeilingHoles(previousStarterCellsInLevel, starterCellInLevel) {
        var length = previousStarterCellsInLevel.length,
            index = 0,
            holeCounter = 0,
            currentStarterCell;

        for (index = 0; index < length; index++) {
            currentStarterCell = previousStarterCellsInLevel[index];

            if (currentStarterCell.getHoleLocation() === "floor") {
                starterCellInLevel[holeCounter] = new StarterCell(currentStarterCell.getRowIndex(), currentStarterCell.getColIndex(),
                    "ceiling", currentStarterCell.getStarterCellType());
                holeCounter++;
            }
        }


    }

    (function createHoles() {
        var starterCellsInLevel1 = [],
            starterCellsInLevel2 = [],
            starterCellsInLevel3 = [],
            starterCellsInLevel4 = [],
            starterCellsInLevel5 = [],
            index = 0;

        //Level 1
        starterCellsInLevel1[0] = createNewStarterCell(starterCellsInLevel1, "ceiling", "Hole");
        starterCellsInLevel1[1] = createNewStarterCell(starterCellsInLevel1, "floor", "Hole");
        starterCellsInLevel1[2] = createNewStarterCell(starterCellsInLevel1, "floor", "Hole");
        starterCellsInLevel1[3] = createNewStarterCell(starterCellsInLevel1, "floor", "Ladder");
        for (index = 4; index < numberOfStarterCells; index++) {
            starterCellsInLevel1[index] = createNewStarterCell(starterCellsInLevel1, "", "starterCell");
        }

        //Level 2
        setCeilingHoles(starterCellsInLevel1, starterCellsInLevel2);
        starterCellsInLevel2[3] = createNewStarterCell(starterCellsInLevel2, "floor", "Hole");
        starterCellsInLevel2[4] = createNewStarterCell(starterCellsInLevel2, "floor", "Hole");
        starterCellsInLevel2[5] = createNewStarterCell(starterCellsInLevel2, "floor", "Ladder");
        for (index = 6; index < numberOfStarterCells; index++) {
            starterCellsInLevel2[index] = createNewStarterCell(starterCellsInLevel2, "", "starterCell");
        }

        //Level 3
        setCeilingHoles(starterCellsInLevel2, starterCellsInLevel3);
        for (index = 3; index < numberOfStarterCells; index++) {
            starterCellsInLevel3[index] = createNewStarterCell(starterCellsInLevel3, "", "starterCell");
        }

        //Level 4
        starterCellsInLevel4[0] = createNewStarterCell(starterCellsInLevel4, "floor", "Hole");
        starterCellsInLevel4[1] = createNewStarterCell(starterCellsInLevel4, "floor", "Hole");
        starterCellsInLevel4[2] = createNewStarterCell(starterCellsInLevel4, "floor", "Ladder");
        for (index = 3; index < numberOfStarterCells; index++) {
            starterCellsInLevel4[index] = createNewStarterCell(starterCellsInLevel4, "", "starterCell");
        }

        //Level 5
        setCeilingHoles(starterCellsInLevel4, starterCellsInLevel5);
        for (index = 3; index < numberOfStarterCells; index++) {
            starterCellsInLevel5[index] = createNewStarterCell(starterCellsInLevel5, "", "starterCell");
        }

        _starterCellsInDungeon[0] = starterCellsInLevel1;
        _starterCellsInDungeon[1] = starterCellsInLevel2;
        _starterCellsInDungeon[2] = starterCellsInLevel3;
        _starterCellsInDungeon[3] = starterCellsInLevel4;
        _starterCellsInDungeon[4] = starterCellsInLevel5;
    }());

    this.getHolesInLevel = function (level) {
        return _starterCellsInDungeon[level - 1];
    };
};

