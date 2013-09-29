function Predator() {
    Predator.superclass.constructor.apply(this, arguments);
}

extend(Predator, Fish);


/**
 * Действия рыбы-хищника
 */
Predator.prototype.step = function( preys ) {
        var dmin = 11000
            , found = -1
            , i
            , d = 0
            , rnd
            ;

        for (i = 0; i < preys.length; i++) {
            if (typeof preys[i] !== 'undefined') {
                if (preys[i].lifeStep > 100 && !preys[i].havePursuer) {
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
        }

        if (found !== -1 && dmin < this.type.rangeOfVisibility) {
            this.status = 2;
            this.deltaX = preys[found].x - this.x;
            this.deltaY = preys[found].y - this.y;

            preys[found].havePursuer = true;
            //le.log(dmin, (this.status * this.type.speed + this.consts.FISHRADIUS));

            if (dmin < this.status * this.type.speed + this.consts.FISHRADIUS) {
                preys[found].killFish();
                ++this.hunger;
            }

        } else {
            this.status = 1;
            if ( (this.x + this.deltaX) <= this.consts.XMIN || (this.x + this.deltaX) >= this.consts.XMAX ||
                (this.y + this.deltaY) <= this.consts.YMIN || (this.y + this.deltaY) >= this.consts.YMAX ) {

                rnd = Math.random();
                if ( rnd > 0.8 ) {
                    this.deltaX = -this.deltaX;
                } else if ( rnd > 0.6 ) {
                    this.deltaY = -this.deltaY;
                } else if ( rnd > 0.5 ) {
                    this.deltaX = this.deltaX + rnd;
                } else if ( rnd > 0.4 ) {
                    this.deltaY = this.deltaY + rnd;
                } else {
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
