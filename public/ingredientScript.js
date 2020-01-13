//Creates a list of drinks from the api with photo and title
var loggedInId = window.opener.loggedInId;

$(document).ready(function()
{
    cardSelector();
});
function cardSelector()
{
    $('#ingredientCards').hover(function()
    {   
        $(this).find('ul').find('ul').click(function()
        {
            var listCard = $(this);
            var cocktail = ($(this).find('li').html());
            var searchName = cocktail;
            if(cocktail.includes(" ", 0))
            {
                searchName = cocktail.replace(/ /g, "%20");
            }
            getter(listCard, searchName);
        });
    });
}
function getter(card, name)
{
    $.getJSON('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name, function(data)
    {   
        $('#ingredientCards').unbind('mouseenter mouseleave');
       
        card.css(
        {
            'height': '32vw',
            'transition': '1s',
            'transform': 'scale(1.5)',
            'z-index': '5'
        }).append('<div class=\"grid\"></div>')
            .append('<p class=\"instructions\">' + data.drinks[0].strInstructions + '</p>')
            .css('overflow', 'auto');
        
        let ingredientsNum;
        let ingredientCall;
        let measureCall;
        setVar(1);

        while(ingredientCall != undefined)
        {
            if(measureCall == null)
            {
                measureCall = 'To taste';
            }
            $('.grid').append('<span>' + ingredientCall + '</span>').append('<span>' + measureCall + '</span>');
            ingredientsNum++;
            setVar(ingredientsNum);
        }

        function setVar(num)
        {
            ingredientsNum = num;
            let ingredient = 'strIngredient';
            let measure = 'strMeasure';
            measure += ingredientsNum.toString();
            ingredient += ingredientsNum.toString();
            ingredientCall = data.drinks[0][ingredient];
            measureCall = data.drinks[0][measure];
        }
    });
    favoriter();

    $('body').click(function()
    {
        card.find('.instructions').remove();
        card.find('.grid').remove();
    });
    $(document).on("click", function(event){
        if($(event.target).closest(card).length != 1)
        {
            card.removeAttr('style');
        }
    });
}
function favoriter()
{
    $('i').click(function()
    {
        $(this).removeClass('far fa-star').addClass('fas fa-star').css({'color': 'yellow'});
    });
}