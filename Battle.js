/**
 * Битва рыб за жизнь
 * @constructor
 */
function Battle() {
    this.fishs     = [];
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
    this.fishs[prey.id] = { fish: this.preys[prey.id], type: 1 }; // type: 1 - жертва
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
    this.fishs[predator.id] = { fish: this.predators[predator.id], type: 0 }; // type: 0 - хищник
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
        , answ
        , buf
        , newFish;

    for (i = 0; i < this.fishs.length; i++) {
        if (typeof this.fishs[i] !== 'undefined') {
            buf = null;
            if (this.fishs[i].type === 1) {
                buf = this.predators;
            } else if (this.fishs[i].type === 0) {
                buf = this.preys;
            }
            if (buf !== null) {
                if (this.fishs[i].fish.domElemExists()) {
                    answ = this.fishs[i].fish.step(buf);
                    switch(answ) {
                        case 1:
                            if (this.fishs[i].type === 1) {
                                newFish = new Prey(
                                    this.getFishId(),
                                    this.fishs[i].fish.getType(),
                                    this.fishs[i].fish.getXNewFish(),
                                    this.fishs[i].fish.getYNewFish()
                                );
                                this.addPrey(newFish);
                            } else if (this.fishs[i].type === 0) {
                                newFish = new Predator(
                                    this.getFishId(),
                                    this.fishs[i].fish.getType(),
                                    this.fishs[i].fish.getXNewFish(),
                                    this.fishs[i].fish.getYNewFish()
                                );
                                this.addPredator(newFish);
                            }
                            break;
                        case -1:
                            this.fishs[i].fish.killFish();
                            delete this.fishs[i].fish;
                            delete this.fishs[i];
                            break;
                    }
                } else {
                    delete this.fishs[i].fish;
                    delete this.fishs[i];
                }
            }
        }

    }

};




