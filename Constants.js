/**
 * Константы, используемые в битве
 * @returns {*}
 * @constructor
 */
function Constants() {
    if (!Constants.__instance)
        Constants.__instance = this;
    else return Constants.__instance;

    this.SCREENWIDTH  = $(window).width();  // ширина области отображения
    this.SCREENHEIGHT = $(window).height(); // высота области отображения
    this.EPS          = 0.00001;            // для сравнения (из паскаля, возможно понадобится)
    this.FEAROFEDGE   = 3;                  // во сколько раз жертвы сильнее боятся края
    this.XMIN         = 5;                 // значение
    this.YMIN         = 5;                 //          координат,
    this.XMAX         = this.SCREENWIDTH - 20;   //                  которые могут
    this.YMAX         = this.SCREENHEIGHT - 20;  //                          принимать рыбы

    this.rand = function() {
        var a = Math.random();
        while(a < 0.1) {
            a *= 10;
        }
        if ( a < 0.5 ) {
            a -= 1;
        }
        return a;
    };
}

