
class BinaryNode{
   constructor(value){
      this.value = value;
      this.left = null;
      this.right = null;
   }

   insert(node){
      if(node.value <= this.value){
         if(this.left){
            this.left.insert(node);
         }
         else{
            this.left = node;
         }
      }
      else{
         if(this.right){
            this.right.insert(node);
         }
         else{
            this.right = node;
         }
      }
   }

   setValue(value){
      this.value = value;
   }

   setLeft(left){
      this.left = left;
   }

   setRight(right){
      this.right = right;
   }

   hasLeft(){
      if(this.left){
         return true;
      }
      return false;
   }

   hasRight(){
      if(this.right){
         return true;
      }
      return false;
   }

   isLeaf(){
      return this.hasRight() || this.hasLeft();
   }

   setChildren(left, right){
      this.left = left;
      this.right = right;
   }

   render(pos, size, color){
      fill(color);
      noStroke();
      ellipse(pos.x, pos.y, size);
      if(this.value){
         fill(255);
         textAlign(CENTER, CENTER);
         text(this.value, pos.x, pos.y)
      }
   }

   renderRecursive(pos, size, selectedNode){
      // Render lines to left and right children first
      let leftPos = new p5.Vector(pos.x - size, pos.y + size);
      let rightPos = new p5.Vector(pos.x + size, pos.y + size);
      if(this.left){
         strokeWeight(2);
         stroke(0);
         line(pos.x, pos.y, leftPos.x, leftPos.y);
      }
      if(this.right){
         strokeWeight(2);
         stroke(0);
         line(pos.x, pos.y, rightPos.x, rightPos.y);
      }
      
      // Render this node
      let color = 0;
      if(selectedNode === this){
         color = RED;
      }
      this.render(pos, size, color)

      // Render left and right children
      if(this.left){
         this.left.renderRecursive(leftPos, size, selectedNode);
      }
      if(this.right){
         this.right.renderRecursive(rightPos, size, selectedNode);
      }
   }
}