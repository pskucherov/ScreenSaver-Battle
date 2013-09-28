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

/**
 * Вызвать шаг жизни для каждой рыбы
 */
Battle.prototype.stepOfLife = function() {
    var i
        , buf;
    for (i = 0; i < this.predators.length; i++) {
        buf = this.predators[i].stepOfPredator(this.preys);
        switch(buf) {
            case 1:
                this.addPredator(
                    new Fish(this.getNewFishId(),
                        this.predators[i].getType(),
                        this.predators[i].getX(),
                        this.predators[i].getY()
                    )
                );
                break;
        }
    }

    for (i = 0; i < this.preys.length; i++) {
        buf = this.preys[i].stepOfPrey(this.predators);
        switch(buf) {
            case 1:
                this.addPrey(
                    new Fish(this.getNewFishId(),
                        this.preys[i].getType(),
                        this.preys[i].getX(),
                        this.preys[i].getY()
                    )
                );
                break;
        }
    }
};




