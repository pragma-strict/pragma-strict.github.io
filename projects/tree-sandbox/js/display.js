/*
   This class will contain the p5 canvas and all methods related to things that are displayed on the canvas. In its first version, it will just be a set of methods for generating, displaying, and updating trees. This class is not used at the moment 
*/

class Display{
   constructor(parentID){
      this.parentID = parentID;
      this.canvas;
      this.initializeP5Canvas();
      this.initializeTree();
      this.render();
   }
   
   initializeP5Canvas(){
      let parentStyle = window.getComputedStyle(document.getElementById(this.parentID));
      this.canvas = createCanvas(parseInt(parentStyle.width), parseInt(parentStyle.height));
      this.canvas.parent(this.parentID);
   }
   
   initializeTree(){
      this.heap = new Heap();
   }

   updateCanvasSize(){
      let parentStyle = window.getComputedStyle(document.getElementById(ID_PARENT));
      resizeCanvas(parseInt(parentStyle.width), parseInt(parentStyle.height));
      this.render();
   }

   render(){
      background(BG_COL);
      let rootNodePos = new p5.Vector(width/2, height/4);
      this.heap.renderRecursive(0, 0, rootNodePos);
   }
}