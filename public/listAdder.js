$(document).ready(function()
{
    $.getJSON('/api/userProfiles/' + loggedInId, function(data)
    {
        $('#shoppingList').append('<ul class=\'shopList\'></ul>');
        shoppingList = data.shoppingList;
        console.log(shoppingList.length);
        let length = shoppingList.length;
        for(i = 0; i < length; i++)
        {
            $('#shoppingList').append('<li>' + shoppingList[i] + '</li>');
        }
    });
});