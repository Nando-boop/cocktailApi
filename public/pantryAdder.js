$(document).ready(function()
{   
    inorder(storageTree.root, printPantry);
    $('#delete').click(function()
    {
        inorder(storageTree.root, deleter);
    });
    
    $('#addMore').click(function()
    {
        window.open('/searchIngredient.html');
    });
});