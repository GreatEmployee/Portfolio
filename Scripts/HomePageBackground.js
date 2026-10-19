canvas = document.querySelector(".backgroundCanvas");

height, width ;

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

class Point {
    constructor() {
        this.radius = getRandomInRange(20, 40);
        this.x = getRandomInRange(- this.radius, width + this.radius);
        this.y = getRandomInRange(- this.radius, height + this.radius);
    }
}

