/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/8/12
 * Time: 3:40 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawHelper: true */

DrawHelper = function () {
    'use strict';
    this.calcDims = function (canvasWidth, canvasHeight, distanceRatio) {
        var cellWidth = canvasWidth * distanceRatio,
            cellHeight = canvasHeight * distanceRatio,
            widthMargin = (canvasWidth - cellWidth) / 2,
            heightMargin = (canvasHeight - cellHeight) / 2;

        return {
            'cellWidth' : cellWidth,
            'cellHeight' : cellHeight,
            'widthMargin' : widthMargin,
            'heightMargin' : heightMargin,
            'canvasWidth' : canvasWidth,
            'canvasHeight' : canvasHeight,
            'distanceRatio' : distanceRatio
        };
    };
};