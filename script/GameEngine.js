/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/2/12
 * Time: 9:52 PM
 * To change this template use File | Settings | File Templates.
 */
/*global GameEngine: true, $: true, js_cols: true, Compiler: true, Cell: true, DrawCell: true, Action: true, DrawTurnAnimation: true, DrawEffects: true, Enum: true, SoundHelper: true, distanceRatio: true, distanceRatioPlusQuarter: true */

GameEngine = function (context, canvasHeight, canvasWidth, compiler, drawCell, dungeonEngine, drawMap, drawTurnAnimation,
                       drawHitWall, drawHelper, gameSaver) {
    'use strict';
    var _context = context,
        _canvasHeight = canvasHeight,
        _canvasWidth = canvasWidth,
        _compiler = compiler,
        _drawCell = drawCell,
        _dungeonEngine = dungeonEngine,
        _player = _dungeonEngine.getPlayer(),
        _drawMap = drawMap,
        _drawTurnAnimation = drawTurnAnimation,
        _drawHitWall = drawHitWall,
        _drawHelper = drawHelper,
        _gameSaver = gameSaver,
        _topStatusBar,
        _heightText,
        _topTextArea,
        _foregroundColor = 'white',
        _backgroundColor = 'black',
        _shouldDrawMap = false,
        _bufferSize = 50,
        _inputBuffer = ['', '', '', ''],
        _fontSize = 14,
        _numberOfTimeUnitsToWait = 0,
        _globalTimeUnitDelay = 20,
        _doesPlayerHitFrontWall = false,
        _doesPlayerHitLeftWall = false,
        _doesPlayerHitRightWall = false,
        _doesPlayerHitBackWall = false,
        _actionQueue = new js_cols.Queue(),
        _currentCell,
        _lastTime = $.now(),
        _currentTime,
        _numberOfFrames = 0,
        _timeDelta;

    function initialize() {
        _topStatusBar = _canvasHeight * 0.8;
        _heightText = _canvasHeight / 20;
        _topTextArea = _topStatusBar + _heightText;
    }

    function getConsoleIndex() {
        return (_bufferSize - Math.round(_heightText / 8));
    }

    function swapColors() {
        var tempColor = _foregroundColor;
        _foregroundColor = _backgroundColor;
        _backgroundColor = tempColor;
    }

    function clearCanvas() {
        _context.clearRect(0, 0, _canvasWidth, _canvasHeight);
    }

    function drawBackground() {
        _context.fillStyle = _backgroundColor;
        _context.fillRect(0, 0, _canvasWidth, _canvasHeight);
    }

    function drawCells(activeTorch) {
        var cellsToDraw = _dungeonEngine.getWhatThePlayerSees(),
            iterator = cellsToDraw.iterator(0),
            itemIterator,
            currentCell,
            playerFacing = _dungeonEngine.getPlayerFacingDirection(),
            cellsAwayFromPlayer = cellsToDraw.getCount(),
            monster,
            canvasWidth = _canvasWidth,
            canvasHeight = _topStatusBar,
            items,
            item,
            dimension;

        if (_doesPlayerHitLeftWall) {
            canvasWidth += 50;
        } else if (_doesPlayerHitRightWall) {
            canvasWidth -= 50;
        } else if (_doesPlayerHitBackWall) {
            canvasHeight -= 50;
        }


        //TODO YOU NEED TO DRAW THINGS FARTHEST AWAY FIRST


        while (iterator.hasNext()) {
            cellsAwayFromPlayer--;
            currentCell = iterator.next();
            monster = currentCell.getMonster();

            if (cellsAwayFromPlayer === 0) {
                _currentCell = currentCell;
            }

            if (monster && monster.getIsDeathAnimationDone()) {
                currentCell.setMonster(undefined);
            }

            items = currentCell.items();
            itemIterator = items.iterator(0);
            dimension = _drawHelper.calcDims(canvasWidth, canvasHeight, distanceRatioPlusHalf[cellsAwayFromPlayer]); // distanceRatioPlusQuarter[cellsAwayFromPlayer]);

//            while (itemIterator.hasNext()) {
//                item = itemIterator.next();
//
//                if (item && typeof item.renderItemOnFloor === 'function') {
//                    //activeTorch.getAlphaLevel(currentDistanceRatio);
//                    item.renderItemOnFloor(_context, _foregroundColor, dimension);
//                }
//            }

            _drawCell.drawCell(playerFacing, currentCell, _context, cellsAwayFromPlayer,
                _foregroundColor, _backgroundColor, canvasWidth, canvasHeight, _canvasWidth, _topStatusBar,
                activeTorch);
        }

        if (_doesPlayerHitLeftWall || _doesPlayerHitRightWall || _doesPlayerHitBackWall) {
            _drawHitWall.drawHitFrontWall(_context, _canvasWidth, _topStatusBar);
        }
    }

    function drawTurningAnimation() {
        var transitionPercentage = _dungeonEngine.getTransitionPercentage();

        if (_dungeonEngine.getNeedTurnLeftTransition()) {
            _drawTurnAnimation.drawTurnAnimation(_context, _foregroundColor, _canvasWidth, _topStatusBar, transitionPercentage);
        } else if (_dungeonEngine.getNeedTurnRightTransition()) {
            _drawTurnAnimation.drawTurnAnimation(_context, _foregroundColor, _canvasWidth, _topStatusBar, 1 - transitionPercentage);
        } else if (_dungeonEngine.getNeedTurnAroundTransition()) {
            _drawTurnAnimation.drawTurnAnimation(_context, _foregroundColor, _canvasWidth, _topStatusBar, 1 - transitionPercentage);
        }
    }

    function drawForeground(activeTorch) {
        if (_dungeonEngine.getNeedTurnTransition()) {
            drawTurningAnimation();
        } else {
            if (_doesPlayerHitFrontWall) {
                _drawHitWall.drawHitFrontWall(_context, _canvasWidth, _topStatusBar);
            } else {
                drawCells(activeTorch);
            }
        }
    }

    function drawStatusBarText() {
        var index = 0,
            statusBarMiddle = _topStatusBar + (_heightText / 2),
            topOffset = _fontSize + 8;

        _context.fillStyle = _backgroundColor;
        _context.font = _fontSize + 'pt Arial';
        _context.textAlign = "left";
        _context.textBaseline = 'middle';

        //draw left hand
        _context.fillText(_dungeonEngine.getPlayerLeftHandText(), 0, statusBarMiddle);

        //draw right hand
        _context.textAlign = "right";
        _context.fillText(_dungeonEngine.getPlayerRightHandText(), _canvasWidth, statusBarMiddle);
    }

    function drawInputText() {
        var index = 0,
            counter = 0,
            topOffset = _fontSize + 8;

        _context.fillStyle = _backgroundColor;
        _context.fillRect(0, _topTextArea, _canvasWidth, _canvasHeight - _topTextArea);

        _context.fillStyle = _foregroundColor;
        _context.font = _fontSize + 'pt Arial';
        _context.textBaseline = 'top';
        _context.textAlign = "left";

        for (index = getConsoleIndex(); index < _bufferSize; index++) {
            if (_inputBuffer[index]) {
                _context.fillText(_inputBuffer[index], 0, _topTextArea + (topOffset * counter));
                counter++;
            }
        }
    }

    function drawStatusBar() {
        _context.fillStyle = _foregroundColor;
        _context.fillRect(0, _topStatusBar, _canvasWidth, _heightText);
    }

    function addToBuffer(userInput) {
        var index = 0;
        _inputBuffer[_bufferSize - 1] = userInput;

        for (index = getConsoleIndex(); index <= _bufferSize; index++) {
            _inputBuffer[index - 1] = _inputBuffer[index];
        }

        _inputBuffer[_bufferSize - 1] = '_';
    }

    function enqueueAction() {
        if (_compiler.wasCarriageReturnPressed()) {
            _actionQueue.enqueue(_compiler.getAction());
        }
    }

    function drawItemsInHand() {
        var rightHandImage = _dungeonEngine.getPlayerRightHandImage(_foregroundColor),
            leftHandImage = _dungeonEngine.getPlayerLeftHandImage(_foregroundColor);

        if (rightHandImage) {
            _context.drawImage(rightHandImage, _canvasWidth - rightHandImage.width, _topStatusBar - rightHandImage.height);
        }

        if (leftHandImage) {
            _context.save();
            _context.translate(_canvasWidth, 0);
            _context.scale(-1, 1);
            _context.drawImage(leftHandImage, _canvasWidth - leftHandImage.width, _topStatusBar - leftHandImage.height);
            _context.restore();
        }
    }

    function attack(attackType, monster) {
        var outcomeLeft = Enum.AttackOutcome.DODGE,
            outcomeRight = Enum.AttackOutcome.DODGE,
            leftAttackPower = -1,
            rightAttackPower = -1,
            playSound = true,
            returnText = "";

        if (attackType === Enum.AttackType.LEFT) {
            leftAttackPower = _player.attackLeft(false);
        } else if (attackType === Enum.AttackType.RIGHT) {
            rightAttackPower = _player.attackRight(false);
        } else if (attackType === Enum.AttackType.BOTH) {
            leftAttackPower = _player.attackLeft(true);
            rightAttackPower = _player.attackRight(true);
        }

        if (_player.getPlayerAttackedWithShield()) {
            _dungeonEngine.setTowardPositions();
            SoundHelper.prototype.playRandomShieldHit();
            playSound = false;
        }

        if (monster) {
            if (leftAttackPower > 0) {
                outcomeLeft = monster.playerAttacks(true, leftAttackPower, playSound);
            }

            if (rightAttackPower > 0) {
                outcomeRight = monster.playerAttacks(false, rightAttackPower, playSound);
            }

            if (outcomeLeft.value > 0 || outcomeRight.value > 0) {
                returnText = " !!!";

                if (monster.isDead()) {
                    _player.addExperience(monster.getExperience());
                }
            }
        } else if (playSound) {
            SoundHelper.prototype.playRandomMiss();
        }

        return returnText;
    }

    function validateAction() {
        var action = {},
            userInput = '',
            attackOutcome;

        if (!_actionQueue.isEmpty()) {
            action = _actionQueue.dequeue();
            userInput = action.getUserInput();

            if (action.isValidAction()) {
                _numberOfTimeUnitsToWait = _globalTimeUnitDelay;

                switch (action.getActionName()) {
                    case "map":
                        _shouldDrawMap = true;
                        break;
                    case "look":

                        break;
                    case "climb down":
                        _dungeonEngine.climbDown();
                        swapColors();
                        break;
                    case "climb up":
                        _dungeonEngine.climbUp();
                        swapColors();
                        break;
                    case "move":
                        _doesPlayerHitFrontWall = !_dungeonEngine.move();
                        break;
                    case "move left":
                        _doesPlayerHitLeftWall = !_dungeonEngine.moveLeft();
                        break;
                    case "move right":
                        _doesPlayerHitRightWall = !_dungeonEngine.moveRight();
                        break;
                    case "move back":
                        _doesPlayerHitBackWall = !_dungeonEngine.moveBack();
                        break;
                    case "turn left":
                        _dungeonEngine.turnLeft();
                        break;
                    case "turn right":
                        _dungeonEngine.turnRight();
                        break;
                    case "turn around":
                        _dungeonEngine.turnAround();
                        break;
                    case "attack left":
                        userInput += attackOutcome = attack(Enum.AttackType.LEFT, _currentCell.getMonster());
                        break;
                    case "attack right":
                        userInput += attack(Enum.AttackType.RIGHT, _currentCell.getMonster());
                        break;
                    case "attack both":
                        userInput += attack(Enum.AttackType.BOTH, _currentCell.getMonster());
                        break;
                    case "drop left":
                        _dungeonEngine.dropLeft();
                        break;
                    case "drop right":
                        _dungeonEngine.dropRight();
                        break;
                    case "stow left":
                        _dungeonEngine.stowLeftItem();
                        break;
                    case "stow right":
                        _dungeonEngine.stowRightItem();
                        break;
                    case "get left":
                        _dungeonEngine.getLeftItemFromFloor(action.getUserInput());
                        break;
                    case "get right":
                        _dungeonEngine.getRightItemFromFloor(action.getUserInput());
                        break;
                    case "pull left":
                        _dungeonEngine.pullLeftItem(action.getUserInput());
                        break;
                    case "pull right":
                        _dungeonEngine.pullRightItem(action.getUserInput());
                        break;
                    case "save":
                        _gameSaver.save(userInput, _dungeonEngine.getCurrentLevel());
                        break;
                    case "load":
                        debugger;
                        break;
                }
                addToBuffer(userInput);
            } else {
                if (_shouldDrawMap) {
                    _shouldDrawMap = false;
                } else {
                    addToBuffer(userInput + ' ???');
                }
            }
        } else {
            _inputBuffer[_bufferSize - 1] = _compiler.getUserInput() + '_';
        }
    }

    this.doKeyDown = function (e) {
        if (_compiler.doKeyDown(e.keyCode)) {
            e.preventDefault();
        }
    };

    this.drawScreen = function () {
        var activeTorch = _dungeonEngine.getActiveTorch();

        _numberOfFrames++;
        _currentTime = $.now();
        _timeDelta = _currentTime - _lastTime;

        if (_timeDelta >= 1000) {
            $('#frameRate').text((1000 / (_timeDelta)) * _numberOfFrames);
            _numberOfFrames = 0;
            _lastTime = _currentTime;
            activeTorch.updateTorchUsage();
        }

        clearCanvas();

        enqueueAction();

        if (_numberOfTimeUnitsToWait === 0) {
            _dungeonEngine.moveMonsters();
            validateAction();
        } else {
            _numberOfTimeUnitsToWait--;

            if (_numberOfTimeUnitsToWait === _globalTimeUnitDelay / 2) {
                _doesPlayerHitFrontWall = false;
                _doesPlayerHitLeftWall = false;
                _doesPlayerHitRightWall = false;
                _doesPlayerHitBackWall = false;
            }
        }

        if (_shouldDrawMap) {
            _drawMap.draw(_dungeonEngine.getCurrentLevel(), _foregroundColor, _backgroundColor,
                _canvasWidth, _canvasHeight, _dungeonEngine.getPlayerRowIndex(), _dungeonEngine.getPlayerColIndex(),
                _dungeonEngine.getPlayerFacingDirection());
        } else {
            drawBackground();
            drawForeground(activeTorch);
            drawStatusBar();
            drawStatusBarText();
            drawInputText();
            drawItemsInHand();
        }
    };

    this.updateSize = function(newWidth, newHeight) {
        _canvasWidth = newWidth;
        _canvasHeight = newHeight;
        initialize();
    };
};
