$(document).ready(function() {
    const targets = document.querySelectorAll(".FacingCursor");

    function getOffsetX(t) {
        var rect = t.getBoundingClientRect();
        return rect.left + window.scrollX + rect.width/2
    }

    function getOffsetY(t) {
        var rect = t.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height/2
    }

    function compute(target, positionY) {
        var depthZ = target.getAttribute('depthz');
        var shadowIntensity = target.getAttribute('shadowIntensity');
        var rotationFreedom = target.getAttribute('rotationFreedom');
        
        var positionX = (posX-getOffsetX(target)) / window.innerWidth;
        target.style.setProperty('--position-x', (-positionX * shadowIntensity * rotationFreedom).toString() + "px");
        target.style.setProperty('--position-y', (-positionY * shadowIntensity * rotationFreedom).toString() + "px");
        target.style.setProperty('--rotation-y', (Math.tan(positionX / depthZ) * 360 * rotationFreedom).toString() + "deg");
        target.style.setProperty('--rotation-x', (-Math.tan(positionY / depthZ) * 360 * rotationFreedom).toString() + "deg");
    }

    var posX = 0;
    var posY = 0;
    var posScroll = window.scrollY;
    window.addEventListener("pointermove",
        function (e) {
            posX = e.pageX;
            posY = e.pageY;
            posScroll = window.scrollY;
            for(var i = 0; i < targets.length; i++){
                var target = targets[i];
                var positionY = (posY-getOffsetY(target)) / window.innerHeight;
                compute(target, positionY);
            }
            
        }
    );
    window.addEventListener("scroll",
        function (e) {
            for(var i = 0; i < targets.length; i++){
                var target = targets[i];
                var positionY = (posY - posScroll + window.scrollY -getOffsetY(target)) / window.innerHeight;
                compute(target, positionY);
            }
        }
    );
});