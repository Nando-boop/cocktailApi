loggedInId = '';

$(document).ready(function()
{
    $('#logIn').click(function()
    {
        loginRemover('logIn', 'Sign In');
        $('#logIn').click(function()
        {
            let obj = setValues();
            serverCall("ingredientUser.html", obj);
        });
    });
    $('#signUp').click(function()
    {
        debugger;
        loginRemover('signUp', 'Sign Up');
        $('#signUp').click(function()
        {   
            localStorage.clear();
            let obj = setValues();
            $.ajax (
                {
                    type: 'POST',
                    url: '/api/userProfiles',
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    success: function(data)
                    {
                        localStorage.setItem('loggedInId', data._id);
                        window.open(page,"_top")
                    }
                });
        });
    });
});
function setValues()
{
    var obj = {};

    var username = $('#username').val();
    var password = $('#password').val();

    obj['username'] = username;
    obj['password'] = password;

    return obj;
}
function serverCall(page, userData)
{
    $.getJSON('/api/userProfiles/login', userData, function(data)
    {
        localStorage.setItem('loggedInId', data._id);
        if(data.favorites)
        {
            localStorage.setItem('favorites', JSON.stringify(data.favorites));
        }
        if(data.shoppingList)
        {
            localStorage.setItem('shoppingList', JSON.stringify(data.shoppingList));
        }
        localStorage.setItem('storageTree', JSON.stringify(data.storageTree));

        localStorage.setItem('binaryIngredientTree', JSON.stringify(data.ingredientTree));
    },'json').done(window.open(page,"_top"));
}
function loginRemover(action, btn)
{
    $('#signUp').replaceWith("<h2><input id='username' placeholder='Email'></h2>");
    $('#logIn').replaceWith("<h2><input id='password' placeholder='Password'></h2>");
    $('#password').parent().after("<h2 id=" + action + ">" + btn + "</h2>");
}