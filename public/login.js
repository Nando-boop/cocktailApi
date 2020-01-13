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
        loginRemover('signUp', 'Sign Up');
        $('#signUp').click(function()
        {   
            let obj = setValues();
            $.ajax (
                {
                    type: 'POST',
                    url: '/api/userProfiles',
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    success: function(obj)
                    {
                        serverCall("searchIngredient.html", obj);
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
        loggedInId = data;
        window.open(page);
    },'json');
}
function loginRemover(action, btn)
{
    $('#signUp').replaceWith("<h2><input id='username' placeholder='Email'></h2>");
    $('#logIn').replaceWith("<h2><input id='password' placeholder='Password'></h2>");
    $('#password').parent().after("<h2 id=" + action + ">" + btn + "</h2>");
}