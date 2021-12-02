// DOM Ids and elements
let ID_PARENT = 'p5-canvas-container';
let INTERFACE_DATA;
let INTERFACE_OUT_UNSORTED;
let INTERFACE_OUT_SORTED;

let p5Display;
let input_raw = [];
let input_sorted = [];
let iterations = 0;


function setup() {
  p5Display = new Display(ID_PARENT);
  INTERFACE_DATA = document.getElementById('interface-data');
  INTERFACE_OUT_UNSORTED = document.getElementById('interface-out-unsorted');
  INTERFACE_OUT_SORTED = document.getElementById('interface-out-sorted');
  noLoop();
}


function getInput(){
  input_raw = [];
  input_sorted = [];
  parseInputData();
}


// Read input data from DOM and store it into the input array
function parseInputData(){
  let raw_data = INTERFACE_DATA.value;
  let number = 0;
  let isPrevCharNumber = false;
  for(let i = 0; i < raw_data.length; i++){
    let char = raw_data[i];
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
        input_raw.push(number);
        number = 0;
        isPrevCharNumber = false;
      }
    }
  }
  // If the string ended on a number, include it too.
  if(isPrevCharNumber){
    input_raw.push(number);
  }
}


function keyPressed(){
  if(keyCode === ENTER){
    if(iterations < input_raw.length){
      p5Display.heap.addNode(input_raw[iterations]);
      if(iterations != 0){
        INTERFACE_OUT_UNSORTED.innerHTML += ", ";
      }
      INTERFACE_OUT_UNSORTED.innerHTML += input_raw[iterations];
    }
    else if(iterations < input_raw.length * 2){
      if(iterations != input_raw.length){
        INTERFACE_OUT_SORTED.innerHTML += ", ";
      }
      input_sorted.push(p5Display.heap.removeMin());
      INTERFACE_OUT_SORTED.innerHTML += input_sorted[input_sorted.length -1];
    }
    else{
      iterations = -1;
      INTERFACE_OUT_UNSORTED.innerHTML = '';
      INTERFACE_OUT_SORTED.innerHTML = '';
      input_sorted = [];
    }
    iterations++;
    p5Display.render();

    // Draw the arrays to the screen
    fill(0);
    strokeWeight(1);
    textAlign(LEFT, TOP);
    text("input: " + input_raw.slice(0, iterations), 25, 25);
    text("sorted: " + input_sorted, 25, 45);
  }
}


function windowResized() {
  p5Display.updateCanvasSize();
}