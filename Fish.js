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

    this.id   = id;
    this.type = type;
    this.x    = posX;
    this.y    = posY;

    this.deltaX = 0;
    this.deltaY = 0;
    this.oldDeltaX = this.consts.rand();
    this.oldDeltaY = this.consts.rand();

    this.status     = 1; //Статус рыбы (1 - всё спокойно, 2 - возбуждена, т.к. видит жертву/хищника)
    this.lifeStep   = 0; //Сделано шагов
    this.lastReprod = 0; //Прошло шагов после размножения
    this.hunger     = 0; //Рыба поела

    this.divElemCache = null;

    this.havePursuer = false;

    this._checkPosition();

    this._createFish();

    this.fishBindToCursor = false;
    this.events();
}

/**
 * При наведении курсора на рыбу - рыба движется за курсором, когда курсор движется.
 * Когда курсор останавливается - рыба уплывает.
 * Клик мыши отвязывает всех рыб от курсора (см. в screensaver)
 */
Fish.prototype.events = function() {
    var _this = this;

    this.divElemCache.mouseenter(function(e) {
        if (!_this.fishBindToCursor) {
            _this.fishBindToCursor = true;
            $(window).mousemove(function(e){
                _this._moveToXY(e.pageX, e.pageY);
            });
        }
    });

};

/**
 * Getter for type
 * @returns {Object}
 */
Fish.prototype.getType = function() {
    return this.type;
};
/**
 * Getter for x
 * @returns {number}
 */
Fish.prototype.getX = function() {
    return this.x;
};

/**
 * Getter for y
 * @returns {number}
 */
Fish.prototype.getY = function() {
    return this.y;
};

/**
 * Getter x for new fish
 * @returns {number}
 */
Fish.prototype.getXNewFish = function() {
    if (Math.random() > 0.5) {
        return this.x + this.deltaX;
    }
    return this.x - this.deltaX;
};

/**
 * Getter y for new fish
 * @returns {number}
 */
Fish.prototype.getYNewFish = function() {
    if (Math.random() > 0.5) {
        return this.y + this.deltaY;
    }
    return this.y - this.deltaY;
};

/**
 * Проверка существования дом-узла.
 * Используется для удаления рыбы из массива, после того, как она была съедена
 * @returns {boolean}
 */
Fish.prototype.domElemExists = function() {
    if (this.divElemCache === -1) {
        return false;
    }
    return true;
};

/**
 * Проверяет позицию, чтобы не выходила за границы экрана
 * @private
 */
Fish.prototype._checkPosition = function() {
    if (this.x < 1) {
        this.x = 1;
    } else if (this.x >= this.consts.SCREENWIDTH-4 ) {
        this.x = this.consts.SCREENWIDTH - 4;
    }
    if (this.y < 1) {
        this.y = 1;
    } else if (this.y >= this.consts.SCREENHEIGHT-4 ) {
        this.y = this.consts.SCREENHEIGHT - 4;
    }
};

/**
 * Создать div-рыбу
 * @private
 */
Fish.prototype._createFish = function() {
    this.divElemCache = $('<div>', {
           id: 'fish-' + this.id,
        class: 'fish',
        style: 'border-color: ' + this.type.color + '; top: ' + this.y + 'px; left: ' + this.x + 'px;'
    });

    $('body').append(this.divElemCache);
};

/**
 * Сместить рыбу на deltaX, deltaY
 * @param deltaX
 * @param deltaY
 * @private
 */
Fish.prototype._moveTo = function(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;
    this._checkPosition();

    this.divElemCache.css({ 'left' : this.x, 'top': this.y });
};

/**
 * Поставить рыбу в указанную точку х, y
 * @param x
 * @param y
 * @private
 */
Fish.prototype._moveToXY = function(x, y) {
    this.x = x;
    this.y = y;
    this._checkPosition();
    if (this.divElemCache !== null && this.divElemCache !== -1) {
        this.divElemCache.css({ 'left' : this.x, 'top': this.y });
    }
};

/**
 * "Ежедневные" действия каждой рыбы
 * @returns {number} - Что делать с рыбой. (1 - создать новую, 0 - ничего, -1 - умертвить)
 */
Fish.prototype.stepInLifeOfEachFish = function() {

    ++this.lifeStep;
    ++this.lastReprod;

    this._moveTo(this.deltaX, this.deltaY);
    this.oldDeltaX = this.deltaX;
    this.oldDeltaY = this.deltaY;

    if (this.lifeStep >= this.type.maxStepsInLife) {
        return -1;
    }

    if (this.type.cnfFish >= this.type.maxNum) {
        this.lastReprod = 0;
    }
    if (this.lastReprod >= this.type.stepsBtwnReproduct && this.hunger >= this.type.needFood) {
        ++this.type.cnfFish;
        this.lastReprod = 0;
        if (this.hunger > 0) {
            this.hunger = 0;
        }
        return 1;
    }

    return 0;
};

Fish.prototype.killFish = function() {
    if (this.divElemCache !== null && this.divElemCache !== -1) {
        if (this.type.cnfFish > 0) {
            --this.type.cnfFish;
        }
        this.divElemCache.remove();
        this.divElemCache = -1;
    }
};
