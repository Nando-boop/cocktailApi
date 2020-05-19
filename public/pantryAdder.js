$(document).ready(function()
{   
    inorder(storageTree.root, printPantry);
    $('#delete').click(function(e, callback)
    {
        $('#ingredientCards').empty();

        inorder(storageTree.root, printPantry);

        drinkQueue = [];
        binaryIngredientTree = new BinarySearchTree;
        
        inorder(storageTree.root, visit);
        setTimeout(function(){update();}, 500);
    });  
    $('#addMore').click(function()
    {
        window.open('/searchIngredient.html', '_top');
    });
});