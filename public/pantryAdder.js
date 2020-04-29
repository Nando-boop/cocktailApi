var loggedInId = window.opener.loggedInId;
var userTree;

$(document).ready(function()
{   
    pantryPrint();
    
    $('#delete').click(function()
    {
        storageTree.inorder(storageTree.root, deleter);
    });
    
    $('#addMore').click(function()
    {
        window.open('/searchIngredient.html');
    });
});
function pantryPrint()
    {
        $('#ingredientCards').empty();
        $.getJSON('/api/userProfiles/' + loggedInId, function(data)
        {
            inorder(data.storageTree.root, printPantry);
            userTree = new BinarySearchTree;
            userTree.root = data.storageTree.root;
        });
    }
function deleter(node)
{
    userTree.remove(node.data);
    storageTree = userTree;

    var obj = {
        'storageTree': storageTree
    }
        
    $.ajax (
    {
        type: "PUT",
        url: '/api/userProfiles/' + loggedInId,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify(obj),
        dataType: 'json'
    });
    pantryPrint();
}
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