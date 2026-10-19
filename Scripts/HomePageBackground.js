const canvas = document.querySelector(".backgroundCanvas");

var height = 0;
var width = 0;

function updateCanvasSize() {
    var boundingRect = canvas.getBoundingClientRect();
    width = boundingRect.width;
    height = boundingRect.height;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}

updateCanvasSize();
window.addEventListener("resize", updateCanvasSize);

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        if (!this.x && !this.y)return this;
        var length = Math.sqrt(this.x**2 + this.y**2);
        this.x /= length;
        this.y /= length;
        return this;
    }

    static add(v1, v2){return new Vector2(v1.x+v2.x,v1.y+v2.y)}
    static sub(v1, v2){return new Vector2(v1.x-v2.x,v1.y-v2.y)}
    scale(s){this.x*=s;this.y*=s;return this}
    static random(){return new Vector2(getRandomInRange(-1,1),getRandomInRange(-1,1)).normalize()}
}

var points = [];
const pointColor = "rgb(211,211,211)";
const pointVelocityFactor = 1;
const pointAccelFactor = 1/5;

class Point {
    constructor() {
        this.radius = getRandomInRange(20, 40);
        this.position = new Vector2(
            getRandomInRange(- this.radius, width + this.radius),  /*x*/
            getRandomInRange(- this.radius, height + this.radius)  /*y*/
        );
        this.velocity = Vector2.random();
    }

    update(){
        this.velocity = Vector2.add(
            this.velocity,
            Vector2.random().scale(pointAccelFactor)
        )
        .normalize()
        .scale(pointVelocityFactor);

        this.position = Vector2.add(
            this.position,
            this.velocity
        )

        

    }

    draw(ctx) {
        var halfRad = this.radius/2;
        ctx.roundRect(
            this.position.x - halfRad,
            this.position.y - halfRad,
            this.radius,
            this.radius,
            halfRad
        )
    }
}

for(var p = 0; p < 50; p++){
    points.push(new Point());
}

function draw() {
    
    var ctx = canvas.getContext("2d");
    ctx.reset();
    ctx.fillStyle = pointColor;
    for(var p = 0; p < points.length; p++){
        points[p].update();
        points[p].draw(ctx);
    }
    ctx.fill();
    
    
}

setInterval(draw, 50);