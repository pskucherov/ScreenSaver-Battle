
window.onload = function () {

    var fishType = []
        , bttl = new Battle()
        , consts = new Constants()
        , screenWidth  = consts.SCREENWIDTH
        , screenHeight = consts.SCREENHEIGHT
        , xOffset = parseInt(screenWidth / 5, 10)
        , yOffset = parseInt(screenHeight / 5, 10)
    ;

    //отвязать всех рыб откурсора
    $(window).on('click', function(e) {
        $(window).unbind('mousemove');
    });

    //создание типов рыб
    fishType.push(new FishTypes('red',   1000, 40, 3000,  1,   2, 100));
    fishType.push(new FishTypes('blue',    30, 50,  500, -1, 1.4,  35));
    fishType.push(new FishTypes('green',  150, 50, 1500, -1, 1.8,  50));
    fishType.push(new FishTypes('yellow', 300, 15, 1500, -1, 1.97, 50));

    //расстановка рыб на экране
    bttl.addPredator(new Predator(bttl.getNewFishId(), fishType[0], xOffset, (screenHeight - yOffset) ));
    bttl.addPrey(new Prey(bttl.getNewFishId(), fishType[1], (screenWidth - xOffset), (screenHeight - yOffset) ));
    bttl.addPrey(new Prey(bttl.getNewFishId(), fishType[2], (screenWidth - xOffset), yOffset));
    bttl.addPrey(new Prey(bttl.getNewFishId(), fishType[3], xOffset, yOffset));

    //Битва
    function animate() {
        requestAnimationFrame(animate);
        bttl.stepOfLife();
    }
    animate();

    /*
    setInterval( function() {
        bttl.stepOfLife();
    }, 1);
    */

};



//http://habrahabr.ru/post/114358/
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
    })();
}

function extend(Child, Parent) {
    var F = function() { }
    F.prototype = Parent.prototype
    Child.prototype = new F()
    Child.prototype.constructor = Child
    Child.superclass = Parent.prototype
}

