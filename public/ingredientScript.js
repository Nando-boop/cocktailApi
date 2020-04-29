//Creates a list of drinks from the api with photo and title
var loggedInId = window.opener.loggedInId;

function cardSelector()
{
    $('#loader').remove();  //removes loading screen when function called

    $('#ingredientCards').hover(function()
    {   
        $(this).children('ul').children('ul').click(function()
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

        $('#ingredientCards').unbind('mouseenter mouseleave'); //prevents cursor leaving ingredientsCards to re-call hover function
    });
}
function getter(card, name)
{
    $.getJSON('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name, function(data)
    {   
        $('#ingredientCards').append('<div id=\'blocker\'></div>');
        $('#ingredientCards').append('<div id=\'popup\'</div>');

        $(card).clone().appendTo('#popup');

        $('#blocker').click(function()
        {
            if($('#popup').find('i')[0].favorited)
            {
                $(card).find('i').removeClass('far fa-star').addClass('fas fa-star');
            }
            else 
            {
                $(card).find('i').removeClass('fas fa-star').addClass('far fa-star');
            }
            faveSave();
            $('#blocker').remove();
            $('#popup').remove();
        });

        $('#popup').append('<div class=\"grid\"></div>')
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
            if(!storageTree.search(storageTree.root, ingredientCall))
            {
                $('.grid').append('<span class=\'listAdder\'>' + ingredientCall + ' (add to shopping list)</span>').append('<span>' + measureCall + '</span>');
            }
            else
            {
                $('.grid').append('<span>' + ingredientCall + '</span>').append('<span>' + measureCall + '</span>');
            }
            $('.grid').find('span').css('font-size','1.5vw');
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
        favoriter();
        addsToList();
    });
}
function addsToList()
{
    $('.listAdder').click(function()
    {
        let item = $(this).html();
        item = item.replace(/add to shopping list/,'').replace(/\(|\)/g, '');
        shoppingList.push(item);
    });
}
function favoriter()
{
    if($('#popup').find('i').attr('class') == 'fas fa-star')
    {
        $('#popup').find('i')[0].favorited = true;
    }
    else
    {
        $('#popup').find('i')[0].favorited = false;
    }

    $('i').click(function()
    {   
        if(this.favorited == true)
        {
            $(this).removeClass('fas fa-star').addClass('far fa-star').css({'color': 'grey'});
            this.favorited = false;
        }
        else
        {
            $(this).removeClass('far fa-star').addClass('fas fa-star').css({'color': 'yellow'});
            this.favorited = true;
        }
    });
}
