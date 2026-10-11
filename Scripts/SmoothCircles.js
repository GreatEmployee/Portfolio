const svg = document.querySelector("#svg");
const mask = document.querySelector("#mask");

const size = svg.getAttribute('viewBox').split(" ").slice(2,4);

const radiusRange = [50, 100];
const nbCircles = 3;
var circles = [];

function Random(min, max) {
  return min + Math.random() * (max - min);
}

var ids = [];
var newId = 0;
function getID(){
    if (ids.length == 0){ids.push(newId); newId++}
    return ids.pop()
}

function PrintCircle(circle){
    var element = circle.element;
    element.setAttribute("cx", circle.x);
    element.setAttribute("cy", circle.y);
    element.setAttribute("r", circle.radius);
    element.setAttribute("fill", "black");
    element.setAttribute("strokewidth", "20px");
}

for(var i = 0; i < nbCircles; i++){
    var radius = Random(...radiusRange)
    var circle = {
        id: getID(),
        radius: radius,
        x: Random( radius, size[0] - radius),
        y: Random( radius, size[1] - radius),
        element: document.createElementNS("http://www.w3.org/2000/svg","circle")
    };
    mask.appendChild(circle.element);
    circles.push(circle);
    PrintCircle(circle);
}