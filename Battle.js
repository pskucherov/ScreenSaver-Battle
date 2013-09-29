/**
 * Битва рыб за жизнь
 * @constructor
 */
function Battle() {
    this.preys     = [];
    this.predators = [];
}

/**
 * Добавлении рыбы-жертвы в массив
 * @param prey
 */
Battle.prototype.addPrey = function(prey) {
    if(!(prey instanceof Fish) || prey.type.needFood !== -1 ) {
        throw new Error ("This isn't prey!");
    }
    this.preys[prey.id] = prey;
};

/**
 * Добавление рыбы-хищника в массив
 * @param predator
 */
Battle.prototype.addPredator = function(predator) {
    if(!(predator instanceof Fish) || predator.type.needFood !== 1 ) {
        throw new Error ("This isn't predator!");
    }
    this.predators[predator.id] = predator;
};

/**
 * Получить уникальный ID для создаваемой рыбы
 * @returns {number}
 */
Battle.prototype.getNewFishId = function() {
    return (this.preys.length + this.predators.length);
};

/**
 * Получить ID для хищника или жертвы
 * @returns {number}
 */
Battle.prototype.getFishId = function() {
    var i
        , len = 0;

    if (this.preys.length > this.predators.length) {
        len = this.preys.length;
    } else {
        len = this.predators.length;
    }

    for (i = 0; i < len; i++) {
        if ( typeof this.preys[i] === 'undefined' && typeof this.predators[i] === 'undefined' ) {
            return i;
        }
    }
    return this.getNewFishId();
};

/**
 * Вызвать шаг жизни для каждой рыбы
 */
Battle.prototype.stepOfLife = function() {
    var i
        , buf;

    for (i = 0; i < this.predators.length; i++) {
        if (typeof this.predators[i] !== 'undefined') {
            buf = this.predators[i].stepOfPredator(this.preys);
            switch(buf) {
                case 1:
                    this.addPredator(
                        new Fish(/*this.getNewFishId()*/
                            this.getFishId('predator'),
                            this.predators[i].getType(),
                            this.predators[i].getXNewFish(),
                            this.predators[i].getYNewFish()
                        )
                    );
                    break;
                case -1:
                    this.predators[i].killFish();
                    delete this.predators[i];
                    break;
            }
        }
    }

    for (i = 0; i < this.preys.length; i++) {
        if (typeof this.preys[i] !== 'undefined') {
            if (this.preys[i].domElemExists()) {
                buf = this.preys[i].stepOfPrey(this.predators);
                switch(buf) {
                    case 1:
                        this.addPrey(
                            new Fish(/*this.getNewFishId(),*/
                                this.getFishId('prey'),
                                this.preys[i].getType(),
                                this.preys[i].getXNewFish(),
                                this.preys[i].getYNewFish()
                            )
                        );
                        break;
                    case -1:
                        this.preys[i].killFish();
                        delete this.preys[i];
                        break;
                }
            } else {
                delete this.preys[i];
            }
        }
    }

};




