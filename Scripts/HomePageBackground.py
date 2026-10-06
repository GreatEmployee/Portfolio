import pyscript
from pyscript import when, web
from pyscript.web import page

import random, math, time, itertools

dotNumber = 50
dotColor = "rgb(211,211,211)"
dotRadius = 10
lineWidth = 7

time.sleep(0.2)

windowWidth, windowHeight = pyscript.window.innerWidth, pyscript.window.innerHeight

canvas = web.canvas(classes=['BgCanvas'])
for style, value in {
    "position": "absolute",
    "left": "0px",
    "top": "4vh",
    "z-index": "-1",
    "width": "100%",
    "height": "100vh",
    "opacity": "1"
}.items():
    canvas.style[style] = value
web.page["#presentationSection"].append(canvas)
time.sleep(0.1)
canvas.style["opacity"] = "1"

def updateCanvasSizeInfos():
    global canvasWidth
    global canvasHeight
    global scaleFactorX
    global scaleFactorY

    canvasWidth = windowWidth
    canvasHeight = canvas.height * (canvasWidth / canvas.width)

    scaleFactorX = canvasWidth / windowWidth
    scaleFactorY = canvasHeight / windowHeight

    canvasHeight = int(canvasHeight)

    canvas.width = canvasWidth
    canvas.height = canvasHeight
updateCanvasSizeInfos()

class Dot:
    def __init__(self, color, radius):
        self.angle = random.random()*math.pi*2
        self.acceleration = random.random()
        self.speed = 1
        self.maxspeed = (0.5,1.5)
        self.color = color
        self.radius = radius
        self.x = random.randint(0,canvasWidth)
        self.y = random.randint(0,canvasHeight)

    def update(self, ctx):
        
        ctx.beginPath()
        ctx.fillStyle = self.color
        ctx.arc(
        self.x * scaleFactorX,
        self.y * scaleFactorY,
        self.radius,
        0, math.pi * 2)
        ctx.fill()

    def move(self):
        self.angle += (random.random()-.5)*math.pi/30
        self.angle %= math.pi*2
        
        self.acceleration = random.random()*2 - 1
        self.speed += self.acceleration/10
        self.speed = max(min(self.speed, self.maxspeed[1]), self.maxspeed[0])
        
        self.x += math.cos(self.angle) * self.speed
        self.y += math.sin(self.angle) * self.speed
        
        self.x %= canvasWidth
        self.y %= canvasHeight

def drawLine(ctx, start, stop, value):
    ctx.beginPath()
    ctx.strokeStyle = f"rgba(100,100,255,{value})"
    ctx.moveTo(start[0] * scaleFactorX, start[1] * scaleFactorY)
    ctx.lineWidth = lineWidth
    ctx.lineTo(stop[0] * scaleFactorX, stop[1] * scaleFactorY)
    ctx.stroke()

cursorDot = Dot("rgb(0,0,0,0)", dotRadius)
dots = [Dot(dotColor, random.randint(int(dotRadius*0.5),int(dotRadius*1.5))) for i in range(dotNumber)]

@when("mousemove", "body")
def func(event):
    bds = canvas.getBoundingClientRect()

    cursorDot.x = (event.x - bds.x)
    cursorDot.y = (event.y - bds.y)

while True:
    updateCanvasSizeInfos()

    ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    for p in itertools.combinations(dots+[cursorDot], 2):
        sqDist = (p[0].x - p[1].x)**2 + (p[0].y - p[1].y)**2
        drawLine(
            ctx,
            (p[0].x, p[0].y),
            (p[1].x, p[1].y),
            (3*canvasWidth/sqDist)**(1.5)
        )

    for d in dots:
        d.update(ctx)
        d.move()
    
    cursorDot.update(ctx)
    
    ctx.restore()
    time.sleep(1/60)