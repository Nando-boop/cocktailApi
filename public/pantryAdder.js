var loggedInId = window.opener.loggedInId;
var tree;

$(document).ready(function()
{   
    $.getJSON('/api/userProfiles/' + loggedInId, function(data)
    {
        inorder(data.storageTree.root, printPantry);
    });
    $('#ingredientSearch').click(function()
    {
        update();
    });
});
function printPantry(node)
{
    let name = node.data;
    let searchName = name;

    if(name.includes(" ", 0)){
        searchName = name.replace(/ /g, "%20");
    }

    selector();
    $('#ingredientCards').append('<ul class=\'cards\'><ul>');
    $('#ingredientCards ul:last').append('<li>' + name + '</li>')
        .append('<img src=https://www.thecocktaildb.com/images/ingredients/' + searchName + '-Medium.png>');
    selector();
}