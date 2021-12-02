
class Heap{
   constructor(){
      this.data = [];
      this.nodeSize = width / 15;
      this.highlightedIndex = 0;
   }


   // Return the index to which it was added
   addNode(value){
      this.data.push(value);
      let thisIndex = this.data.length -1;
      let parentIndex = Math.floor(thisIndex /2);
      while(value < this.data[parentIndex] && parentIndex >= 0){
         this.swapNodes(thisIndex, parentIndex);
         thisIndex = parentIndex;
         parentIndex = Math.floor(thisIndex /2);
      }
      this.highlightedIndex = thisIndex;
      return thisIndex;
   }


   addNodes(values){
      values.forEach(element => {
         this.addNode(element);
      });
   }


   // Maybe simplify this by introducing a bubbleDown function that takes an index to bubble
   removeMin(){
      // Start by swapping the first and last nodes, then removing the last
      this.swapNodes(0, this.data.length -1);
      let min = this.data.pop();

      let thisIndex = 0;   // Index of the new top node
      let swappedIndex = this.bubbleDown(thisIndex);

      // Bubble the new top node down as far as it will go
      while(thisIndex != swappedIndex){
         thisIndex = swappedIndex;
         swappedIndex = this.bubbleDown(thisIndex);
      }
      this.highlightedIndex = thisIndex;
      return min;
   }


   // Swap this node with its smallest child. Return the new index of this node.
   bubbleDown(thisIndex){
      let leftChildIndex = thisIndex * 2 + 1;
      let rightChildIndex = thisIndex * 2 + 2;
      let leftChild = null;
      let rightChild = null;
      let swapRequired = false;
      if(leftChildIndex < this.data.length){
         leftChild = this.data[leftChildIndex];
         if(leftChild < this.data[thisIndex]){
            swapRequired = true;
         }
      }
      if(rightChildIndex < this.data.length){
         rightChild = this.data[rightChildIndex];
         if(rightChild < this.data[thisIndex]){
            swapRequired = true;
         }
      }
      if(swapRequired){
         let minChildIndex = leftChildIndex; // The minchild will be the one to swap with
         if(rightChild){
            if(leftChild){ // If we have both children. Compare them.
               if(leftChild > rightChild){
                  minChildIndex = rightChildIndex;
               }
            }
            else{ // If we only have a right child.
               minChildIndex = rightChildIndex;
            }
         }
         
         // Now that we've found which child to bubble with, do the swap
         this.swapNodes(thisIndex, minChildIndex);
         return minChildIndex;
      }
      return thisIndex;
   }


   swapNodes(a_index, b_index){
      let temp = this.data[a_index];
      this.data[a_index] = this.data[b_index];
      this.data[b_index] = temp;
   }


   // Render a node. Draws in red if it is the highlighted index.
   render(index, pos){
      if(index < this.data.length){
         fill(0);
         if(index === this.highlightedIndex){
            fill(RED);
         }
         noStroke();
         ellipse(pos.x, pos.y, this.nodeSize);
         fill(255);
         textAlign(CENTER, CENTER);
         textSize(this.nodeSize/2);
         text(this.data[index], pos.x, pos.y)
      }
   }


   // Renders all nodes in the heap
   renderRecursive(index, depth, pos){
      // Render lines to left and right children first, if they exist
      strokeWeight(2);
      stroke(0);
      let leftIndex = index * 2 + 1;
      let rightIndex = index * 2 + 2;
      let minNodeSpacing = this.nodeSize + 2;
      let levelsBeforeLast = this.getHeight() - depth;
      let childOffsetX = Math.pow(2, levelsBeforeLast -1) * minNodeSpacing /4;
      let leftPos = new p5.Vector(pos.x - childOffsetX, pos.y + this.nodeSize);
      let rightPos = new p5.Vector(pos.x + childOffsetX, pos.y + this.nodeSize);
      if(leftIndex < this.data.length){
         line(pos.x, pos.y, leftPos.x, leftPos.y);
      }
      if(rightIndex < this.data.length){
         line(pos.x, pos.y, rightPos.x, rightPos.y);
      }

      // Render this node
      this.render(index, pos);

      // Render left and right children
      if(leftIndex < this.data.length){
         this.renderRecursive(leftIndex, depth + 1, leftPos);
      }
      if(rightIndex < this.data.length){
         this.renderRecursive(rightIndex, depth + 1, rightPos);
      }
   }


   // Return the height of the heap
   getHeight(){
      return Math.floor(Math.log2(this.data.length)) + 1;
   }
}