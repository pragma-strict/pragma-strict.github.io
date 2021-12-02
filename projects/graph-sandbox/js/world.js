
let world;

class World{
   constructor(){
      this.origin = createVector();
      this.isDragging = false;
      this.dragHandleCoords = createVector(); // Mouse position relative to origin whenever LMB is pressed
   }

   // Log mouse position relative to origin so that the origin can be repositioned during mouse drag.
   mousePressed(){
      this.dragHandleCoords = createVector(mouseX - worldOrigin.x, mouseY - worldOrigin.y);
      this.isDragging = true;
   }
   
   
   // 
   mouseReleased(){
      this.isDragging = false;
   }
   
   
   // Reposition the origin
   mouseDragged(){
      if(this.isDragging){
      this.origin.x = mouseX - this.dragHandleCoords.x;
      this.origin.y = mouseY - this.dragHandleCoords.y;
      }
   }
}