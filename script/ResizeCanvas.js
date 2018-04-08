/*global ResizeCanvas: true, $: true */

ResizeCanvas = function (context, updateSizeDelegate) {
    'use strict';
    var _context = context,
        _updateSizeDelegate = updateSizeDelegate,
        _defaultHeight = 600,
        _defaultWidth = 800,
        _defaultWidthHeightRatio = _defaultWidth / _defaultHeight,
        _canvasHeight = context.canvas.height,
        _canvasWidth = context.canvas.width;

    this.resizeCanvas = function () {
        var windowWidthHeightRatio,
            topMargin = 0,
            leftMargin = 0,
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            _canvasHeight = windowHeight,
            _canvasWidth = windowWidth;

        windowWidthHeightRatio = windowWidth / windowHeight;

        if (windowWidthHeightRatio > _defaultWidthHeightRatio) {
            //width is too large
            _canvasWidth = _canvasHeight * _defaultWidthHeightRatio;
            leftMargin = (windowWidth - _canvasWidth) / 2;
        } else if (windowWidthHeightRatio < _defaultWidthHeightRatio) {
            //height is too large
            _canvasHeight = _canvasWidth / _defaultWidthHeightRatio;
            topMargin = (windowHeight - _canvasHeight) / 2;
        }

        $('#mainCanvas').css({position: "absolute", top: topMargin + "px", left: leftMargin + "px"});
        _context.canvas.height = _canvasHeight;
        _context.canvas.width = _canvasWidth;
        _updateSizeDelegate(_canvasWidth, _canvasHeight);
    };

    this.getCanvasWidth = function() {
        return _canvasWidth;
    };

    this.getCanvasHeight = function() {
        return _canvasHeight;
    };
};