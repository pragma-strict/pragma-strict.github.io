// DOM Ids and elements
let ID_PARENT = 'p5-canvas-container';
let ID_DATA = 'interface-data';
let ID_DATA_WRAPPER = 'interface-data-wrapper';
let ID_INPUT_SIZE = 'interface-input-size';
let ID_INPUT_SIZE_WRAPPER = 'interface-input-size-wrapper';
let ID_RATE = 'interface-rate';
let ID_USE_CUSTOM_DATA = 'interface-custom-data';

let INTERFACE_DATA;
let INTERFACE_INPUT_SIZE;
let INTERFACE_RATE;

let algo;

let isCustomDataEnabled = false;



function setup() {
  algo = new Algorithm(ID_PARENT);

  // Initialize interface stuff
  INTERFACE_DATA = document.getElementById(ID_DATA);
  INTERFACE_RATE = document.getElementById(ID_RATE);
  INTERFACE_INPUT_SIZE = document.getElementById(ID_INPUT_SIZE);

  noLoop();
  updateFormFieldVisibility();
  getInput();
}



function windowResized() {
  algo.updateCanvasSize();
}



// Either generates input or calls parseInputData(). Input will be ready after calling.
function getInput(){
  algo.clearData();
  if(isCustomDataEnabled){
    parseInputData();
  }
  else{
    let input_size = INTERFACE_INPUT_SIZE.value;
    for(let i = 0; i < input_size; i++){
      algo.pushData(floor(Math.random() * input_size));
    }
  }
}



function nextState(){
  algo.next();
  // if(displayPlayhead < displayTimeline.length){
  //   let operation = displayTimeline[displayPlayhead][0];
  //   let args = displayTimeline[displayPlayhead][1]
  //   operation(...args)
  //   displayPlayhead++;
  // }
}



function previousState(){
  algo.prev();
  // if(displayPlayhead > 0){
  //   displayPlayhead--;
  //   let operation = displayTimeline[displayPlayhead][0];
  //   let args = displayTimeline[displayPlayhead][1]
  //   let argsRev = [...args];
  //   argsRev[args.length -1] = !args[args.length -1]; // Invert the truth state of last argument
  //   operation(...argsRev)
  // }
}



// Runs merge sort and renders the result
function mergeSort(){
  inversionCount = 0;
  console.log(algo.getValues())
  let sortedValues = mergeSortRecursive(algo.getValues());
  console.log("Number of inversions: " + inversionCount);
  algo.setValues(sortedValues);
}



// Create a global inversion counter
let inversionCount = 0;

// Recursive mergesort that also counts inversions in the input
function mergeSortRecursive(input){
  if(input.length <= 1){  // Base case
    return input;
  }

  // Split step
  let slice_index = floor(input.length/2);
  let subArr1 = input.slice(0, slice_index);
  let subArr2 = input.slice(slice_index, input.length);
  subArr1 = mergeSortRecursive(subArr1);
  subArr2 = mergeSortRecursive(subArr2);

  // Merge step
  let sorted_list = [];
  let smallerNumber = 0;
  let subIndex1 = 0;
  let subIndex2 = 0;
  while(subIndex1 < subArr1.length && subIndex2 < subArr2.length){
    if(subArr1[subIndex1] <= subArr2[subIndex2]){
      smallerNumber = subArr1[subIndex1];
      subIndex1++;
    }
    else{
      smallerNumber = subArr2[subIndex2];
      subIndex2++;
      inversionCount += (subArr1.length - subIndex1); // Add to the inversion counter
    }
    sorted_list.push(smallerNumber);
  }
  sorted_list = sorted_list.concat(subArr1.slice(subIndex1, subArr1.length));
  sorted_list = sorted_list.concat(subArr2.slice(subIndex2, subArr2.length));

  return sorted_list;
}



// Shows and hides fields in the form depending on whether input is generated or not
function updateFormFieldVisibility(){
  let inputSizeDiv = document.getElementById(ID_INPUT_SIZE_WRAPPER);
  let dataInputDiv = document.getElementById(ID_DATA_WRAPPER);
  if(document.getElementById(ID_USE_CUSTOM_DATA).checked){
    inputSizeDiv.classList.add("hide");
    dataInputDiv.classList.remove("hide");
    isCustomDataEnabled = true;
  }
  else{
    inputSizeDiv.classList.remove("hide");
    dataInputDiv.classList.add("hide");
    isCustomDataEnabled = false;
  }
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
        algo.pushData(number);
        number = 0;
        isPrevCharNumber = false;
      }
    }
  }
  // If the string ended on a number, include it too.
  if(isPrevCharNumber){
    algo.pushData(number);
  }
}