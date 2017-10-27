function SetupCanvas(canvas) {
    var c = canvas;
    c.width = c.scrollWidth;
    c.height = c.scrollHeight;
    var ctx = c.getContext('2d');

    var lastPos = mousePos = { x: 0, y: 0 };

    var drawing = false;

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        console.log(evt);
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
          x: touchEvent.touches[0].clientX - rect.left,
          y: touchEvent.touches[0].clientY - rect.top
        };
      }

    c.addEventListener('mousedown', function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
    })

    c.addEventListener('mouseup', function (e) {
        drawing = false;
    })


    c.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(c, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        c.dispatchEvent(mouseEvent);
    }, false);
    c.addEventListener("touchend", function (e) {
        //e.preventDefault();
        var mouseEvent = new MouseEvent("mouseup", {});
        c.dispatchEvent(mouseEvent);
    }, false);
    c.addEventListener("touchmove", function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        c.dispatchEvent(mouseEvent);
    }, false);

    c.addEventListener('mousemove', function (evt) {
        //e.preventDefault();
        if (drawing) {
            //console.log(evt);
            mousePos = getMousePos(c, evt);
            draw();
        }
    }, false);

    function draw() {
        /*ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
        ctx.fill();*/

        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        lastPos = mousePos;
    }
}