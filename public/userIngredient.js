var loggedInId = window.opener.loggedInId;

$.getJSON('/api/userProfiles/' + loggedInId, function(data)
{
    storageTree.root = data.storageTree.root;
    drinkQ = data.drinkQueue; 
    favorites.root = data.favorites.root;
    shoppingList = data.shoppingList;
    queuePrinter(drinkQ);
},'json');
