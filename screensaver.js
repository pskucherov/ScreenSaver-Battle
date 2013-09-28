
window.onload = function () {
    var fishType = [];

    fishType.push(new FishTypes('red',   1000, 40, 5000,  1,   1, 100));
    fishType.push(new FishTypes('blue',    30, 50,  500, -1, 0.7,  35));
    fishType.push(new FishTypes('green',  150, 50, 1500, -1, 0.9,  50));
    fishType.push(new FishTypes('yellow', 300, 15, 1500, -1, 0.99, 50));

    console.log(fishType);

};
