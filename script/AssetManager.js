/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 1/17/13
 * Time: 9:04 PM
 * To change this template use File | Settings | File Templates.
 */
/*global AssetManager: true */

AssetManager = function() {
    'use strict';
    var _preLoader;

    this.setLoader = function(preLoader) {
        _preLoader = preLoader;
    };

    this.getAsset = function(id) {
        return _preLoader.getResult(id).result;
    };

};