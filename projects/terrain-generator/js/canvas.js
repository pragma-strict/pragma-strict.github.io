




/**
**	TODO:
**	Break down functions into sensible chunks and separate files.
**	Do some renaming and reworking to make things not shitty.
**/




var cnv;



function centerCanvas() {
  var cnv_x = (windowWidth - width) / 1.5;
  var cnv_y = (windowHeight - height) / 2;
  cnv.position(cnv_x, cnv_y);
}

/* ### VARIABLES ### */




// List CONSTANT variables
var PIXEL_TO_GRID_SCALE = 25;	// how many pixels wide is a grid pixel
var BACKGROUND_COL = 10;
var NEW_COLUMNS_TO_ADD;

// Other global variables
var grid = [];	// array of COLUMNS
var rock_heights = [];	// array of heights of ground level at every grid pixel
var g_width;
var g_height;
var x_offset = -19000;
var y_offset = 0;
var first_col;	// first column to render
var last_col;
var first_row;	// first row to render
var last_row;
var INITIAL_GEN_WIDTH;
var INITIAL_GEN_HEIGHT;
var NEW_GENERATION_BUFFER = 10;

// Canvas width and height


/* ### FUNCTIONS ### */

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent(document.getElementById("canvas-div"));
  INITIAL_GEN_WIDTH = width * 30;
  INITIAL_GEN_HEIGHT = height * 5;
  background(220);
  generate();
  NEW_GENERATION_BUFFER += USR_ROCK_COL_WIDTH;
}



function initGrid()
{
  var cols = floor(INITIAL_GEN_WIDTH / PIXEL_TO_GRID_SCALE);
  var rows = floor(INITIAL_GEN_HEIGHT / PIXEL_TO_GRID_SCALE);
  console.log(cols, rows);
  var colIndex = 0;
  var rowIndex = 0;

  for ( colIndex = 0; colIndex < cols; colIndex++ )
  {
    grid[colIndex] = [];
    for ( rowIndex = 0; rowIndex < rows; rowIndex++ )
    {
      grid[colIndex][rowIndex] = color(0, 0, 0);
    }
  }

  g_width = cols;
  g_width -= g_width % USR_ROCK_COL_WIDTH;
  g_height = rows;
}


function addColumns()
{
	for ( colIndex = g_width; colIndex < g_width + NEW_COLUMNS_TO_ADD; colIndex++ )
 	{
	    grid[colIndex] = [];
	    for ( rowIndex = 0; rowIndex < floor(INITIAL_GEN_HEIGHT / PIXEL_TO_GRID_SCALE); rowIndex++ )
	    {
	      grid[colIndex][rowIndex] = color(132, 198, 237);
	    }
 	}
 	g_width += NEW_COLUMNS_TO_ADD;
}


function gRect(x, y, w, h, r, g, b) {

	var rounded_x = round(x);
	var rounded_y = round(y);
	var rounded_w = round(w);
	var rounded_h = round(h);

	for (var xindex = rounded_x; xindex < rounded_x + rounded_w; xindex++ )
	{
		for(var yindex = rounded_y; yindex < rounded_y + rounded_h; yindex++ )
		{
			if(xindex < g_width && yindex < g_height)
			{
		  		grid[xindex][yindex] = color(r, g, b);
			}
		}
	}
}

function drawGrid()
{
 	background(10);

// FIND FIRST AND LAST COL TO RENDER & CHECK VALID
	calculateColumnsToRender();

// FIND FIRST AND LAST ROW TO RENDER & CHECK VALID
 	calculateRowsToRender();

// RENDER GRID
	strokeWeight(0);
	for(col = first_col; col < last_col; col++)
	{
		for(row = first_row; row < last_row; row++)
		{
			var xPos = col * PIXEL_TO_GRID_SCALE + x_offset;
			var yPos = row * PIXEL_TO_GRID_SCALE + y_offset;
			fill(grid[col][row]);	// take the color from the grid at that point
			rect(xPos, yPos, PIXEL_TO_GRID_SCALE, PIXEL_TO_GRID_SCALE);
		}
	}


}


function calculateColumnsToRender()
{
	first_col = floor( -(x_offset / PIXEL_TO_GRID_SCALE));
	last_col = first_col + ceil(width / PIXEL_TO_GRID_SCALE) + 1;
	if(first_col < 0){
		first_col = 0;
	}
	else if(first_col >= grid.length){
		first_col = grid.length;
	}

	if(last_col < 0){
		last_col = 0;
	}
	else if(last_col >= grid.length){
		last_col = grid.length;
	}
}

function calculateRowsToRender()
{
	first_row = floor( -(y_offset / PIXEL_TO_GRID_SCALE));
	last_row = first_row + ceil(height / PIXEL_TO_GRID_SCALE) + 1;
	if(first_row < 0){
		first_row = 0;
	}
	else if(first_row >= grid[0].length){
		first_row = grid[0].length;
	}

	if(last_row < 0){
		last_row = 0;
	}
	else if(last_row >= grid[0].length){
		last_row = grid[0].length;
	}
}

function getGaussianTreeThreshold(density, radius, column_rel_to_origin)
{
	return (density / 100) * pow(2, -pow(column_rel_to_origin, 2) / (2 * pow(radius, 2)));
}

/* ##### GENERATION FUNCTIONS ##### */







function recursiveRockSmoothLeft(x, h, w, step_size_left)
{

	for(col = x; col < x + w; col++)	// write heights to rock heights[]
	{
		if(h < g_height)
		{
			rock_heights[col] = h;
		}
		else
		{
			rock_heights[col] = g_height -1;
		}
	}


	if(step_size_left <= 1 || w <= 1)
	{
		return;	// finished if step is acceptable (goes down, or go up by only one)
	}
	// create a rectangle that has a random size and is nestled into the corner
	var new_chunk_height = floor(random(1, step_size_left));
	var new_chunk_width = floor(random(1, w));

  var r, g, b;
  r = round(random(90, 128));
  g = round(random(90, 128));
  b = round(random(90, 128));
	gRect(x, g_height - (h + new_chunk_height), new_chunk_width, new_chunk_height, r, b, g);



	// recursive call for new rectangle in both new corners
	recursiveRockSmoothLeft(x, h + new_chunk_height, new_chunk_width, step_size_left - new_chunk_height);
	recursiveRockSmoothLeft(x + new_chunk_width, h, w - new_chunk_width, new_chunk_height);
}


function recursiveRockSmoothRight(x, h, w, step_size_right)
{
	for(col = x; col < x + w; col++)	// write heights to rock heights[]
	{
		if(h < g_height)
		{
			rock_heights[col] = h;
		}
		else
		{
			rock_heights[col] = g_height -1;
		}
	}

	if(step_size_right <= 1 || w <= 1)
	{
		return;	// finished if step is acceptable (goes down, or go up by only one)
	}
	// create a rectangle that has a random size and is nestled into the corner
	var new_chunk_height = floor(random(1, step_size_right));
	var new_chunk_width = floor(random(1, w));

  var r, g, b;
  r = round(random(90, 128));
  g = round(random(90, 128));
  b = round(random(90, 128));
	gRect(x + (w - new_chunk_width), g_height - (h + new_chunk_height), new_chunk_width, new_chunk_height, r, b, g);

	// recursive call for new rectangle in both new corners
	recursiveRockSmoothRight(x + (w - new_chunk_width), h + new_chunk_height, new_chunk_width, step_size_right - new_chunk_height);
	recursiveRockSmoothRight(x, h, w - new_chunk_width, new_chunk_height);
}







function generate() {

	// Get the values of the HTML sliders
	updateUIParams();

  NEW_COLUMNS_TO_ADD = USR_ROCK_COL_WIDTH;

// Create and draw grid
  initGrid();
  generateSky();
  generateClouds(0, g_width);
  generateRock(0, g_width);
  generateUndergroundRocks(0, g_width);
  generateSediment(0, g_width);
  generateTopsoil(0, g_width);
  generateAllTrees();
  drawGrid();
}


function setColumnsToSky(begin_col, end_col)
{
	gRect(begin_col, 0, end_col - begin_col, g_height, 132, 198, 237);
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    x_offset -= PIXEL_TO_GRID_SCALE;
    console.log(x_offset);
  } else if (keyCode === RIGHT_ARROW) {
    x_offset += PIXEL_TO_GRID_SCALE;
    console.log(x_offset);
  }

  if(key == 'a')
  {
  	console.log("x_offset: " + x_offset);
  	console.log("y_offset: "  + y_offset);
  	console.log("g_width: " + g_width);
  	console.log("g_height: "  + g_height);
  	console.log("Right_Buffer: " + (g_width - ( ((-x_offset) + width) /PIXEL_TO_GRID_SCALE)));
  }
}



function mouseWheel(event) {
	if(event.delta > 0)	//scrolling OUT
	{
		if(PIXEL_TO_GRID_SCALE > 10)
		{
			PIXEL_TO_GRID_SCALE -= event.delta / 100;
			x_offset += round(mouseX / PIXEL_TO_GRID_SCALE);
			y_offset += round(mouseY / PIXEL_TO_GRID_SCALE);
		}

	}
	else	// scrolling IN
	{
		if (PIXEL_TO_GRID_SCALE < 40)
		{
			PIXEL_TO_GRID_SCALE -= event.delta / 100;
			x_offset -= round(mouseX / PIXEL_TO_GRID_SCALE);
			y_offset -= round(mouseY / PIXEL_TO_GRID_SCALE);
		}

	}
	console.log(event.delta);
}



function mouseDragged()
{
	if(mouseX > 250 && mouseX < width)
	{
		if(mouseY > 0 && mouseY < height)
		{
			x_offset += (mouseX - pmouseX);
			y_offset += (mouseY - pmouseY);
			if(y_offset > 0)
			{
				y_offset = 0;
			}
			if(y_offset < -3018)
			{
				y_offset = -3018;
			}
		}
	}
}


function draw()
{
	drawGrid();

/*
	var right_buffer = g_width - ( ((-x_offset) + width) /PIXEL_TO_GRID_SCALE);
	if(right_buffer < NEW_GENERATION_BUFFER)
	{

		//NEW_COLUMNS_TO_ADD = g_width + x_offset;
		addColumns();
		setColumnsToSky(g_width - NEW_COLUMNS_TO_ADD * 2, g_width - NEW_COLUMNS_TO_ADD);
		drawCloud(g_width - NEW_COLUMNS_TO_ADD, g_width);
		drawRockColumns(g_width - NEW_COLUMNS_TO_ADD * 2, g_width);
		generateTopsoil(g_width - NEW_COLUMNS_TO_ADD * 2, g_width);
	}
	*/
}

var rockColWidthSlider = document.getElementById("rockColWidthRange");
var rockColWidthOutput = document.getElementById("rockColWidthNumber");
rockColWidthOutput.innerHTML = rockColWidthSlider.value;
rockColWidthSlider.oninput = function() {
  rockColWidthOutput.innerHTML = this.value;
}

var sinAmpSlider = document.getElementById("sinAmpRange");
var sinAmpOutput = document.getElementById("sinAmpNumber");
sinAmpOutput.innerHTML = sinAmpSlider.value;
sinAmpSlider.oninput = function() {
  sinAmpOutput.innerHTML = this.value;
}

var sinFreqSlider = document.getElementById("sinFreqRange");
var sinFreqOutput = document.getElementById("sinFreqNumber");
sinFreqOutput.innerHTML = sinFreqSlider.value;
sinFreqSlider.oninput = function() {
  sinFreqOutput.innerHTML = this.value;
}

var sinDeviationSlider = document.getElementById("sinDeviationRange");
var sinDeviationOutput = document.getElementById("sinDeviationNumber");
sinDeviationOutput.innerHTML = sinDeviationSlider.value;
sinDeviationSlider.oninput = function() {
  sinDeviationOutput.innerHTML = this.value;
}

var mtnHeightSlider = document.getElementById("mtnHeightRange");
var mtnHeightOutput = document.getElementById("mtnHeightNumber");
mtnHeightOutput.innerHTML = mtnHeightSlider.value;
mtnHeightSlider.oninput = function() {
  mtnHeightOutput.innerHTML = this.value;
}

var cloudNumSlider = document.getElementById("cloudNumRange");
var cloudNumOutput = document.getElementById("cloudNumNumber");
cloudNumOutput.innerHTML = cloudNumSlider.value;
cloudNumSlider.oninput = function() {
  cloudNumOutput.innerHTML = this.value;
}

var cloudHeightSlider = document.getElementById("cloudHeightRange");
var cloudHeightOutput = document.getElementById("cloudHeightNumber");
cloudHeightOutput.innerHTML = cloudNumSlider.value;
cloudHeightSlider.oninput = function() {
  cloudHeightOutput.innerHTML = this.value;
}

var cloudWidthSlider = document.getElementById("cloudWidthRange");
var cloudWidthOutput = document.getElementById("cloudWidthNumber");
cloudWidthOutput.innerHTML = cloudWidthSlider.value;
cloudWidthSlider.oninput = function() {
  cloudWidthOutput.innerHTML = this.value;
}

var cloudMaxHSlider = document.getElementById("cloudMaxHRange");
var cloudMaxHOutput = document.getElementById("cloudMaxHNumber");
cloudMaxHOutput.innerHTML = cloudMaxHSlider.value;
cloudMaxHSlider.oninput = function() {
  cloudMaxHOutput.innerHTML = this.value;
}

var cloudMaxWSlider = document.getElementById("cloudMaxWRange");
var cloudMaxWOutput = document.getElementById("cloudMaxWNumber");
cloudMaxWOutput.innerHTML = cloudMaxWSlider.value;
cloudMaxWSlider.oninput = function() {
  cloudMaxWOutput.innerHTML = this.value;
}


/*
function generateAllTrees()
{
	var MIN_FOREST_INTERVAL = 100;
	var MAX_FOREST_INTERVAL = 200;
	var MIN_FOREST_SIZE = 50;
	var MAX_FOREST_SIZE = 150;
	var TREE_INTERVAL = 5;

	var forest_origins = [];	// array of the origin points of each forest

	{	// generate forest origins
		forest_number = 0;
		forest_origins[forest_number] = round(random(0, MIN_FOREST_INTERVAL));
		while(forest_origins[forest_number] < g_width)
		{
			forest_number++;
			forest_origins[forest_number] = forest_origins[forest_number -1] + round(random(MIN_FOREST_INTERVAL, MAX_FOREST_INTERVAL));
		}
	}

	for(i = 0; i < forest_origins.length; i++)	// For each forest
	{
		console.log("forest at: " + forest_origins[i]);
		var forest_radius = round(random(MIN_FOREST_SIZE /2, MAX_FOREST_SIZE /2));
		for(distance_from_origin = 1; distance_from_origin < forest_radius; distance_from_origin++)
		{
			if(random(1) < getGaussianTreeThreshold(80, 15, distance_from_origin))
			{
				distance_from_origin += TREE_INTERVAL;
				if(forest_origins[i] + distance_from_origin < g_width)
				{
					generateTree(forest_origins[i] + distance_from_origin);
				}
				//console.log("new tree at: " + distance_from_origin);
			}
			if(random(1) < getGaussianTreeThreshold(80, 15, distance_from_origin))
			{
				distance_from_origin += TREE_INTERVAL;
				if(forest_origins[i] - distance_from_origin > 0)
				{
					generateTree(forest_origins[i] - distance_from_origin);
				}
				//console.log("new tree at: " + distance_from_origin);
			}
		}
	}
}





function generateTree(x_origin)
{
	var MIN_ROOT_LENGTH = 1;
	var MAX_ROOT_LENGTH = 5;
	var MAX_TREE_HEIGHT = 25;
	var MIN_TREE_HEIGHT = 8;
	var MIN_TREE_WIDTH = 1;
	var MAX_TREE_WIDTH = 1;

	var tree_width = round(random(MIN_TREE_WIDTH, MAX_TREE_WIDTH));
	var tree_height = round(random(MIN_TREE_HEIGHT, MAX_TREE_HEIGHT));

	var root_length_left = 5 //round(random(MIN_ROOT_LENGTH, MAX_ROOT_LENGTH));
	var root_length_right = 5 //round(random(MIN_ROOT_LENGTH, MAX_ROOT_LENGTH));
	console.log(root_length_left);

	gRect(x_origin, g_height - rock_heights[x_origin], 1, 1, 89, 53, 4);	// origin pixel
	//console.log("tree_base_height[" + x_origin + "] = " + rock_heights[x_origin]);
	var root_height = rock_heights[x_origin];
	for(lr = 1; lr < root_length_left; lr++)	// lay left root in topsoil
	{
		gRect(x_origin - lr, g_height - root_height, 1, 1, 89, 53, 4);
		if(random(1) > 0.5)
		{
			gRect(x_origin - lr, g_height - root_height + 1, 1, 1, 89, 53, 4);
			root_height--;
		}
	}
	root_height = rock_heights[x_origin];
	for(rr = 1; rr < root_length_right; rr++)	// lay right root in topsoil
	{
		gRect(x_origin + rr, g_height - root_height, 1, 1, 89, 53, 4);
		if(random(1) > 0.5)
		{
			gRect(x_origin + rr, g_height - root_height + 1, 1, 1, 89, 53, 4);
			root_height--;
		}
	}

	// generate trunk
	var left = x_origin - floor(tree_width/2);
	gRect(left, g_height - rock_heights[left] - tree_height, tree_width, tree_height, 89, 53, 4);


	// generate branches
	for(distance_from_top = 0; distance_from_top < tree_height; distance_from_top++)
	{
		if(random(1) < getGaussianTreeThreshold(80, 2, distance_from_top))
		{

			generateTreeBranch(x_origin, tree_height - distance_from_top);
		}
	}
}


function generateTreeBranch(x_origin, height_of_branch_node)
{
	var tree_base_height = rock_heights[x_origin];
	//if(is_on_left_side)
	//{
		//console.log("height_of_branch_node: " + height_of_branch_node);
		console.log("tree_base_height: " + tree_base_height);
		console.log("generating branch at: " + x_origin + " and " + (g_height - tree_base_height - height_of_branch_node));
		gRect(x_origin, g_height - tree_base_height - height_of_branch_node, 1, 2, 89, 53, 4);
	//}
}

*/
