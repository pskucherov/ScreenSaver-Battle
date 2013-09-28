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
    this.XMIN         = 10;                 // значение
    this.YMIN         = 10;                 //          координат,
    this.XMAX         = this.SCREENWIDTH;   //                  которые могут
    this.YMAX         = this.SCREENHEIGHT;  //                          принимать рыбы
}
