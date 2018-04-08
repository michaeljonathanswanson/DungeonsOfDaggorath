/**
 * Created with JetBrains WebStorm.
 * User: shannonaswanson
 * Date: 2/19/13
 * Time: 7:53 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/17/13
 * Time: 8:42 PM
 * To change this template use File | Settings | File Templates.
 */
/*global OneHandedShield: true, assetManager: true */

OneHandedShield = function(blackId, whiteId) {
    'use strict';
    var _blackId = blackId,
        _whiteId = whiteId,
        _offScreenCanvas = document.createElement('canvas'),
        _width,
        _height,
        _img = new Image();

    this.initialize = function(canvasWidth, canvasHeight) {
        _width = canvasWidth;
        _height = canvasHeight;
        _offScreenCanvas.width = _width;
        _offScreenCanvas.height = _height;
    };

    function setImage(foregroundColor) {
        if (foregroundColor === 'black') {
            _img = assetManager.getAsset(_blackId);
        } else {
            _img = assetManager.getAsset(_whiteId);
        }
    }

    this.renderRightHand = function(foregroundColor) {

    };

    this.renderItemOnFloor = function(context, foregroundColor, dimension, alphaLevel) {
        var scale = 0.25 * dimension.distanceRatio,
            x = dimension.widthMargin,
            y = dimension.canvasHeight - dimension.heightMargin;

        setImage(foregroundColor);
        context.save();
        context.globalAlpha = alphaLevel;
        context.drawImage(_img, 0, 0, _img.width, _img.height,
            x, y, _img.width * scale, _img.height * scale);
        context.restore();
    };

    this.renderAttack = function() {

    };

};

//'cellWidth' : cellWidth,
//    'cellHeight' : cellHeight,
//    'widthMargin' : widthMargin,
//    'heightMargin' : heightMargin,
//    'canvasWidth' : canvasWidth,
//    'canvasHeight' : canvasHeight,
//    'distanceRatio' : distanceRatio