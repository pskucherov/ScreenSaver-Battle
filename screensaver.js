
window.onload = function () {

    var fishType = []
        , bttl = new Battle()
        , consts = new Constants()
        , screenWidth  = consts.SCREENWIDTH
        , screenHeight = consts.SCREENHEIGHT
        , xOffset = parseInt(screenWidth / 5, 10)
        , yOffset = parseInt(screenHeight / 5, 10)
    ;

    fishType.push(new FishTypes('red',   1000, 40, 5000,  1,   2, 100));
    fishType.push(new FishTypes('blue',    30, 50,  500, -1, 1.4,  35));
    fishType.push(new FishTypes('green',  150, 50, 1500, -1, 1.8,  50));
    fishType.push(new FishTypes('yellow', 300, 15, 1500, -1, 1.97, 50));

    bttl.addPredator(new Fish(bttl.getNewFishId(), fishType[0], xOffset, (screenHeight - yOffset) ));
    bttl.addPrey(new Fish(bttl.getNewFishId(), fishType[1], (screenWidth - xOffset), (screenHeight - yOffset) ));
    bttl.addPrey(new Fish(bttl.getNewFishId(), fishType[2], (screenWidth - xOffset), yOffset));
    bttl.addPrey(new Fish(bttl.getNewFishId(), fishType[3], xOffset, yOffset));

    setInterval( function() {
        bttl.stepOfLife();
    }, 10);

};
