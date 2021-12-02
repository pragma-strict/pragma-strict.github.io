
class BinaryTree{
   constructor(){
      this.rootNode;
      this.rootPos;
      this.selectedNode;
      this.nodeSize;
      this.traversalStack = [];
   }


   addNode(value){
      let newNode = new BinaryNode(value);
      if(!this.rootNode){
         this.rootNode = newNode;
      }
      else{
         this.rootNode.insert(newNode);
      }
      this.selectedNode = newNode;
      this.render();
   }


   // Recursively return an array containing each node in a pre-order traversal.
   getPreorderTraversal(node, traversal){
      traversal.push(node);
      if(node.hasLeft()){
         traversal.concat(this.getPreorderTraversal(node.left, traversal));
      }
      if(node.hasRight()){
         traversal.concat(this.getPreorderTraversal(node.right, traversal));
      }
      return traversal;
   }


   // Recursively return an array containing each node in an in-order traversal.
   getInorderTraversal(node, traversal){
      if(node.hasLeft()){
         traversal.concat(this.getPreorderTraversal(node.left, traversal));
      }
      traversal.push(node);
      if(node.hasRight()){
         traversal.concat(this.getPreorderTraversal(node.right, traversal));
      }
      return traversal;
   }


   // Recursively return an array containing each node in a post-order traversal.
   getPostorderTraversal(node, traversal){
      if(node.hasLeft()){
         traversal.concat(this.getPreorderTraversal(node.left, traversal));
      }
      if(node.hasRight()){
         traversal.concat(this.getPreorderTraversal(node.right, traversal));
      }
      traversal.push(node);
      return traversal;
   }


   // Return an array containing each node in a level-order traversal.
   getLevelOrderTraversal(node){
      let currentLevel = [node];
      let nextLevel = [];
      let traversal = currentLevel;
      let currentDepth = 1;
      let isLastLevel;

      while(!isLastLevel){
         isLastLevel = true;

         // Go through all the nodes in this level and add their children to the next level
         for(let i = 0; i < currentLevel.length; i++){
            let left = currentLevel[i].left;
            let right = currentLevel[i].right;
            if(left){
               nextLevel.push(left);
               isLastLevel = false;
            }
            if(right){
               nextLevel.push(right);
               isLastLevel = false;
            }
         }

         currentLevel = [...nextLevel];
         traversal.push(...currentLevel);
         nextLevel = [];
         currentDepth++;
      }
      return traversal;
   }


   getTreeHeight(){
      let currentLevel = [this.rootNode];
      let nextLevel = [];
      let currentDepth = 0;
      let isLastLevel;

      while(!isLastLevel){
         isLastLevel = true;

         // Go through all the nodes in this level and add their children to the next level
         for(let i = 0; i < currentLevel.length; i++){
            let left = currentLevel[i].left;
            let right = currentLevel[i].right;
            if(left){
               nextLevel.push(left);
               isLastLevel = false;
            }
            if(right){
               nextLevel.push(right);
               isLastLevel = false;
            }
         }

         currentLevel = [...nextLevel];
         nextLevel = [];
         currentDepth++;
      }
      return currentDepth;
   }


   setRootPosition(rootPos){
      this.rootPos = rootPos;
   }

   setNodeSize(nodeSize){
      this.nodeSize = nodeSize;
   }

   render(){
      if(this.rootNode){
         this.rootNode.renderRecursive(this.rootPos, this.nodeSize, this.selectedNode);
      }
   }
}