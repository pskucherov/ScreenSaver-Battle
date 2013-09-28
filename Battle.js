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
    this.preys.push(prey);
};

/**
 * Добавление рыбы-хищника в массив
 * @param predator
 */
Battle.prototype.addPredator = function(predator) {
    if(!(predator instanceof Fish) || predator.type.needFood !== 1 ) {
        throw new Error ("This isn't predator!");
    }
    this.predators.push(predator);
};

/**
 * Получить уникальный ID для создаваемой рыбы
 * @returns {number}
 */
Battle.prototype.getNewFishId = function() {
    return (this.preys.length + this.predators.length);
};


Battle.prototype.stepOfLife = function() {
    var i;
    for (i = 0; i < this.predators.length; i++) {
        this.predators[i].stepOfPredator(this.preys);
    }

    for (i = 0; i < this.predators.length; i++) {
        this.preys[i].stepOfPrey(this.predators);
    }
};




