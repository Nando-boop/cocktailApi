/* ========================================================================================================================================================
BinarySearchTree class is an AVL self balancing tree.

variable usage:
favorites - a tree that stores the favorited drinks.
binaryIngredientTree - stores all drinks.
storageTree - stores user added ingredients.
shoppingList - array of ingredients; removal updates other variables with selected ingredient.

======================================================================================================================================================== */
var favorites = new BinarySearchTree;
var binaryIngredientTree = new BinarySearchTree;
var storageTree = new BinarySearchTree;
var tempTree = new BinarySearchTree;
var loggedInId = localStorage.getItem('loggedInId');
var shoppingList = [];

//used to calculate horizontal scroll bar
var offsetWidth;
var firstNum = '00';

if(localStorage.getItem('used'))
{
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
    
    $('#addMore, .fas.fa-plus').click(function()
    {
        window.open('/searchIngredient.html', '_top');
    });

    scrollBarAdder();
});
function scrollBarAdder() 
{
    if($('#ingredientCards')[0])
    {
        document.getElementById('ingredientCards').addEventListener('wheel', scrollHor, {passive: true});
        document.getElementById('ingredientCards').addEventListener('touchmove', scrollHor, {passive: true});
        // wait until ingredientCards is populated to run
        if($(window).width() > 760)
        {
            setTimeout(function(){

                // add track and thumb; not draggable to prevent scrolling errors
                $('#ingredientCards').append('<div id=\'horizontalScrollBar\' draggable=\'false\'></div>').append('<div id=\'horizontalThumb\' draggable=\'false\'></div>');
        
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
        }
    }
}
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
        'ingredientTree': binaryIngredientTree,
        'storageTree': storageTree
    };

    localStorage.setItem('storageTree', JSON.stringify(storageTree.root));
    localStorage.setItem('binaryIngredientTree', JSON.stringify(binaryIngredientTree.root));
    
    if(shoppingList)
    {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        obj.shoppingList = shoppingList;
    }

    $.ajax (
    {
        type: "PUT",
        url: '/api/userProfiles/' + loggedInId,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify(obj),
        dataType: 'json'
    });
    $('* #loader').remove();
}

var qLen = 0;
var picLen = 0;

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

async function visit(node, func)
{
    if(node.data)
    {
        var data = node.data;
    }
    else
    {
        data = node;
    }
    
    if(data.includes(" ", 0)){
        data = data.replace(/ /g, "%20");
    }
    var searchInput = data;
    url = "https://www.thecocktaildb.com/api/json/v1/1";
    url += "/filter.php?i=" + searchInput;

    let results = await fetch(url, {
        method: 'get',
    }).then(function(response) {
        return response.json();
    }).then(async function(data) {
        var arr1 = data.drinks;
        const promises = arr1.map(function(val) 
        {
            data = val.strDrink;

            let dataSearch = data;

            if(data.includes(" ", 0))
            {
                dataSearch = data.replace(/ /g, "%20");
            }
            url = "https://www.thecocktaildb.com/api/json/v1/1";
            url += "/search.php?s=" + dataSearch;
            
            return fetch(url).then(function(response) {
                return response.json();
            }).then(async function (data) {
                let ingredientsNum;
                let ingredientCall;
                setVar(1);
            
                while(ingredientCall != undefined)
                {
                    ingredientsNum++;
                    setVar(ingredientsNum);
                }
                ingredientsNum--;
                const result2 = await func(data.drinks[0].strDrink, ingredientsNum);
                return result2;
                function setVar(num)
                {
                    ingredientsNum = num;
                    let ingredient = 'strIngredient';
                    ingredient += ingredientsNum.toString();
                    ingredientCall = data.drinks[0][ingredient];
                }
                });
        }) 
        await Promise.all(promises);  
    });
    return results;
}

var pendingRecursion = 0;

async function inorderAsync(node, func, action) 
{ 
    if(node !== null) 
    {    
        pendingRecursion++;
    
        inorderAsync(node.left, func, action);
        await func(node, action);
        inorderAsync(node.right, func, action);
        
        if(--pendingRecursion == 0)
        {
            update();
        }
    }
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

// adds ingredient to ingredient tree if not there, then calls functions to update drink queue
async function drinkAdder(name, num)
{
    let searchedNode = binaryIngredientTree.search(binaryIngredientTree.getRootNode(), name)
    
    if(searchedNode === null)
    {
        binaryIngredientTree.insert(name, num);
    }
    else
    {
        searchedNode.remainingIngredients--;
    }
    return Promise.resolve();
};
async function drinkRemover(name, num)
{
    let searchedNode = binaryIngredientTree.search(binaryIngredientTree.getRootNode(), name)
    if(searchedNode)
    {
        searchedNode.remainingIngredients++;
        if(searchedNode.remainingIngredients == num)
        {
            binaryIngredientTree.remove(name);
        }
    }
    return Promise.resolve();
};

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
        }
        selector();
    });
}
//this function lets you select/deselect cards
function selector()
{
    $('.cards').click(function()
    {
        if(this.selected)
        {
            $(this).css({'filter': 'none'});
            this.selected = false;
            ingredientRemover($(this).text());
        }
        else
        {
            $(this).css({'filter': 'grayscale(100%) blur(3px)', '-webkit-transition' : '-webkit-filter 300ms linear'});
            ingredientAdder($(this).text());
            this.selected = true;
        }
        // toggle between search and save on mobile button
        if(tempTree.root)
        {
            $('.fas.fa-save').css('display', 'inherit');
            $('.fas.fa-search').css('display', 'none');
        }
        else
        {
            $('.fas.fa-search').css('display', 'inherit');
            $('.fas.fa-save').css('display', 'none');
        }
    });
}
function selectorDeleter()
{
    $('.cards').click(function()
    {
        if(this.selected)
        {
            $(this).css({'filter': 'none'});
            this.selected = false;
            ingredientAdderDelete($(this).text());
        }
        else
        {
            $(this).css({'filter': 'grayscale(100%) blur(3px)', '-webkit-transition' : '-webkit-filter 300ms linear'});
            ingredientRemoverDelete($(this).text());
            this.selected = true;
        }

        if(tempTree.root === null)
        {
            $('.fas.fa-plus').css({'display': 'inherit'});
            $('.fas.fa-trash-alt').css('display', 'none');
        }
        else
        {
            $('.fas.fa-trash-alt').css({'display': 'inherit'});
            $('.fas.fa-plus').css('display', 'none');
        }
    });
    deleterHelper();
}
function selectorColorHelper()
{
    let obj = {};

    obj.buttonColor = $('#mobileButton').css('background');
    obj.iconColor = $('#mobileButton i').css('background');

    return obj;
}
function deleterHelper()
{
    $('#delete, .fas.fa-trash-alt').click(function()
    {
        $(document.body).append('<div id=\'loader\'><p>Updating...</p></div>');
        inorderAsync(tempTree.root, visit, drinkRemover);

        $('#ingredientCards').empty();
        inorder(storageTree.root, printPantry);

        tempTree = new BinarySearchTree;
        selectorDeleter();
    });  
}

function ingredientAdder(name)
{
    let searchedNode = storageTree.search(storageTree.getRootNode(), name)
    if(searchedNode == null)
    {
        storageTree.insert(name);
        tempTree.insert(name);
    }
}
function ingredientRemover(name)
{
    storageTree.remove(name);
    tempTree.remove(name);
}
function ingredientAdderDelete(name)
{
    let searchedNode = storageTree.search(storageTree.getRootNode(), name)
    if(searchedNode == null)
    {
        storageTree.insert(name);
        tempTree.remove(name);
    }
}
function ingredientRemoverDelete(name)
{
    storageTree.remove(name);
    tempTree.insert(name);
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

    inorder(binaryIngredientTree.root, drinkSearch);

    localStorage.setItem('binaryIngredientTree', JSON.stringify(binaryIngredientTree.root));
    saveFav();
}
function saveFav()
{
    var favObj = {
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
    $('#ingredientCards ul ul').click(function()
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
}
function getter(card, name)
{
    $.getJSON('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name, function(data)
    {   
        $('#ingredientCards').append('<div id=\'blocker\'></div>');
        $('#ingredientCards').append('<div id=\'popup\'</div>');

        if($(window).width() < 760)
        {
            $('.fas.fa-plus').css({
                'color': 'var(--text-color2)',
                '-webkit-text-fill-color': 'var(--text-color2)',
                'transform': 'rotate(45deg)',
                'transition-duration': '1s'
            });
            $('#mobileButton').css({
                'background': 'var(--text-color)',
                'transition-duration': '1s'
            });
        }
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

            if($(window).width() < 760)
            {
                $('#mobileButton').css({
                    'background': 'var(--text-color2)',
                    'transition-duration': '1s'                
                })
                $('.fas.fa-plus').css({
                    'color': 'var(--text-color)',
                    '-webkit-text-fill-color': 'var(--text-color)',
                    'transform': 'rotate(0deg)',
                    'transition-duration': '1s'
                })
            }
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
            if(storageTree.search(storageTree.root, ingredientCall))
            {
                $('.grid').append('<span>' + ingredientCall + '</span>').append('<span>' + measureCall + '</span>');
            }
            else if(shoppingList.indexOf(ingredientCall) != -1)
            {
                $('.grid').append('<span class=\'listAdder\'><i class="fas fa-check-circle"></i>' + ingredientCall + '</span>').append('<span>' + measureCall + '</span>');
            }
            else
            {
                $('.grid').append('<span class=\'listAdder\'><i class="fas fa-plus-circle"></i>' + ingredientCall + '</span>').append('<span>' + measureCall + '</span>');
            }
            
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

        item = item.replace(/\<(.*?)\>/g, "").replace(/\(|\)/g, '');

        if(shoppingList.indexOf(item) == -1)
        {
            shoppingList.push(item);
            $(this).html('<i class="fas fa-check-circle"></i>' + item);
            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        }
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

    $('#popup').find('i').click(function()
    {   
        if(this.className == 'fas fa-star' || this.className == 'far fa-star')
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

    $('#ingredientCards').append('<ul class=\'cards\'><ul>');
    $('#ingredientCards ul:last').append('<li>' + name + '</li>')
        .append('<img src=https://www.thecocktaildb.com/images/ingredients/' + searchName + '-Medium.png>');
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
    else if(e.deltaY >= 0)
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
        
        let difference = e.pageX - pressX;
        let multiplier = Math.abs($(window).width()/e.clientX);
        document.getElementById('ingredientCards').scrollLeft += difference * multiplier;

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
        if (difference < 0) 
        {
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
    let scrollWidth = $('#ingredientCards')[0].scrollWidth;     // total with of element with overflow
    let clientWidth = $('#ingredientCards')[0].clientWidth;     // width of viewport
    offsetWidth = scrollWidth - clientWidth;                    // width of element that is offscreen
    
    // thumb on small screen fills track from left to right; large screen thumb moves
    if(ammountScrolled >= 0)
    {
        if($(window).width() > 760)
        {
            $('#horizontalThumb').css({
                'margin-left': 15/(offsetWidth/ammountScrolled) + 40 + '%'
            });
        }
        else 
        {
            let btnColor = ((ammountScrolled/offsetWidth) * 100-40) *5;
            let iColor = ((ammountScrolled/offsetWidth) * 100-46) *12.5;

            if(btnColor < 0 || !btnColor)
            {
                btnColor = 0;
            }
            if(iColor < 0 || !iColor)
            {
                iColor = 0;
            }
            $('#horizontalThumb').css({
                'width': (ammountScrolled/offsetWidth) * 100 + '%'
            });
            $('#mobileButton').css({
                'background': 'linear-gradient(90deg, var(--text-color)' + (btnColor) + '%, var(--text-color2)' + (btnColor) + '%)'
            })
            $('#mobileButton i').css({
                'background': 'linear-gradient(90deg, var(--text-color2)' + (iColor) + '%, var(--text-color)' + (iColor) + '%)',
                '-webkit-background-clip': 'text',
	            '-webkit-text-fill-color': 'transparent'
            })
        }
        // allow slide to update after touch release
        setTimeout(function()
        {
            if(ammountScrolled != $('#ingredientCards')[0].scrollLeft)
            {
                ammountScrolled = $('#ingredientCards')[0].scrollLeft;
                setThumb(ammountScrolled);
            }
        },100);

    }
}

function readyToSave()
{
    $('#save, .fas.fa-save').click(function()
    {
        $('#ingredientBox').val('');

        $(document.body).append('<div id=\'loader\'><p>Updating...</p></div>');
        inorderAsync(tempTree.root, visit, drinkAdder);

        printCards(listUrl);

        $('.fas.fa-search').css('display', 'inherit');
        $('.fas.fa-save').css('display', 'none');
        scrollBarAdder();

        tempTree = new BinarySearchTree;
    });
}