/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/1/12
 * Time: 2:35 PM
 * To change this template use File | Settings | File Templates.
 */
/*global $: true, createjs: true, GameEngine: true, js_cols: true, Enum: true, ResizeCanvas: true, Compiler: true, DrawCell: true, DrawHelper: true, GameSaver: true, CreateActions: true, DungeonGenerator: true, DungeonEngine: true, MonsterEngine: true, DrawMap: true, DrawTurnAnimation: true, DrawHitWall, StarterCellCreator: true, PineTorch: true, Torch: true, Sword: true, Player: true, distanceRatio: true, distanceRatioPlusHalf: true, distanceRatioPlusQuarter: true, distanceRatioPlus3Quarter: true, AssetManager: true, OneHandedSword: true, ShortSword: true, Shield: true, HeaterShield: true */

var gameEngine = {},
    assetManager = {};
js_cols.require("js_cols.LinkedList");
js_cols.require("js_cols.Stack");
js_cols.require("js_cols.Queue");
js_cols.require("js_cols.HashSet");
js_cols.require("js_cols.ABTreeMap");

function initialize() {
    'use strict';
    var currentLevel = 1,
        rows = 30,
        cols = 30,
        //canvas = document.getElementById('main'),
        canvas = $('#mainCanvas')[0],
        context = canvas.getContext('2d'),
        resizeCanvas,
        canvasHeight = canvas.clientHeight,
        canvasWidth = canvas.clientWidth,
        levelHoleHelper = new StarterCellCreator(rows, cols, 10),
        level1Holes = levelHoleHelper.getHolesInLevel(currentLevel),
        dungeonGenerator = new DungeonGenerator(),
        dungeonMatrix = dungeonGenerator.createDungeon(rows, cols, 5, levelHoleHelper),
        playerFacing = "north",
        activeTorch = new Torch(new PineTorch()),
        rightHand = new Sword(new ShortSword(), true),
        leftHand = new Shield(new HeaterShield(), true),
        itemsInBackpack = new js_cols.LinkedList(),
    //new Player(experience, rowIndex, colIndex, facing, leftHand, rightHand, activeTorch, itemsInBackpack),
        player = new Player(0, level1Holes[0].getRowIndex(), level1Holes[0].getColIndex(), playerFacing, leftHand,
            rightHand, activeTorch, itemsInBackpack),
        transitionLength = 15,
        dungeonEngine = new DungeonEngine(dungeonMatrix, player, currentLevel, transitionLength),
        //gameSaver = new GameSaver(dungeonMatrix, player),
        createActions = new CreateActions(),
        actions = createActions.getActions(),
        compiler = new Compiler(actions),
        drawHelper = new DrawHelper(),
        drawCell = new DrawCell(drawHelper),
        drawMap = new DrawMap(dungeonMatrix, rows, cols, context),
        drawHitWall = new DrawHitWall(),
        drawTurnAnimation = new DrawTurnAnimation(drawHelper);

        assetManager = new AssetManager();

    distanceRatio = [1, 0.75, 0.55, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05];
    distanceRatioPlusHalf = [0.875, 0.65, 0.475, 0.35, 0.275, 0.225, 0.175, 0.125, 0.075, 0.025];
    distanceRatioPlusQuarter = [0.9375, 0.70, 0.5125, 0.375, 0.2875, 0.2375, 0.1875, 0.1375, 0.0875, 0.0375];
    distanceRatioPlus3Quarter = [0.8125, 0.6, 0.4375, 0.325, 0.2625, 0.2125, 0.1625, 0.1125, 0.0625, 0.0125];

    gameEngine = new GameEngine(context, canvasHeight, canvasWidth, compiler, drawCell, dungeonEngine,
        drawMap, drawTurnAnimation, drawHitWall, drawHelper);
    resizeCanvas = new ResizeCanvas(context, gameEngine.updateSize);

    //window.addEventListener('keydown', gameEngine.doKeyDown, true);
    $(window).keydown(gameEngine.doKeyDown);

    resizeCanvas.resizeCanvas();
    $(window).resize(resizeCanvas.resizeCanvas);
}

window.requestAnimFrame = (function(callback) {
    'use strict';
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

function gameLoop() {
    'use strict';
    gameEngine.drawScreen();

    window.requestAnimFrame(gameLoop);
}

function preLoadAssets() {
    'use strict';
    var preLoader,
        assetPath = "assets/",
        manifest = [
            {src:assetPath+"SwordMiss1.ogg", id:"SwordMiss1"},
            {src:assetPath+"SwordMiss2.ogg", id:"SwordMiss2"},
            {src:assetPath+"SwordMiss3.ogg", id:"SwordMiss3"},
            {src:assetPath+"ShieldHit1.ogg", id:"ShieldHit1"},
            {src:assetPath+"ShieldHit2.ogg", id:"ShieldHit2"},
            {src:assetPath+"SwordHitBlob.ogg", id:"SwordHitBlob"},
            {src:assetPath+"BlobDeath.ogg", id:"BlobDeath"},
            {src:assetPath+"shortSwordBlack.png", id:"ShortSwordBlack"},
            {src:assetPath+"shortSwordWhite.png", id:"ShortSwordWhite"},
            {src:assetPath+"heaterShieldBlack.png", id:"HeaterShieldBlack"},
            {src:assetPath+"heaterShieldWhite.png", id:"HeaterShieldWhite"}
        ];

    preLoader = new createjs.PreloadJS();
    //preLoader.onProgress = handleProgress;
    preLoader.onComplete = gameLoop;
    preLoader.installPlugin(createjs.SoundJS);
    preLoader.loadManifest(manifest);
    assetManager.setLoader(preLoader);
}

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    initialize();
    preLoadAssets();
});



