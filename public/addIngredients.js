var loggedInId = window.opener.loggedInId;

var listUrl = "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list";

$(document).ready(function()
{
    printCards(listUrl);
    
    $('#save').click(function()
    {
        var obj = {};
        obj['storageTree'] = storageTree;
        
        $.ajax (
            {
                type: "PUT",
                url: '/api/userProfiles/' + loggedInId,
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify(obj),
                dataType: 'json'
            });
    });
});