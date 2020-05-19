var listUrl = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list";
var ingredUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";

$(document).ready(function()
{
    printCards(listUrl);
    
    $('#save').click(function()
    {
        $('#ingredientBox').val('');

        drinkQueue = [];
        binaryIngredientTree = new BinarySearchTree;

        inorder(storageTree.root, visit);

        printCards(listUrl);
        setTimeout(function(){update();}, 1000);
    });

    $('#ingredientBox').keyup(function()
    {
        if(!$(this).val())
        {
            printCards(listUrl);
        }
        ingredUrl += $(this).val();
        $.getJSON(ingredUrl, function(data)
        {
            $('#ingredientCards').empty();
                /*stored in new variable so the name can be adapted for 
                the search without changing the display name */

                var drinkName = data.ingredients[0].strIngredient;
                var searchName = drinkName;

                //replaces spaces in drink names to help find photo url
                if(drinkName.includes(" ", 0)){
                    searchName = drinkName.replace(/ /g, "%20");
                }
                
                $('#ingredientCards').append('<ul class=\'cards\'><ul>');
                $('#ingredientCards ul:last').append('<li>' + drinkName + '</li>')
                    .append('<img src=https://www.thecocktaildb.com/images/ingredients/' + searchName + '-Medium.png>');
            selector();
        });
        ingredUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";
    });
});