/*
  Currently, this file contains data and functions related to:
    - Getting and parsing input from the DOM
    - Setting up and maintaining the p5 canvas
    - 
  The contents of this file should possibly be divided up into other files or other classes.
  I will do this once there is enough here to make a reasonable decision about how to refactor.

  Consider moving the origin and related functions to a different file that gets included first so that all the origin can be a global.

  TODO:
  - Integrate typescript because I'm tired of bugs that don't give errors
  - In the middle of adding world class to store origin and make it easier to access. Just need to swap all
    references to origin to access it directly from the world now, instead of using parameters.
*/

// DOM Ids and elements
let ID_PARENT = 'p5-canvas-container';
let INTERFACE_DATA;

let canvas;

let tree;

let inputRaw = [];
let iterations = 0;


function setup() {
  INTERFACE_DATA = document.getElementById('interface-data');
  initializeP5Canvas();
  world = new World();
  tree = new Tree();
  tree.addTreeNode(4);
  tree.addTreeNode(5);
}


function initializeP5Canvas(){
  let parentStyle = window.getComputedStyle(document.getElementById(ID_PARENT));
  canvas = createCanvas(parseInt(parentStyle.width), parseInt(parentStyle.height));
  worldOrigin = createVector(width/2, height/2);
  canvas.parent(ID_PARENT);
}


function updateCanvasSize(){
  let parentStyle = window.getComputedStyle(document.getElementById(ID_PARENT));
  resizeCanvas(parseInt(parentStyle.width), parseInt(parentStyle.height));
}


function draw(){
  background(BG_COL);
  tree.render(worldOrigin);
}


function getInput(){
  inputRaw = [];
  parseInputData();
}


// Read input data from DOM and store it into the input array
function parseInputData(){
  let rawData = INTERFACE_DATA.value;
  let number = 0;
  let isPrevCharNumber = false;
  for(let i = 0; i < rawData.length; i++){
    let char = rawData[i];
    if(!isNaN(char) && char != ' '){ // Current char is a number
      char = parseInt(char);
      if(isPrevCharNumber){
        number *= 10;
      }
      number += char;
      isPrevCharNumber = true;
    }
    else{   // Current char is NOT a number
      if(isPrevCharNumber){
        inputRaw.push(number);
        number = 0;
        isPrevCharNumber = false;
      }
    }
  }
  // If the string ended on a number, include it too.
  if(isPrevCharNumber){
    inputRaw.push(number);
  }
}


// Logs the mouse position relative to the origin so that the 
// origin can be repositioned relative to the mouse during mouse drag.
function mousePressed(){
  if(!tree.mousePressed(worldOrigin)){
    world.mousePressed();
  }
}


function mouseReleased(){
  world.mouseReleased();
  tree.mouseReleased();
}


// Reposition the origin
function mouseDragged(){
  if(world.isDragging){
    world.mouseDragged();
  }
  else{
    tree.mouseDragged(worldOrigin);
  }
}


function keyPressed(){
  if(keyCode === ENTER){
    
  }
}


function windowResized() {
  updateCanvasSize();
}