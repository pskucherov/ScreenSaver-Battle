/**
 * Создаём типы рыб (стаи)
 * @param color              - цвет рыбы
 * @param stepsBtwnReproduct - должно пройти шагов перед размножением
 * @param maxNum             - максимум рыб в стае
 * @param maxStepsInLife     - максимум шагов, после которых рыба умрёт
 * @param needFood           - хищник (нужна еда для размножения)
 * @param speed              - скорость рыбы в спокойном состоянии (в возбуждённом х2)
 * @param rangeOfVisibility  - радиус обзора (как далеко видит рыба)
 * @constructor
 */
function FishTypes(color, stepsBtwnReproduct, maxNum, maxStepsInLife, needFood, speed, rangeOfVisibility) {

    if (typeof stepsBtwnReproduct !== 'number' || stepsBtwnReproduct < 1) {
        throw new Error("Error with a reproduction");
    }

    if (typeof maxNum !== 'number' || maxNum < 1) {
        throw new Error("maxNum must be >= 1");
    }

    if (typeof maxStepsInLife !== 'number' || maxStepsInLife < 1) {
        throw new Error("maxStepsInLife must be >= 1");
    }

    if (needFood !== -1 && needFood !== 1) {
        throw new Error("Error with needFood");
    }

    if (typeof speed !== 'number' || speed <= 0) {
        throw new Error("speed must be > 0");
    }

    if (typeof rangeOfVisibility !== 'number' || rangeOfVisibility <= 0) {
        throw new Error("rangeOfVisibility must be > 0");
    }


    this.color = color;
    this.image = './images/left-' + color + '-fish.png';

    this.stepsBtwnReproduct = stepsBtwnReproduct;

    this.maxNum         = maxNum;
    this.cnfFish        = 0;
    this.maxStepsInLife = maxStepsInLife;
    this.needFood       = needFood;
    this.speed          = speed;

    this.rangeOfVisibility = rangeOfVisibility;

}
