

function generateSky()
{
	gRect(0, 0, g_width, g_height, 132, 198, 237);
}



function generateClouds(begin_col, end_col) {
  cloudNum = USR_CLOUD_NUM;
  var cloudH = USR_CLOUD_HEIGHT;
  var cloudW = USR_CLOUD_WIDTH;
  first_row = 0;
  last_row = g_height/2;
  x_cloud = 0;
  y_cloud = 0;

  var cloudArr = [];
  for( var index = 0; index < cloudNum; index++ )
  {
    cloudH = round(random(1, USR_CLOUD_HEIGHT));
    cloudW = round(random(1, USR_CLOUD_WIDTH));
    x_cloud = round(random(begin_col, end_col));
	//console.log("w: " + cloudW + ", h: " + cloudH);
    y_cloud = round(random(first_row, last_row));
    //console.log(last_col, last_row);
    //console.log(x_cloud, y_cloud);
    /*var r , g , b;
    r = round(random(204, 255));
    g = round(random(204, 255));
    b = round(random(204, 255));*/
    gRect(x_cloud, y_cloud, cloudW, cloudH, 255, 255, 255);
  }

}



function generateRock(col_begin, col_end)	// draw all columns
{
	var counter = 0;
	var rock_col_heights = [];
	for(var col = col_begin; col < col_end; col += USR_ROCK_COL_WIDTH)
	{
		var random_offset = round(random(-USR_SIN_DEVIATION, USR_SIN_DEVIATION));
		rock_col_heights[counter] = random_offset + (USR_MTN_HEIGHT + round(USR_SIN_AMP * sin(col / USR_SIN_FREQ)));
		console.log("here we go!");
		generateSingleColumn(col, USR_ROCK_COL_WIDTH, rock_col_heights[counter]);

		//console.log("for range: " + col + " - " + (col + USR_ROCK_COL_WIDTH));

		for(gcol = col; gcol < col + USR_ROCK_COL_WIDTH; gcol++)	// write heights to rock heights[]
		{
			//console.log("setting height at: " + gcol + " to: " + rock_col_heights[counter]);
			if(rock_col_heights[counter] < g_height)
			{
				rock_heights[gcol] = rock_col_heights[counter];
			}
			else
			{
				rock_heights[gcol] = g_height -1;
			}
			//console.log("rock_heights[" + gcol + "] = " + rock_col_heights[counter]);
		}
		counter++;
	}


	for(var col = 1; col < rock_col_heights.length; col++)
	{
		if(rock_col_heights[col -1] > rock_col_heights[col])
		{
			recursiveRockSmoothLeft((col * USR_ROCK_COL_WIDTH) + col_begin, rock_col_heights[col], USR_ROCK_COL_WIDTH, rock_col_heights[col -1] - rock_col_heights[col]);
		}
		if(rock_col_heights[col -1] < rock_col_heights[col])
		{
			recursiveRockSmoothRight(((col -1) * USR_ROCK_COL_WIDTH) + col_begin, rock_col_heights[col -1], USR_ROCK_COL_WIDTH, rock_col_heights[col] - rock_col_heights[col -1]);
		}
	}
}



function generateSingleColumn(grid_x, col_width, col_height)	// draw a single column
{
	var r, g, b;
	r = round(random(90, 128));
	g = round(random(90, 128));
	b = round(random(90, 128));
	gRect(grid_x, g_height - col_height, col_width, col_height, r, g, b);
}








function generateUndergroundRocks(begin_col, end_col)
{
	MAX_DEPTH = 100;
	for(current_col = begin_col; current_col < end_col; current_col++)
	{
		for(depth = 0; depth < MAX_DEPTH; depth++)
		{
			if(depth > rock_heights[current_col])
			{
				break;
			}
			if(random(1) < getGaussianTreeThreshold(56, 10, depth))
			{
				var r, g, b;
				  r = round(random(90, 128));
				  g = round(random(90, 128));
				  b = round(random(90, 128));
				gRect(current_col, g_height - rock_heights[current_col] + depth, 1, 1, r, g, b);
			}
		}
		
	}
}


function generateSedimentLayer(layer, thickness, begin_col, end_col, variance, intensity, falloff, rIn, gIn, bIn)
{
	
	for(current_col = begin_col; current_col < end_col; current_col++)
	{
		for(dist_from_layer = 0; dist_from_layer < thickness; dist_from_layer++)
		{
			if(layer + dist_from_layer > rock_heights[current_col])
			{
				break;
			}
			if(random(1) < getGaussianTreeThreshold(intensity, falloff, dist_from_layer))
			{
				var r, g, b;
				  r = rIn + round(random(-variance, variance));
				  g = gIn + round(random(-variance, variance))
				  b = bIn + round(random(-variance, variance));
				gRect(current_col, g_height - layer - dist_from_layer, 1, 1, r, g, b);
			}
			if(random(1) < getGaussianTreeThreshold(intensity, falloff, dist_from_layer))
			{
				var r, g, b;
				  r = rIn + round(random(-variance, variance));
				  g = gIn + round(random(-variance, variance))
				  b = bIn + round(random(-variance, variance));
				gRect(current_col, g_height - layer + dist_from_layer, 1, 1, r, g, b);
			}
		}
	}
	
}


function generateSediment(begin_col, end_col)
{
	generateSedimentLayer(50, 5, begin_col, end_col, 10, 50, 3, 90, 90, 90);
	generateSedimentLayer(35, 3, begin_col, end_col, 10, 80, 5, 90, 80, 80);
	generateSedimentLayer(25, 4, begin_col, end_col, 10, 80, 5, 100, 80, 80);
}


function generateTopsoil( begin_col, end_col )
{
	for(num = begin_col; num < end_col; num++)
	{
    var r, g, b
		//console.log("height " + rock_heights[num]);
		//console.log("generating topsoil at: " + num + ", " + rock_heights[num]);
    r = round(random(102, 153));
    g = round(random(51, 102));
    b = round(random(0, 51));
		gRect(num, g_height - rock_heights[num], 1, 3, r, g, b);

    r = round(random(0, 102));
    g = round(random(153, 255));
    b = round(random(51, 102));
		gRect(num, g_height - rock_heights[num] - 1, 1, 1, r, g, b);

		if(random(1) > 0.9)
		{
		 //addFlower(num);
		}
		

    var random_boolean = Math.random() > 0.8;

    var treeGrowChance = 0.5;
    var treeGrow = Math.random() > treeGrowChance;
    treeHeight = g_height - rock_heights[num] - 4

    var treeGreenChance = 0.4;
    var treeGreen = Math.random() > treeGreenChance;

    if ( random_boolean == true )
    {
      gRect(num, treeHeight, 1, 4, 102, 51, 0);
      while(treeGrow == true) {
        treeHeight = treeHeight - 1;
        gRect(num, treeHeight, 1, 4, 102, 51, 0);
        treeGrowChance = treeGrowChance + 0.1;
        treeGrow = Math.random() >treeGrowChance;
      }
      treeHeight = treeHeight - 1;
      //console.log(num);

      if ( num - 1 > 0 ) {
        gRect(num-1, treeHeight, 3, 3, 0, 102, 0);

        while(treeGreen == true ) {
          g = round(random(102, 153));
          treeHeight = treeHeight - 1;
          gRect(num-1, treeHeight, 3, 3, 0, g, 0);
          treeGreenChance = treeGreenChance + 0.1;
          treeGreen = Math.random() > treeGreenChance;
        }
        g = round(random(102, 153));
        treeHeight = treeHeight - 1;
        gRect(num, treeHeight, 1, 1, 0, g, 0);
      }

    }

		//line(num * PIXEL_TO_GRID_SCALE, rock_heights[num], (num +1) * PIXEL_TO_GRID_SCALE, rock_heights[num]);
	}
}


function addFlower(x_origin)
{
	r = round(random(102, 255));
    g = round(random(0, 50));
    b = round(random(0, 50));
	gRect(x_origin, g_height - rock_heights[x_origin] - 1, 1, 1, r, g, b);
}


function generateAllTrees()
{
	var MIN_FOREST_INTERVAL = 100;
	var MAX_FOREST_INTERVAL = 200;
	var MIN_FOREST_SIZE = 50;
	var MAX_FOREST_SIZE = 150;
	var TREE_INTERVAL = 0;

	var forest_origins = [];	// array of the origin points of each forest




	{	// generate forest origins
		forest_number = 0;
		forest_origins[forest_number] = round(random(0, MIN_FOREST_INTERVAL));
		console.log("origin: " + forest_origins[forest_number]);
		while(forest_origins[forest_number] < g_width)
		{console.log("orign added");
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
			if(random(1) < getGaussianTreeThreshold(90, 20, distance_from_origin))
			{
				distance_from_origin += TREE_INTERVAL;
				if(forest_origins[i] + distance_from_origin < g_width)
				{
					addFlower(forest_origins[i] + distance_from_origin);
				}
				console.log("new tree at: " + distance_from_origin);
			}
			if(random(1) < getGaussianTreeThreshold(90, 20, distance_from_origin))
			{
				distance_from_origin += TREE_INTERVAL;
				if(forest_origins[i] - distance_from_origin > 0)
				{
					addFlower(forest_origins[i] - distance_from_origin);
				}
				console.log("new tree at: " + distance_from_origin);
			}
		}
	}
}