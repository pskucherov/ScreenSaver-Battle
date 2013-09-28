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
 * @returns {number} - Что делать с рыбой. (1 - создать новую, 0 - ничего, -1 - умертвить)
 */
Fish.prototype.stepInLifeOfEachFish = function() {

    ++this.lifeStep;
    ++this.lastReprod;

    this._moveTo(this.deltaX, this.deltaY);
    this.oldDeltaX = this.deltaX;
    this.oldDeltaY = this.deltaY;

    if (this.type.cnfFish >= this.type.maxNum) {
        this.lastReprod = 0;
    } else if (this.lastReprod >= this.type.stepsBtwnReproduct && this.hunger >= this.type.needFood) {
        ++this.type.cnfFish;
        this.lastReprod = 0;
        return 1;
    } else if (this.lifeStep >= this.type.maxStepsInLife) {
        return -1;
    }

    return 0;
};

/**
 * Действия рыбы-жертвы
 */
Fish.prototype.stepOfPrey = function( predators ) {

    var d = 0
        , i
        , deltaXBuf
        , deltaYBuf;

    this.deltaX = this.deltaY = 0;
    this.status = 1;

    for (i = 0; i < predators.length; i++) {
        d = Math.sqrt(
            (this.x - predators[i].x) * (this.x - predators[i].x)
                +
                (this.y - predators[i].y) * (this.y - predators[i].y)
        );
        if (d < this.type.rangeOfVisibility) {
            if (d < this.consts.EPS) d = this.consts.EPS;
            this.status = 2;
            deltaXBuf = (this.x - predators[i].x)/(d*d);
            deltaYBuf = (this.y - predators[i].y)/(d*d);
            this.deltaX += deltaXBuf;
            this.deltaY += deltaYBuf;
        }
    }

    if ( this.x - this.consts.XMIN < this.type.rangeOfVisibility ) {
        this.deltaX = this.deltaX  + 1 / ((this.x - this.consts.XMIN + this.consts.EPS) * this.consts.FEAROFEDGE);
    }

    if ( this.consts.XMAX - this.x < this.type.rangeOfVisibility ) {
        this.deltaX = this.deltaX  + 1 / ((this.x - this.consts.XMAX - this.consts.EPS) * this.consts.FEAROFEDGE);
    }

    if ( this.y - this.consts.YMIN < this.type.rangeOfVisibility ) {
        this.deltaY = this.deltaY  + 1 / ((this.y - this.consts.YMIN + this.consts.EPS) * this.consts.FEAROFEDGE);
    }

    if ( this.consts.YMAX - this.y < this.type.rangeOfVisibility ) {
        this.deltaY = this.deltaY  + 1 / ((this.y - this.consts.YMAX - this.consts.EPS) * this.consts.FEAROFEDGE);
    }

    d = Math.sqrt(this.deltaX * this.deltaX + this.deltaY * this.deltaY);

    if ( d < this.consts.EPS ) {
        this.deltaX = 2 * this.status * this.consts.rand() * this.type.speed - this.status * this.type.speed;
        this.deltaY = 2 * this.status * this.consts.rand() * this.type.speed - this.status * this.type.speed;
    } else {
        this.deltaX = this.status * this.type.speed * this.deltaX /d;
        this.deltaY = this.status * this.type.speed * this.deltaY /d;
    }

    //console.log(this.deltaX, this.deltaY);

    return this.stepInLifeOfEachFish();
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
                dmin = d;
                found = i;
            }
        }
    }

    if (found !== -1 && dmin < this.type.rangeOfVisibility) {
        this.status = 2;
        this.deltaX = preys[found].x - this.x;
        this.deltaY = preys[found].y - this.y;
    } else {
        this.status = 1;
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

    return this.stepInLifeOfEachFish();
};

Fish.prototype.killFish = function() {
    if (this.type.cnfFish > 0) {
        --this.type.cnfFish;
    }
    this.divElemCache.remove();
};
