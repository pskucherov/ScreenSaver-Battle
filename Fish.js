function Fish(id, type, posX, posY) {
    var screenWidth = $(window).width()
        , screenHeigth = $(window).height();
    id = +id;
    if ($('#fish-' + id).length) {
        throw new Error('Invalid fish id. (Fish with id ' + id + ' exists)');
    }

    if (typeof posX !== 'number' || typeof posY !== 'number') {
        throw new Error('Position can be only number');
    }

    if (posX < 1) {
        posX = 1;
    } else if (posX >= screenWidth ) {
        posX = screenWidth - 1;
    }
    if (posY < 1) {
        posY = 1;
    } else if (posY >= screenHeigth ) {
        posY = screenHeigth - 1;
    }

    this.id   = id;
    this.type = type;
    this._createFish(posX, posY);

}

Fish.prototype._createFish = function(x, y) {
    var div = $('<div>', {
           id: 'fish-' + this.id,
        class: 'fish',
        style: 'border-color: ' + this.type.color + '; top: ' + y + 'px; left: ' + x + 'px;'
    });

    $('body').append(div);
};