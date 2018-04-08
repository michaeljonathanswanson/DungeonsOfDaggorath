/**
 * Created with JetBrains WebStorm.
 * User: Shannon
 * Date: 7/24/12
 * Time: 6:49 PM
 * To change this template use File | Settings | File Templates.
 */
/*global DrawEffects: true */

DrawEffects = function () {
    'use strict';


//    function getPosition(startPosition, centerPosition) {
//        var offset = (((centerPosition - startPosition) / _life) * _decay) + (Math.random() * _decay);
//
//        if (startPosition < centerPosition) {
//            return centerPosition - offset;
//        } else {
//            return centerPosition + offset;
//        }
//
//    }


};

DrawEffects.drawParticlesGlow = function (context, startX, startY, totalDistanceUp, particleRadius,
                                          effectsStartColor, effectsEndColor) {
    'use strict';
    var getGlowX = function (startX, radius) {
            var rndNumber = Math.random(),
                sign = 1;

            if (rndNumber < 0.5) {
                sign = -1;
            }

            rndNumber = Math.random() * radius;

            return (rndNumber * sign) + startX;
        },
        getGlowY = function (startY, distanceUpUnit) {
            var rndNumber = Math.random();

            return startY - (rndNumber * distanceUpUnit);
        },
        x = getGlowX(startX, particleRadius),
        y = getGlowY(startY, totalDistanceUp),
        radialGradient;

    radialGradient = context.createRadialGradient(x, y, 1, x, y, particleRadius);
    radialGradient.addColorStop(0, effectsStartColor);
    radialGradient.addColorStop(1, effectsEndColor);
    context.beginPath();
    context.globalAlpha = 0.1;
    context.fillStyle = radialGradient;
    context.arc(x, y, particleRadius, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
    context.globalAlpha = 1;
};

DrawEffects.drawLineGlowEffect = function (context, leftMostX, startY, rightMostX, endY, numberOfCellsAwayFromPlayer,
                                           yDirection, totalDistanceUp, particleRadius, effectsStartColor,
                                           effectsEndColor, particleStep) {
    'use strict';

    var slope = (startY - endY) / (leftMostX - rightMostX),
        effectsX = leftMostX,
        effectsY = startY,
        particleRadiusByDistance = particleRadius - (numberOfCellsAwayFromPlayer / 2),
        particleIndex = 0;

    while (effectsX < rightMostX) {
        effectsX = leftMostX + particleIndex;
        effectsY = startY + (yDirection * Math.abs(slope * particleIndex));
        particleIndex += particleStep;
        DrawEffects.drawParticlesGlow(context, effectsX, effectsY, totalDistanceUp, particleRadiusByDistance, effectsStartColor, effectsEndColor);
    }
};
