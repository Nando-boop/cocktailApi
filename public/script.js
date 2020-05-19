var drinkQueue = [];
var favorites = new BinarySearchTree;
var binaryIngredientTree = new BinarySearchTree;
var storageTree = new BinarySearchTree;
var loggedInId = localStorage.getItem('loggedInId');
var shoppingList = [];

//used to calculate horizontal scroll bar
var offsetWidth;
var firstNum = '00';

if(localStorage.getItem('used'))
{
    drinkQueue = JSON.parse(localStorage.getItem('drinkQueue'));
    storageTree.root = JSON.parse(localStorage.getItem('storageTree'));
    binaryIngredientTree.root = JSON.parse(localStorage.getItem('binaryIngredientTree'));
}
if(localStorage.getItem('shoppingList'))
{
    shoppingList = JSON.parse(localStorage.getItem('shoppingList'));
}
if(localStorage.getItem('favorites'))
{
    favorites.root = JSON.parse(localStorage.getItem('favorites'));
}

var url = "https://www.thecocktaildb.com/api/json/v1/1";

$(document).ready(function()
{   
    //taken from w3 schools
    mybutton = document.getElementById("myBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
    }

    document.getElementById('ingredientCards').addEventListener('wheel', scrollHor);

    // wait until ingredientCards is populated to run
    setTimeout(function(){

        // add track and thumb; not draggable to prevent scrolling errors
        $('#ingredientCards').append('<div id=\'horizontalScrollBar\' draggable=\'false\'></div>').append('<div id=\'horizontalThumb\' draggable=\'false\'></div>');

        let scrollWidth = $('#ingredientCards')[0].scrollWidth;     // total with of element with overflow
        let clientWidth = $('#ingredientCards')[0].clientWidth;     // width of viewport
        offsetWidth = scrollWidth - clientWidth;                    // width of element that is offscreen

        // find the highest number of ingredients to add by scroll bar
        let secondNum = $('#ingredientCards').children('[class]').last()[0].className;
        let matches = secondNum.match(/(\d+)/);         // extract digit from class name
        if(matches){
            matches = '0' + matches[0];                 // coerce number to string with leading 0
            $('#horizontalScrollBar').append('<p>' + firstNum + '</p>'); // adds lowest number
            $('#horizontalScrollBar').append('<p>' + matches + '</p>');  // adds highest number  
        }        
                             
        dragger();      
    }, 500);
    
});

function putter(node)
{
    storageTree.insert(node.data);
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() 
{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//end w3 schools

function update()
{
    localStorage.setItem('used', true);
    var obj = {
        'drinkQueue': drinkQueue,
        'ingredientTree': binaryIngredientTree,
        'storageTree': storageTree
    };

    localStorage.setItem('drinkQueue', JSON.stringify(drinkQueue));
    localStorage.setItem('storageTree', JSON.stringify(storageTree.root));
    localStorage.setItem('binaryIngredientTree', JSON.stringify(binaryIngredientTree.root));

    $.ajax (
    {
        type: "PUT",
        url: '/api/userProfiles/' + loggedInId,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify(obj),
        dataType: 'json'
    });//.done(window.open('/ingredientUser.html', '_top').done());
}

var qLen = 0;
var picLen = 0;

function queuePrinter(queue)
{
    for(key in queue)
    {
        while(queue[key] && queue[key].root != null)
        {
            $('#ingredientCards').append('<ul class=\'cards' + key + '\'></ul>');
            //$('.cards' + key).append('<p>Only ' + key + ' more ingredients!</p>');

            inorder(queue[key].root, cardPrint);
            break;
        }
    }
}
function cardPrint(node)
{
    qLen++;
    var printUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    let data = node.data;

    /*stored in new variable so the name can be adapted for 
    the search without changing the display name */
    var drinkName = data;
    var searchName = drinkName;

    //replaces spaces in drink names to help find photo url
    if(drinkName.includes(" ", 0))
    {
        searchName = drinkName.replace(/ /g, "%20");
    }

    printUrl += searchName;

    $.getJSON(printUrl, function(data) 
    {
        picLen++;
        if(node.favorite == true)
        {
            $('.cards' + node.remainingIngredients)
                .append('<ul><i class=\"fas fa-star\"></i><img src=\''+ data.drinks[0].strDrinkThumb + '\'><li>' + drinkName + '</li></ul>');
            $('.fas fa-star').css({'color': 'yellow'});
        }
        else
        {
            $('.cards' + node.remainingIngredients)
                .append('<ul><i class=\"far fa-star\"></i><img src=\''+ data.drinks[0].strDrinkThumb + '\'><li>' + drinkName + '</li></ul>');
            $('.far fa-star').css({'color': 'grey'});
        }
        if(picLen == qLen)
        {
            cardSelector();
        }
    });
}
//retrieves and lists possible drinks from searched item
function getData()
{
    $.getJSON(url, function(result)
    {
        let length = result.drinks.length;
        for(i=0; i<length; i++)
        {
            getIngredients(result.drinks[i].strDrink);
        }
    });
}

function drinkDecrement(drink)
{
    let searchedNode = binaryIngredientTree.search(binaryIngredientTree.root, drink);
    
    if(searchedNode != null)
    {
        queueRemoval(searchedNode.remainingIngredients, drink);
        listMaker(searchedNode.remainingIngredients, drink);
        searchedNode.remainingIngredients--;
    }
}

function getIngredients(data)
{
    let dataSearch = data;

    if(data.includes(" ", 0)){
        dataSearch = data.replace(/ /g, "%20");
    }
    
    url += "/search.php?s=" + dataSearch;
    
    $.getJSON(url, function(result)
    {
        let ingredientsNum;
        let ingredientCall;
        setVar(1);

        while(ingredientCall != undefined)
        {
            ingredientsNum++;
            setVar(ingredientsNum);
        }

        drinkAdder(result.drinks[0].strDrink, ingredientsNum);

        function setVar(num)
        {
            ingredientsNum = num;
            let ingredient = 'strIngredient';
            ingredient += ingredientsNum.toString();
            ingredientCall = result.drinks[0][ingredient];
        }
    });
    url = "https://www.thecocktaildb.com/api/json/v1/1";
}

function visit(node)
{
    let data = node.data
    if(data.includes(" ", 0)){
        data = data.replace(/ /g, "%20");
    }
    var searchInput = data;

    url += "/filter.php?i=" + searchInput;
    getData();
    url = "https://www.thecocktaildb.com/api/json/v1/1";
}

function inorder(node, func) 
{ 
    if(node !== null) 
    { 
        inorder(node.left, func); 
        func(node); 
        inorder(node.right, func); 
    }
}

function drinkAdder(name, num)
{
    let searchedNode = binaryIngredientTree.search(binaryIngredientTree.getRootNode(), name)

    if(searchedNode == null)
    {
        binaryIngredientTree.insert(name, num-1);
        listMaker(num, name);
        drinkDecrement(name);
    }
    else
    {
        listMaker(num, name);
        drinkDecrement(name);
    }
};

function listMaker(bucket, val)
{
    bucket--;
    if(!drinkQueue[bucket])
    {
        drinkQueue[bucket] = new BinarySearchTree;
    }

    drinkQueue[bucket].insert(val, bucket);
}

function drinkRemover(name)
{
    let searchedNode = binaryIngredientTree.search(binaryIngredientTree.getRootNode(), name)

    queueRemoval(searchedNode.value, name);

    binaryIngredientTree.remove(name);   
}

function queueRemoval(bucket, val)
{
    drinkQueue[bucket].remove(val);
}
function printCards(url)
{
    $('#ingredientCards').empty();
    $.getJSON(url, function(data)
    {
        var IngredientsLength = data.drinks.length;
        
        for(i=0; i<IngredientsLength; i++){
            /*stored in new variable so the name can be adapted for 
            the search without changing the display name */
            var drinkName = data.drinks[i].strIngredient1;
            var searchName = drinkName;

            if(drinkName.includes(" ", 0)){
                searchName = drinkName.replace(/ /g, "%20");
            }

            if(!storageTree.root || !storageTree.search(storageTree.root, drinkName))
            {
                $('#ingredientCards').append('<ul class=\'cards\'><ul>');
                $('#ingredientCards ul:last').append('<li>' + drinkName + '</li>')
                    .append('<img src=https://www.thecocktaildb.com/images/ingredients/' + searchName + '-Medium.png>');
            }
            //replaces spaces in drink names to help find photo url
        }
        selector();
    });
}
//this function lets you select/deselect cards
function selector()
{
    $('.cards').mousedown(function()
    {
        $(this).css('background', 'black');
    });
    $('.cards').click(function()
    {
        if(this.selected)
        {
            $(this).css({'background': 'none', 'box-shadow': 'none'});
            this.selected = false;
            ingredientRemover($(this).text());
        }
        else
        {
            $(this).css({'background': 'grey', 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' });
            ingredientAdder($(this).text());
            this.selected = true;
        }
    });
}
function selectorDeleter()
{
    $('.cards').mousedown(function()
    {
        $(this).css('background', 'black');
    });
    $('.cards').click(function()
    {
        if(this.selected)
        {
            $(this).css({'background': 'none', 'box-shadow': 'none'});
            this.selected = false;
            ingredientAdder($(this).text());
        }
        else
        {
            $(this).css({'background': 'grey', 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' });
            ingredientRemover($(this).text());
            this.selected = true;
        }
        localStorage.setItem('storageTree', JSON.stringify(storageTree.root));
    });
}
function ingredientAdder(name)
{
    let searchedNode = storageTree.search(storageTree.getRootNode(), name)
    if(searchedNode == null)
    {
        storageTree.insert(name);
    }
}
function ingredientRemover(name)
{
    storageTree.remove(name);
}
function faveSave()
{
    var fav = $('#popup').find('i')[0].favorited;
    var drink = $('#popup').find('ul').text();

    if(fav)
    {
        favorites.insert(drink);
        localStorage.setItem('favorites', JSON.stringify(favorites.root));
    }
    else if(favorites.search(favorites.root, drink))
    {
        favorites.remove(drink);
        localStorage.setItem('favorites', JSON.stringify(favorites.root));
    }
    function drinkSearch(node)
    {
        if(drink == node.data)
        {
            node.favorite = fav;
        }
    }
    for(key in drinkQueue)
    {
        while(drinkQueue[key] && drinkQueue[key].root != null)
        {
            inorder(drinkQueue[key].root, drinkSearch);
            break;
        }
    }

    localStorage.setItem('drinkQueue', JSON.stringify(drinkQueue));
    saveFav();
}
function saveFav()
{
    var favObj = {
        'drinkQueue': drinkQueue,
        'favorites' : favorites,
        'shoppingList': shoppingList
    }
    
    $.ajax (
    {
        type: "PUT",
        url: '/api/userProfiles/' + loggedInId,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify(favObj),
        dataType: 'json'
    });
}

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

        document.getElementById('ingredientCards').removeEventListener('wheel', scrollHor);
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
            document.getElementById('ingredientCards').addEventListener('wheel', scrollHor);
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
            if(storageTree.search(storageTree.root, ingredientCall) || shoppingList.indexOf(ingredientCall) != -1)
            {
                $('.grid').append('<span>' + ingredientCall + '</span>').append('<span>' + measureCall + '</span>');
            }
            else
            {
                $('.grid').append('<span class=\'listAdder\'>' + ingredientCall + '(add to shopping list)</span>').append('<span>' + measureCall + '</span>');
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
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
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

function printPantry(node)
{
    let name = node.data;
    let searchName = name;

    if(name.includes(" ", 0)){
        searchName = name.replace(/ /g, "%20");
    }

    selectorDeleter();
    $('#ingredientCards').append('<ul class=\'cards\'><ul>');
    $('#ingredientCards ul:last').append('<li>' + name + '</li>')
        .append('<img src=https://www.thecocktaildb.com/images/ingredients/' + searchName + '-Medium.png>');
    selectorDeleter();
}

// allows horizontal scrolling with mouse wheel
function scrollHor(e)
{
    let scrolled = $('#ingredientCards')[0].scrollLeft; // value that has been scrolled past
    let cards = $('#ingredientCards').children('[class]'); // stores all children with a class attribute
    let len = cards.length -1;  // -1 to start at index 0

    // styles scrollbar thumb
    setThumb(scrolled);

    // finds and prints the number of missing ingredients with the scrollbar
    function setName()
    {
        let className = $(cards[i])[0].className;   // finds class name to extract missing number
        let matches = className.match(/(\d+)/);     // extracts digit from class name
        
        if(matches && matches[0] != firstNum)
        {
            matches[0];
            firstNum = '0' + matches[0];            // coerce number to string with leading 0
        }
        $('#horizontalScrollBar :first-child').html(firstNum);
    }
    // if scrolling up, scroll left
    if (e.deltaY < 0) 
    {
        document.getElementById('ingredientCards').scrollLeft -= 100;

        // start at bottom of list of classes; check if class is in viewport 
        for(i = 0; i <= len; i++)
        {
            if(cards[i].offsetLeft > document.getElementById('ingredientCards').scrollLeft)
            {
                if(i != 0){i--;}
                setName();
                break;
            }
        }
    }
    // else scroll right
    else 
    {
        document.getElementById('ingredientCards').scrollLeft += 100;

        // start at top of list of classes; check if class is in viewport 
        for(i = len; i >= 0; i--)
        {
            if(cards[i].offsetLeft < document.getElementById('ingredientCards').scrollLeft)
            {
                setName();
                break;
            }
        }
    }
}

// allow dragging of scrollbar
function dragger() 
{
    var pressed, pressX;
    
    $(document)
    .on('mousedown', '#horizontalThumb', function(e) {
        pressX = e.pageX;       // store the click location
        pressed = true;
    })
    .on('mousemove', function(e) {
        if (!pressed) return;

        let multiplier = $(window).width()/e.clientX;
        let difference = e.pageX - pressX;

        document.getElementById('ingredientCards').scrollLeft += (e.pageX - pressX) * multiplier;

        let scrolled = $('#ingredientCards')[0].scrollLeft; // value that has been scrolled past
        let cards = $('#ingredientCards').children('[class]'); // stores all children with a class attribute
        let len = cards.length -1;  // -1 to start at index 0
    
        // styles scrollbar thumb
        setThumb(scrolled);
    
        // finds and prints the number of missing ingredients with the scrollbar
        function setName()
        {
            let className = $(cards[i])[0].className;   // finds class name to extract missing number
            let matches = className.match(/(\d+)/);     // extracts digit from class name
    
            if(matches[0] != firstNum)
            {
                matches[0];
                firstNum = '0' + matches[0];            // coerce number to string with leading 0
            }
            $('#horizontalScrollBar :first-child').html(firstNum);
        }
        // if scrolling up, scroll left
        if (difference < 0) 
        {
            // start at bottom of list of classes; check if class is in viewport 
            for(i = 0; i <= len; i++)
            {
                if(cards[i].offsetLeft > document.getElementById('ingredientCards').scrollLeft)
                {
                    i--;
                    setName();
                    break;
                }
            }
        }
        // else scroll right
        else 
        {
            // start at top of list of classes; check if class is in viewport 
            for(i = len; i >= 0; i--)
            {
                if(cards[i].offsetLeft < document.getElementById('ingredientCards').scrollLeft)
                {
                    setName();
                    break;
                }
            }
        }
    })
    .on('mouseup', function() {
        pressed = false;
    });
};
// sets location of thumb in scroll bar
function setThumb(ammountScrolled)
{
    $('#horizontalThumb').css({
        'margin-left': 15/(offsetWidth/ammountScrolled) + 40 + '%'
    })
}