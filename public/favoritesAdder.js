var loggedInId = window.opener.loggedInId;

$(document).ready(function()
{   
    $.getJSON('/api/userProfiles/' + loggedInId, function(data)
    {
        $('#ingredientCards').append('<ul class=\'cards\'></ul>');
        drinkQ = data.drinkQueue;
        inorder(data.favorites.root, printFaves);
        cardSelector();
    });
});
function printFaves(node)
{
    var printUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    let data = node.data;

    /*stored in new variable so the name can be adapted for 
    the search without changing the display name */
    var drinkName = data;
    var searchName = drinkName;
    
    //replaces spaces in drink names to help find photo url
    if(drinkName.includes(" ", 0))
    {
        searchName = drinkName.replace(/ /g, "%20");
    }

    printUrl += searchName;
    
    $.getJSON(printUrl, function(data) 
    {
        $('.cards').append('<ul><i class=\"fas fa-star\"></i><img src=\''+ data.drinks[0].strDrinkThumb + '\'><li>' + drinkName + '</li></ul>');
        $('.fas fa-star').css({'color': 'yellow'});
    }, 'json');
}