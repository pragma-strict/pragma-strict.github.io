/*
   General base class for a node in a graph
*/
class Node{
   constructor(value){
      this.value = value;
      this.coordinates = createVector();
      this.size = 25;
      this.neighborRefs = [];
      this.state = 0;   // Used during traversals to avoid checking the same node more than once
      this.isDragging = false;
   }


   render(worldOrigin, baseColor, highlightColor){
      let screenPos = this.getScreenPosition(worldOrigin);
      
      // Draw lines to neighbors
      strokeWeight(2);
      stroke(0);
      for(let i = 0; i < this.neighborRefs.length; i++){
         let neighborScreenPos = this.neighborRefs[i].getScreenPosition(worldOrigin);
         line(screenPos.x, screenPos.y, neighborScreenPos.x, neighborScreenPos.y);
      }

      // Draw the ellipse
      noStroke();
      fill(baseColor);
      ellipse(screenPos.x, screenPos.y, this.size);

      // Add a highlight if mouse is over
      if(this.isMouseOver(worldOrigin)){
         fill(highlightColor);
         ellipse(screenPos.x, screenPos.y, this.size);
      }

      // Draw the text
      fill(255);
      textAlign(CENTER, CENTER);
      text(this.value, screenPos.x, screenPos.y);
   }


   // 
   addNeighbor(nodeRef){
      this.neighborRefs.push(nodeRef);
   }


   //
   removeNeighborByIndex(index){
      if(index >= 0 && index < this.neighborRefs.length){
         // perform removal
      }
   }


   // Return true if the mouse if over the node
   isMouseOver(worldOrigin){
      let nodePos = createVector(worldOrigin.x + this.coordinates.x, worldOrigin.y + this.coordinates.y)
      let mousePos = createVector(mouseX, mouseY);
      if(nodePos.dist(mousePos) <= this.size/1.5){
         return true;
      }
      return false;
   }


   mousePressed(worldOrigin){
      if(this.isMouseOver(worldOrigin)){
         this.isDragging = true;
      }
      else{
         this.isDragging = false;
      }
   }


   mouseReleased(){
      this.isDragging = false;
   }


   mouseDragged(worldOrigin){
      if(this.isDragging){
         this.coordinates.x = mouseX - worldOrigin.x;
         this.coordinates.y = mouseY - worldOrigin.y;
      }
   }


   getScreenPosition(worldOrigin){
      let screenPos = createVector();
      screenPos.x = worldOrigin.x + this.coordinates.x;
      screenPos.y = worldOrigin.y + this.coordinates.y;
      return screenPos;
   }
}


/*
   General base class for a node that's part of a tree
*/
class TreeNode extends Node{
   constructor(value){
      super(value);
   }

   hasChildren(){
      if(this.neighborRefs.length > 0){
         return true;
      }
      return false;
   }

   addChild(nodeRef){
      this.neighborRefs.push(nodeRef);
   }

   getChildren(){
      return this.neighborRefs;
   }

   getChildByIndex(index){
      return this.neighborRefs[index];
   }
}