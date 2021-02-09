
/*
Notes on coordinate spaces:
Everything is calculated and handled in "World space".
World space is a coordinate plane of the same size as screen space (1:1 pixels) but translated by some x offset and y offset.
World space coordinates are translated back into screen space only when everything is drawn.

*/

var cnv;

var X = 0;  // X and Y are used in place of 0 and 1 when accessing the indexes of coordinate pair arrays for clarity.
var Y = 1;

var isPlaying = true;
var mouseIsPressed = false;

var selectedNode = null;
var restartButton = null;
var addButton = null;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  repositionCanvas();
}


function repositionCanvas()
{
	var x = windowWidth - width;
	var y = windowHeight - height;
	cnv.position(x, y);
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	repositionCanvas();
  button_updatePosition(restartButton, width - (width / 10), height/ 16);
  button_updatePosition(addButton, width - (width / 10), height/16 + height/12);
	drawFrame();
}

function drawFrame()
{
  background(50);
}


function draw()
{
  drawFrame();
}


function mousePressed()
{
  mouseIsPressed = true;  // log mouse press
  console.log("clicked mouse on canvas!")
}