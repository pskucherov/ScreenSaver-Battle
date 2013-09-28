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

    this._checkPosition();

    this._createFish();

}

/**
 * Проверяет позицию, чтобы не выходила за границы экрана
 * @private
 */
Fish.prototype._checkPosition = function() {
    if (this.x < 1) {
        this.x = 1;
    } else if (this.x >= this.consts.SCREENWIDTH ) {
        this.x = this.consts.SCREENWIDTH - 1;
    }
    if (this.y < 1) {
        this.y = 1;
    } else if (this.y >= this.consts.SCREENHEIGHT ) {
        this.y = this.consts.SCREENHEIGHT - 1;
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
 *
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
 * "Ежедневные" действия каждой рыбы
 */
Fish.prototype.stepInLifeOfEachFish = function() {
    ++this.lifeStep;
    ++this.lastReprod;
};

/**
 * Действия рыбы-жертвы
 */
Fish.prototype.stepOfPrey = function( predators ) {

    this.stepInLifeOfEachFish();
};

/**
 * Действия рыбы-хищника
 */
Fish.prototype.stepOfPredator = function( preys ) {
    var dmin = 11000
        , found = -1
        , i
        , d = 0
    ;

    for (i = 0; i < preys.length; i++) {
        if (preys[i].lifeStep > 100) {
            d = Math.sqrt(
                    (this.x - preys[i].x) * (this.x - preys[i].x)
                +
                    (this.y - preys[i].y) * (this.y - preys[i].y)
            );
            if (d < dmin) {
                found = i;
            }
        }
    }

    if (found !== -1 && 1 == 2) {
        console.log(found);
    } else {

        console.log(this.x, this.y);

        if ( this.x <= this.consts.XMIN || this.x >= this.consts.XMAX ||
             this.y <= this.consts.YMIN || this.y >= this.consts.YMAX ) {

            while (
                (this.x + this.deltaX) <= this.consts.XMIN || (this.x + this.deltaX) >= this.consts.XMAX ||
                (this.y + this.deltaY) <= this.consts.YMIN || (this.y + this.deltaY) >= this.consts.YMAX
            ) {
                this.deltaX = 2 * this.status * this.consts.rand() * this.type.speed - this.status * this.type.speed;
                this.deltaY = 2 * this.status * this.consts.rand() * this.type.speed - this.status * this.type.speed;
            }
        } else {
            this.deltaX = this.oldDeltaX;
            this.deltaY = this.oldDeltaY;
        }
    }

    d = Math.sqrt(this.deltaX * this.deltaX + this.deltaY * this.deltaY);

    if (d > this.consts.EPS) {
        this.deltaX = this.status * this.type.speed * this.deltaX /d;
        this.deltaY = this.status * this.type.speed * this.deltaY /d;
    }

    this.oldDeltaX = this.deltaX;
    this.oldDeltaY = this.deltaY;
    this._moveTo(this.deltaX, this.deltaY);

    this.stepInLifeOfEachFish();
};

