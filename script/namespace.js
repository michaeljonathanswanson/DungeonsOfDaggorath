/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/4/12
 * Time: 9:02 PM
 * To change this template use File | Settings | File Templates.
 */

var Dod = Dod || {},
    Enum = Dod.Enum,
    ItemHelper = Dod.ItemHelper,
    ResizeCanvas = Dod.ResizeCanvas,
    GameEngine = Dod.GameEngine,
    DungeonEngine = Dod.DungeonEngine,
    MonsterEngine = Dod.MonsterEngine,
    GameSaver = Dod.GameSaver,
    Compiler = Dod.Compiler,
    DungeonGenerator = Dod.DungeonGenerator,
    Action = Dod.Action,
    CreateActions = Dod.CreateActions,
    Cell = Dod.Cell,
    StarterCell = Dod.StarterCell,
    StarterCellCreator = Dod.StarterCellCreator,
    DrawHitWall = Dod.DrawHitWall,
    DrawTurnAnimation = Dod.DrawTurnAnimation,
    DrawCell = Dod.DrawCell,
    DrawHelper = Dod.DrawHelper,
    SoundHelper = Dod.SoundHelper,
    DrawWall = Dod.DrawWall,
    DrawDoor = Dod.DrawDoor,
    DrawMagicDoor = Dod.DrawMagicDoor,
    DrawHole = Dod.DrawHole,
    DrawLadder = Dod.DrawLadder,
    DrawMap = Dod.DrawMap,
    DrawEffects = Dod.DrawEffects,
    MagicDoor = Dod.MagicDoor,
    Player = Dod.Player,
    AssetManager = Dod.AssetManager,
    PineTorch = Dod.PineTorch,
    ShortSword = Dod.ShortSword,
    HeaterShield = Dod.HeaterShield,
    Torch = Dod.Torch,
    OneHandedSword = Dod.OneHandedSword,
    OneHandedShield = Dod.OneHandedShield,
    Sword = Dod.Sword,
    Shield = Dod.Shield,
    SmilingBlob = Dod.SmilingBlob,
    Monster = Dod.Monster,
    MonstersLevel1 = Dod.MonstersLevel1,
    MonstersLevel2 = Dod.MonstersLevel2,
    MonstersLevel3 = Dod.MonstersLevel3,
    MonstersLevel4 = Dod.MonstersLevel4,
    MonstersLevel5 = Dod.MonstersLevel5,
    MonsterLevelFactory = Dod.MonsterLevelFactory,
    MonsterGenerator = Dod.MonsterGenerator,
    distanceRatio = Dod.distanceRatio,
    distanceRatioPlusHalf = Dod.distanceRatioPlusHalf,
    distanceRatioPlusQuarter = Dod.distanceRatioPlusQuarter,
    distanceRatioPlus3Quarter = Dod.distanceRatioPlus3Quarter;

Dod.namespace = function (ns_string) {
    'use strict';
    var parts = ns_string.split('.'),
        parent = Dod,
        i;

    //strip redundant leading global
    if (parts[0] === "Dod") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        //created a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

Dod.namespace('DungeonsOfDaggorath2012');
