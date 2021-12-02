/*
   TODO/NOTES:
   - Make the timeline (list of function calls) part of this class. Then add next/prev functions to go between them. This will save us having to use the class name in the interface methods because they won't be copied and used outside of the class. However, we might want to change the name of Display to reflect the fact that it has both display and timeline functions.
   - BETTER IDEA: timelines (steps) will be stored in a child class that will use the display methods. There could be different algorithms implemented in the subclass or there could even be another layer of subclasses with one for each algorithm.
   - Another class at the very top level of the hierarchy could be display-type independent functions such as setting up the canvas and stuff. This could be used to implement different display types.
   - Make the objects of display their own objects. Make a Bar class to hold additional information about
   the way that each bar is being displayed.
   - Give a prefix to interface methods and document them carefully.
   - Keep in mind that this would ideally be extensible enough to include other algorithms and display methods such as trees, etc. 
   - Each interface method must be reversible.
*/

/*
   Display maintains a p5.js canvas, stores some data, and has methods for displaying the data.
*/
class Display{
   constructor(parentID){
      this.parentID = parentID;
      this.canvas;
      this.data = [];
      this.initializeCanvas();
      this.bar_padding_top = 25; // Space between the top of the tallest bar and the top of the window (px)
   }


   initializeCanvas(){
      let parentStyle = window.getComputedStyle(document.getElementById(this.parentID));
      this.canvas = createCanvas(parseInt(parentStyle.width), parseInt(parentStyle.height));
      this.canvas.parent(this.parentID);
      this.render();
   }


   updateCanvasSize(){
      let parentStyle = window.getComputedStyle(document.getElementById(ID_PARENT));
      resizeCanvas(parseInt(parentStyle.width), parseInt(parentStyle.height));
      this.render();
   }


   // Interface method. Selects one of the pieces of data.
   select(index, obj, reverse = false){
      if(index){
         let newColor = color(30, 179, 0);
         if(reverse){
            newColor = 0;
         }
         obj.data[index].color = newColor;
         obj.render();
      }
   }


   // Interface method. Deselects one of the pieces of data.
   deselect(index, obj, reverse = false){
      obj.select(index, obj, !reverse);
   }


   // Interface method. Swaps two pieces of data.
   swap(i, j, obj){
      if(i >= 0 && i < obj.data.length && j >= 0 && j < obj.data.length){
         let temp = obj.data[i];
         obj.data[i] = obj.data[j];
         obj.data[j] = temp;
         obj.render();
      }
   }

   setValues(values){
      this.data = [];
      values.forEach(element => {
         this.data.push({
            value : element,
            color : 0
         });
      });
      this.render();
   }

   pushData(number){
      this.data.push({
         value : number,
         color : 0
      });
      this.render();
   }

   clearData(){
      this.data = [];
      this.render();
   }

   // Return an array of the numerical values of each data point
   getValues(){
      let values = [];
      this.data.forEach(element => {
         values.push(element.value);
      });
      return values;
   }

   render(){
      background(BG_COL);
      fill(0);
      stroke(BG_COL);
      strokeWeight(2);
      let number_of_bars = this.data.length;
      if(number_of_bars > 0){
         if(number_of_bars > 32){
            stroke(0);
            strokeWeight(1);
         }
         let bar_width = width / number_of_bars;
         // let max_number = Math.max(...this.data);
         let max_number = 25;
         for(let i = 0; i < number_of_bars; i++){
            fill(this.data[i].color);
            let bar_height = map(this.data[i].value, 0, max_number, 0, height - this.bar_padding_top);
            rect(bar_width * i, height - bar_height, bar_width, bar_height);
         }
      }
   }
}


/*
   Algorithm implements various algorithms to operate on the data stored in parent class Display. 
   Algorithm generates and maintains a sequence of methods of the Display class which show the steps
   of the algorithms visually. 
*/
class Algorithm extends Display{
   constructor(parentID){
      super(parentID);
      this.steps = [];
      this.currentStep = 0;
      this.generateSteps();
   }

   generateSteps(){
      this.steps.push({
         'func' : this.select,
         'args' : [2, this]
      });
      this.steps.push({
         'func' : this.select,
         'args' : [5, this]
      });
      this.steps.push({
         'func' : this.select,
         'args' : [6, this]
      });
      this.steps.push({
         'func' : this.swap,
         'args' : [8, 12, this]
      });
      this.steps.push({
         'func' : this.deselect,
         'args' : [5, this]
      });
   }

   // Execute the next step in the algorithm
   next(){
      if(this.currentStep < this.steps.length){
         let func = this.steps[this.currentStep]['func'];
         let args = this.steps[this.currentStep]['args'];
         func(...args)
         this.currentStep++;
      }
   }

   // Execute the previous step in the algorithm
   prev(){
      if(this.currentStep > 0){
         this.currentStep--;
         let func = this.steps[this.currentStep]['func'];
         let args = this.steps[this.currentStep]['args'];
         func(...args, true);
      }
   }
}