/**
 * Created with JetBrains WebStorm.
 * User: shannonaswanson
 * Date: 2/5/13
 * Time: 9:49 PM
 * To change this template use File | Settings | File Templates.
 */
/*global ItemHelper: true */

ItemHelper = function() { 'use strict'; };

ItemHelper.foundItem = function(userInput, acceptableKeyWords) {
    'use strict';
    var length = acceptableKeyWords.length,
        index = 0;

    while (index < length) {
        if (userInput && userInput.indexOf(acceptableKeyWords[index]) > 1) {
            return true;
        }

        index++;
    }

    return false;
};

ItemHelper.removeItem = function (userInput, items) {
    'use strict';
    var iterator = items.iterator(0),
        item,
        acceptableKeyWords,
        foundIt = false;

    if (items && !items.isEmpty()) {
        while (iterator.hasNext()) {
            item = iterator.next();

            if (typeof item.getAcceptableRevealedKeyWords === "function") {
                acceptableKeyWords = item.getAcceptableRevealedKeyWords();
                if (ItemHelper.foundItem(userInput, acceptableKeyWords)) {
                    iterator.remove();
                    return item;
                }
            }

            if (typeof item.getAcceptableKeyWords === "function") {
                acceptableKeyWords = item.getAcceptableKeyWords();
                if (ItemHelper.foundItem(userInput, acceptableKeyWords)) {
                    iterator.remove();
                    return item;
                }
            }
        }
    }

    return undefined;
};


