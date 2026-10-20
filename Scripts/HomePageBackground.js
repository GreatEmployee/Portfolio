const canvas = document.querySelector(".backgroundCanvas");

var height = 0;
var width = 0;
var diagonalLength = 1;

function updateCanvasSize() {
    var boundingRect = canvas.getBoundingClientRect();
    width = boundingRect.width;
    height = boundingRect.height;
    diagonalLength = Math.sqrt(height**2 + width**2);
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

    length(){return Math.sqrt( (this.x)**2 + (this.y)**2 )}

    static add(v1, v2){return new Vector2(v1.x+v2.x,v1.y+v2.y)}
    static sub(v1, v2){return new Vector2(v1.x-v2.x,v1.y-v2.y)}
    scale(s){return new Vector2(this.x*s, this.y*s)}
    static random(){return new Vector2(getRandomInRange(-1,1),getRandomInRange(-1,1)).normalize()}
    static distance(v1, v2){return Math.sqrt( (v1.x-v2.x)**2 + (v1.y-v2.y)**2 )}
}

var points = [];
const pointColor = "rgb(211,211,211)";
const pointVelocityFactor = .3;
const pointMaxSpeed = 100;
const pointMinSpeedForFriction = 1;
const pointAccelFactor = 3;
const pointMaxAccel = 100;

const pointFrictionFactor = 1/300;

class Point {
    constructor() {
        this.radius = getRandomInRange(20, 40);
        this.position = new Vector2(
            getRandomInRange(width*0.4, width*0.6),  /*x*/
            getRandomInRange(height*0.4, height*0.6)  /*y*/
        );
        this.velocity = Vector2.random();
        this.force = new Vector2(0,0);
    }

    update(){
        if (this.force.length() > pointMaxAccel){
            this.force.normalize().scale(pointMaxAccel);
        };

        this.velocity = Vector2.add(
            this.velocity,
            this.force.scale(pointAccelFactor)
        );

        if(this.velocity.length() > pointMinSpeedForFriction){
            this.velocity = Vector2.add(
                this.velocity,
                this.velocity.scale(- pointFrictionFactor)
            );
        }

        if (this.velocity.length() > pointMaxSpeed){
            this.velocity.normalize().scale(pointMaxSpeed);
        };

        this.position = Vector2.add(
            this.position,
            this.velocity.scale(pointVelocityFactor)
        )

        if ((this.position.x > width) || (this.position.x < 0)){
            this.velocity.x *= -1;
            this.position.x = this.position.x > width ? width - 1 : 1;
        }
        if ((this.position.y > height) || (this.position.y < 0)){
            this.velocity.y *= -1;
            this.position.y = this.position.y > height ? height - 1 : 1;
        }
        /*this.position.x = this.position.x % width;    MODULO ISN'T WELL DEFINE IN THE NEGATIVES
        this.position.y = this.position.y % height;          WTF       (╯°□°）╯︵ ┻━┻                       */  

        /*this.position.x = ((this.position.x + this.radius)%(width + this.radius*2)) - this.radius;
        this.position.y = ((this.position.y + this.radius)%(height + this.radius*2)) - this.radius;
        */
    }

    updateForceWith(p, scale) {
        var length = Vector2.distance(this.position, p.position);
        var force = - scale / ( scale + length**2 ); /*do not fit reality*/

        this.force = Vector2.add(this.force, Vector2.sub(p.position, this.position).normalize().scale(force));
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

    static distance(p1, p2){return Vector2.distance(p1.position, p2.position)}
}

function drawLine(ctx, p1, p2) {
    var length = Point.distance(p1, p2);
    ctx.beginPath();
    
    if (length*8 > diagonalLength)return;
    var lineWidth = Math.max((1 - ( 8*(length/diagonalLength) )**2 ), 0);

    ctx.strokeStyle = `rgb(100,100,255, ${lineWidth**2})`;
    ctx.lineWidth = 10 * lineWidth;
    ctx.moveTo(p1.position.x, p1.position.y);
    ctx.lineTo(p2.position.x, p2.position.y);
    ctx.stroke();
    
}

var cursorPosition = new Point();
function getCursorPosition() {
    cursorPosition.position.x = (.5 - parseFloat(canvas.style.getPropertyValue("--position-x").slice(0,-2))) * width;
    cursorPosition.position.y = (.5 - parseFloat(canvas.style.getPropertyValue("--position-y").slice(0,-2))) * height;

    if (isNaN(cursorPosition.position.x))cursorPosition.position.x=0;
    if (isNaN(cursorPosition.position.y))cursorPosition.position.y=0;
}

function draw() {

    getCursorPosition();
    
    var ctx = canvas.getContext("2d");
    ctx.reset();
    ctx.fillStyle = pointColor;

    for(var p = 0; p < points.length; p++){
        points[p].update();
        points[p].force = new Vector2(0,0);
    }

    
    for(var p = 0; p < points.length; p++){
        for(var p2 = 0; p2 < points.length; p2++){
            if (p!=p2){
                drawLine(ctx, points[p], points[p2]);
                points[p].updateForceWith(points[p2], 10);
            }
        }
        drawLine(ctx, points[p], cursorPosition);
        points[p].updateForceWith(cursorPosition, 10);

        var wall = new Point();
        wall.position.x = points[p].position.x < width/2 ? 0 : width;
        wall.position.y = points[p].position.y;
        points[p].updateForceWith(wall, 10);
        wall.position.y = points[p].position.y < height/2 ? 0 : height;
        wall.position.x = points[p].position.x;
        points[p].updateForceWith(wall, 10);

        points[p].updateForceWith(new Point(width/2, height/2), 100);

    }

    for(var p = 0; p < points.length; p++){
        points[p].draw(ctx);
    }
    ctx.fill();
    
}

setTimeout(() => {
    for(var p = 0; p < 70; p++){
        points.push(new Point());
    }
}, 5500);
setInterval(draw, 10);