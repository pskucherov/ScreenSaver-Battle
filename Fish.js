/**
 * Создаём div-элемент рыбы
 * @param id   - id рыбы (и dom-элемента)
 * @param type - тип рыбы (FishTypes
 * @param posX - позиция для создания рыбы
 * @param posY - позиция для создания рыбы
 * @constructor
 */
function Fish(id, type, posX, posY) {
    
    this.consts = new Constants();
    
    id = +id;
    if ($('#fish-' + id).length) {
        throw new Error('Invalid fish id. (Fish with id ' + id + ' exists)');
    }

    if (!(type instanceof FishTypes)) {
        throw new Error('Invalid type');
    }

    if (typeof posX !== 'number' || typeof posY !== 'number') {
        throw new Error('Position can be only number');
    }

    if (posX < 1) {
        posX = 1;
    } else if (posX >= this.consts.SCREENWIDTH ) {
        posX = this.consts.SCREENWIDTH - 1;
    }
    if (posY < 1) {
        posY = 1;
    } else if (posY >= this.consts.SCREENHEIGHT ) {
        posY = this.consts.SCREENHEIGHT - 1;
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

/**
 * Действия рыбы-жертвы
 * @private
 */
Fish.prototype._stepOfPrey = function() {

};