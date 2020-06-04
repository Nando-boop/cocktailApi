//Creates a list of drinks from the api with photo and title
$(document).ready(function()
{ 
    for(i = 0; i < 10; i++)
    {
        $('#ingredientCards').append('<ul class=\'cards' + i + '\'></ul>');
    }

    inorder(binaryIngredientTree.root, cardPrint);
});
