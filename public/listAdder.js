$(document).ready(function()
{
    $.getJSON('/api/userProfiles/' + loggedInId, function(data)
    {
        if(data.shoppingList){
            $('#shoppingList').append('<ul class=\'shopList\'></ul>');
            shoppingList = data.shoppingList;
            let length = shoppingList.length;
            for(i = 0; i < length; i++)
            {
                $('#shoppingList').append('<li>' + shoppingList[i] + '</li>');
            }
        }
    });
});