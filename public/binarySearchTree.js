// Node class 
class Node 
{ 
    constructor(data) 
    { 
        this.data = data;
        this.favorite = false; 
        this.left = null; 
        this.right = null; 
        this.remainingIngredients = 0;
        this.ingredientsNum = 0;
    }
} 
// Binary Search tree class 
class BinarySearchTree 
{ 
    constructor() 
    { 
        // root of a binary seach tree 
        this.root = null; 
    } 

    getBalanceFactor(root) {
        return this.getHeight(root.left) - this.getHeight(root.right);
     }

    //  get hight of longest branch
    getHeight(root) {
        let height = 0;
        if (root === null || typeof root == "undefined") {
           height = -1;
        } 
        else 
        {
           height = Math.max(this.getHeight(root.left), this.getHeight(root.right)) + 1;
        }
        return height;
    }

    // helper method which creates a new node to  
    // be inserted and calls insertNode 
    insert(data, val) 
    { 
        // Creating a node and initailising  
        // with data
        if(!this.search(this.root, data)) //check that data is not already there
        {
            let newNode = new Node(data); 
            
            newNode.ingredientsNum = val;
            newNode.remainingIngredients = --val;
            // root is null then node will 
            // be added to the tree and made root. 
            if(this.root === null) 
            {
                this.root = newNode;
            }
 
            else
            {
                // find the correct position in the  
                // tree and add the node 
                this.root = this.insertNode(this.root, newNode); 
            }
        }
    } 
    
    // Method to insert a node in a tree 
    // it moves over the tree to find the location 
    // to insert a node with a given data  
    insertNode(node, newNode) 
    { 
        if(node === null)
        {
            node = newNode;
        }
        // if the data is less than the node 
        // data move left of the tree  
        else if(newNode.data < node.data) 
        { 
            node.left = this.insertNode(node.left, newNode);
            
            // the tree will rotate if the balance factor is greater than 1
            if(node.left !== null && this.getBalanceFactor(node) > 1)
            {
                if(newNode.data > node.left.data)
                {
                    node = this.rotationLL(node);
                }
                else
                {
                    node = this.rotationLR(node);
                }
            }
        } 
    
        // if the data is more than the node 
        // data move right of the tree  
        else if (newNode.data > node.data)
        { 
            node.right = this.insertNode(node.right, newNode);

            // the tree will rotate if the balance factor is less than 1
            if(node.right !== null && this.getBalanceFactor(node) < -1)
            {
                if(newNode.data > node.right.data)
                {
                    node = this.rotationRR(node);
                }
                else
                {
                    node = this.rotationRL(node);
                }
            }
        }
        return node;
    } 

    rotationLL(node)
    {
        let temp = node.left;
        
        if(temp !== null)
        {
            node.left = temp.right;
            temp.right = node;
        }
 
        return temp;
    }
    rotationRR(node) 
    {
        let temp = node.right;

        if(temp !== null)
        {
            node.right = temp.left;
            temp.left = node;
        }

        return temp;
    }
    rotationLR(node) 
    {
        node.left = this.rotationRR(node.left);
        return this.rotationLL(node);
    }
    rotationRL(node) 
    {
        node.right = this.rotationLL(node.right);
        return this.rotationRR(node);
    }

    // helper method that calls the  
    // removeNode with a given data 
    setVal(num)
    {
        this.ingredientsNum = num;
    }
    remove(data) 
    { 
        // root is re-initialized with 
        // root of a modified tree. 
        this.root = this.removeNode(this.root, data); 
    } 
    
    // Method to remove node with a  
    // given data 
    // it recurrs over the tree to find the 
    // data and removes it 
    removeNode(node, key) 
    { 
            
        // if the root is null then tree is  
        // empty 
        if(node === null) 
            return null; 
    
        // if data to be delete is less than  
        // roots data then move to left subtree 
        else if(key < node.data) 
        { 
            node.left = this.removeNode(node.left, key); 
            return node; 
        } 
    
        // if data to be delete is greater than  
        // roots data then move to right subtree 
        else if(key > node.data) 
        { 
            node.right = this.removeNode(node.right, key); 
            return node; 
        } 
    
        // if data is similar to the root's data  
        // then delete this node 
        else
        { 
            // deleting node with no children 
            if(node.left === null && node.right === null) 
            { 
                node = null; 
                return node; 
            } 
    
            // deleting node with one children 
            if(node.left === null) 
            { 
                node = node.right; 
                return node; 
            } 
            
            else if(node.right === null) 
            { 
                node = node.left; 
                return node; 
            } 
    
            // Deleting node with two children 
            // minumum node of the rigt subtree 
            // is stored in aux 
            var aux = this.findMinNode(node.right); 
            node.data = aux.data; 
    
            node.right = this.removeNode(node.right, aux.data); 
            return node; 
        } 
    
    } 

    inorder(node, func) 
    { 
        if(node !== null) 
        { 
            this.inorder(node.left); 
            func(node); 
            this.inorder(node.right); 
        } 
    } 
    preorder(node, visit) 
    { 
        if(node != null) 
        { 
            visit(node.data); 
            this.preorder(node.left); 
            this.preorder(node.right); 
        } 
    } 
    postorder(node, visit) 
    { 
        if(node != null) 
        { 
            this.postorder(node.left); 
            this.postorder(node.right); 
            visit(node.data); 
        } 
    } 
    //  finds the minimum node in tree 
    // searching starts from given node 
    findMinNode(node) 
    { 
        // if left of a node is null 
        // then it must be minimum node 
        if(node.left === null) 
            return node; 
        else
            return this.findMinNode(node.left); 
    } 
    // returns root of the tree 
    getRootNode() 
    { 
        return this.root; 
    } 
    // search for a node with given data 
    search(node, data) 
    { 
        var nodeTemp;
        // fixes inconsistent capitalization in api to allow comparisons
        if(node != null)
        {
            nodeTemp = node.data.toLowerCase();
            data = data.toLowerCase();
        } 
        // if tree is empty return null 
        if(node === null) 
            return null; 
    
        // if data is less than node's data 
        // move left 
        else if(data < nodeTemp) 
            return this.search(node.left, data); 
    
        // if data is greater than node's data 
        // move right 
        else if(data > nodeTemp) 
            return this.search(node.right, data); 
    
        // if data is equal to the node data  
        // return node 
        else
            return node; 
    }
}