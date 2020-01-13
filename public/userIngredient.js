var loggedInId = window.opener.loggedInId;

$.getJSON('/api/userProfiles/' + loggedInId, function(data)
{
    let drinkQ = data.drinkQueue;
    queuePrinter(drinkQ);
},'json');
$('#addMore').click(function()
{
    window.open('/searchIngredient.html');
});
