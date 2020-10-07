window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {

    // Definitions
    var color = '#ff0000';
    var canvas = document.getElementById("paint-canvas");
    var context = canvas.getContext("2d");

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Specifications
    var mouseX = 0;
    var mouseY = 0;
    var lineWidth = 20;
    var defaultColor = '#fc4c4f';
    context.lineWidth = lineWidth; // initial brush width
    var isDrawing = false;

    //When clicking on control list items
    $(".controls").on("click", "colorItem", function () {
        //Deselect sibling elements
        $(this).siblings().removeClass("selected");
        //Select clicked element
        $(this).addClass("selected");
        //cache current color
        color = $(this).css("background-color");

        context.strokeStyle = color || defaultColor;
        // context.lineWidth = lineWidth; // initial brush width
    });

    //When "Add Color" is pressed
    $("#revealColorSelect").click(function () {
        //Show color select or hide the color select
        changeColor();
        changeBrushSize();
        $("#colorSelect").toggle();
    });

    //update the new color span
    function changeColor() {
        var r = $("#red").val();
        var g = $("#green").val();
        var b = $("#blue").val();
        $("#newColor").css("background-color", "rgb(" + r + "," + g + ", " + b + ")");
        $("#newBrushSize").css("background-color", "rgb(" + r + "," + g + ", " + b + ")");
    }

    //update the new brush size span
    function changeBrushSize() {
        var size = $("#brushSize").val();
        context.lineWidth = size; // initial brush width

        var display_size = (size / 3);
        $("#newBrushSize").css("width", display_size + "px");
        $("#newBrushSize").css("height", display_size + "px");
        $("#newBrushSize").css("border-radius", display_size + "px");
    }

    //When brush size slider changes
    $("input[id=brushSize]").change(changeBrushSize);
    //When color sliders change
    $("input[type=range]").change(changeColor);

    //When "Add New Color" is pressed
    $("#addNewColor").click(function () {
        //Append the color to the controls colorList
        var $newColor = $("<colorItem></colorItem>");
        $newColor.css("background-color", $("#newColor").css("background-color"));
        $(".controls colorList").append($newColor);
        //Select the new color
        $newColor.click();
    });

    function renderCanvas() {
        if (isDrawing)
            context.stroke();
    }

    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
        var boundings = canvas.getBoundingClientRect();
        mouseX = event.clientX - boundings.left;
        mouseY = event.clientY - boundings.top;
    }

    function setTouchPos(event) {
        var rect = canvas.getBoundingClientRect();
        var touch = event.touches[0];
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
    }

    canvas.addEventListener('touchstart', function (event) {
        setTouchPos(event);
        isDrawing = true;

        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
    }, false);

    // Mouse Down Event
    canvas.addEventListener('mousedown', function (event) {
        setMouseCoordinates(event);
        isDrawing = true;

        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
    });

    // Mouse Move Event
    canvas.addEventListener('touchmove', function (event) {
        setTouchPos(event);

        if (isDrawing) {
            context.lineTo(mouseX, mouseY);
        }
    }, false);

    canvas.addEventListener('mousemove', function (event) {
        setMouseCoordinates(event);

        if (isDrawing) {
            context.lineTo(mouseX, mouseY);
        }
    });

    // Mouse Up Event
    canvas.addEventListener('mouseup', function (event) {
        setMouseCoordinates(event);
        renderCanvas();
        isDrawing = false;
    });

    canvas.addEventListener('touchend', function (event) {
        renderCanvas();
        isDrawing = false;
    }, false);

    // Handle Clear Button
    var clearButton = document.getElementById('clear');

    clearButton.addEventListener('click', function () {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = color || defaultColor;
        context.lineWidth = lineWidth; // initial brush width
    });

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    // Handle Save Button
    // var saveButton = document.getElementById('save');

    // saveButton.addEventListener('click', function () {
    //     var imageName = prompt('Please enter image name');
    //     var canvasDataURL = canvas.toDataURL();
    //     var a = document.createElement('a');
    //     a.href = canvasDataURL;
    //     a.download = imageName || 'drawing';
    //     a.click();
    // });

    context.strokeStyle = defaultColor;
};