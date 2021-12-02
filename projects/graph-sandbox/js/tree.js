
class Tree{
   constructor(){
      this.rootNode = new TreeNode(3);
      this.rootCoords;
      this.selectedNode;
      this.nodeSize;
      this.traversalStack = [this.rootNode];
      this.hoveredColor = color(255, 255, 255, 50);
      this.baseColor = 0;
      this.selectedColor = RED;
   }


   // Adds a new node to the tree with the given value
   addTreeNode(value){
      let newNode = new TreeNode(value);
      if(!this.rootNode){
         this.rootNode = newNode;
      }
      else{
         this.rootNode.addChild(newNode);
      }
      this.selectedNode = newNode;
      this.traversalStack = [];
      this.traversalStack = this.getPreorderTraversal(this.rootNode, this.traversalStack);
   }


   // Recursively return an array containing each node in a pre-order traversal.
   getPreorderTraversal(node, traversal){
      traversal.push(node);
      let children = node.getChildren();
      children.forEach(child => {
         traversal.concat(this.getPreorderTraversal(child, traversal));
      });
      return traversal;
   }


   setRootPosition(rootPos){
      this.rootCoords = rootPos;
   }


   setNodeSize(nodeSize){
      this.nodeSize = nodeSize;
   }


   // Return a node ref if the mouse is over a node, else false
   getHoveredNode(worldOrigin){
      for(let i = 0; i < this.traversalStack.length; i++){
         if(this.traversalStack[i].isMouseOver(worldOrigin)){
            return this.traversalStack[i];
         }
      }
      return false;
   }


   // Return a node ref if the mouse is over a node, else false. Alias for getHoveredNode()
   isMouseOver(worldOrigin){
      return this.getHoveredNode(worldOrigin);
   }


   // Return true if a node was selected
   mousePressed(worldOrigin){
      this.selectedNode = this.getHoveredNode(worldOrigin);
      if(this.selectedNode){
         this.selectedNode.mousePressed(worldOrigin);
         return true;
      }
      return false;
   }


   mouseReleased(){
      if(this.selectedNode){
         this.selectedNode.mouseReleased();
      }
   }


   mouseDragged(worldOrigin){
      if(this.selectedNode){
         this.selectedNode.mouseDragged(worldOrigin);
      }
   }


   render(worldOrigin){
      if(this.rootNode){
         for(let i = 0; i < this.traversalStack.length; i++){
            let currentNode = this.traversalStack[i];
            if(currentNode === this.selectedNode){
               currentNode.render(worldOrigin, this.selectedColor, this.hoveredColor);
            }
            else{
               currentNode.render(worldOrigin, this.baseColor, this.hoveredColor);
            }
         }
      }
   }
}



// Recursively return an array containing each node in a post-order traversal.
   // getPostorderTraversal(node, traversal){
   //    if(node.hasLeft()){
   //       traversal.concat(this.getPreorderTraversal(node.left, traversal));
   //    }
   //    if(node.hasRight()){
   //       traversal.concat(this.getPreorderTraversal(node.right, traversal));
   //    }
   //    traversal.push(node);
   //    return traversal;
   // }


   // // Return an array containing each node in a level-order traversal.
   // getLevelOrderTraversal(node){
   //    let currentLevel = [node];
   //    let nextLevel = [];
   //    let traversal = currentLevel;
   //    let currentDepth = 1;
   //    let isLastLevel;

   //    while(!isLastLevel){
   //       isLastLevel = true;

   //       // Go through all the nodes in this level and add their children to the next level
   //       for(let i = 0; i < currentLevel.length; i++){
   //          let left = currentLevel[i].left;
   //          let right = currentLevel[i].right;
   //          if(left){
   //             nextLevel.push(left);
   //             isLastLevel = false;
   //          }
   //          if(right){
   //             nextLevel.push(right);
   //             isLastLevel = false;
   //          }
   //       }

   //       currentLevel = [...nextLevel];
   //       traversal.push(...currentLevel);
   //       nextLevel = [];
   //       currentDepth++;
   //    }
   //    return traversal;
   // }


   // getTreeHeight(){
   //    let currentLevel = [this.rootNode];
   //    let nextLevel = [];
   //    let currentDepth = 0;
   //    let isLastLevel;

   //    while(!isLastLevel){
   //       isLastLevel = true;

   //       // Go through all the nodes in this level and add their children to the next level
   //       for(let i = 0; i < currentLevel.length; i++){
   //          let left = currentLevel[i].left;
   //          let right = currentLevel[i].right;
   //          if(left){
   //             nextLevel.push(left);
   //             isLastLevel = false;
   //          }
   //          if(right){
   //             nextLevel.push(right);
   //             isLastLevel = false;
   //          }
   //       }

   //       currentLevel = [...nextLevel];
   //       nextLevel = [];
   //       currentDepth++;
   //    }
   //    return currentDepth;
   // }
