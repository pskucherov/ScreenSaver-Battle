function Prey() {
    Prey.superclass.constructor.apply(this, arguments);
}

extend(Prey, Fish);

/**
 * Действия рыбы-жертвы
 */
Prey.prototype.step = function( predators ) {

    var d = 0
        , i
        , deltaXBuf
        , deltaYBuf;

    this.deltaX = this.deltaY = 0;
    this.status = 1;
    this.havePursuer = false;

    for (i = 0; i < predators.length; i++) {
        if (typeof predators[i] !== 'undefined') {
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
