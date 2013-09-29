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
        , fish = { obj: null, type: null, buf: null } // type: 0 - хищик, 1 - жертва
        , len
        , newFish;

    if ( this.predators.length > this.preys.length ) {
        len = this.predators.length;
    } else {
        len = this.preys.length;
    }

    for (i = 0; i < len; i++) {

        fish = { obj: null, type: null, buf: null };

        if (typeof this.predators[i] !== 'undefined') {
            fish.i  = i;
            fish.obj  = this.predators[i];
            fish.type = 0;
            fish.buf  = this.predators[i].step(this.preys);
        } else if (typeof this.preys[i] !== 'undefined') {
            fish.i    = i;
            fish.obj  = this.preys[i];
            fish.type = 1;
            fish.buf  = this.preys[i].step(this.predators);
        }

        if (fish.buf !== null) {
            if (fish.obj.domElemExists()) {
                switch(fish.buf) {
                    case 1:

                        if (fish.type === 1) {
                            newFish = new Prey(/*this.getNewFishId(),*/
                                this.getFishId(),
                                this.preys[i].getType(),
                                this.preys[i].getXNewFish(),
                                this.preys[i].getYNewFish()
                            );
                            this.addPrey(newFish);
                        } else if (fish.type === 0) {
                            newFish = new Predator(/*this.getNewFishId(),*/
                                this.getFishId(),
                                this.preys[i].getType(),
                                this.preys[i].getXNewFish(),
                                this.preys[i].getYNewFish()
                            );
                            this.addPredator(newFish);
                        }
                        break;
                    case -1:
                        fish.obj.killFish();
                        console.log(i, this.preys[i], this.predators[i]);
                        delete fish.obj;
                        console.log(i, this.preys[i], this.predators[i]);

                        break;
                }
            } else {
                delete fish.obj;
            }
        }
    }

};




