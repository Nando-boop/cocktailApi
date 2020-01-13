var drinkQueue = [];
var binaryIngredientTree = new BinarySearchTree;
var storageTree = new BinarySearchTree;
var loggedInId = window.opener.loggedInId;
var url = "https://www.thecocktaildb.com/api/json/v1/1";

$(document).ready(function()
{   
    $('#ingredientSearch').click(function()
    {           
        $.get('/api/userProfiles/' + loggedInId, function(data)
        {
            let tree = data.storageTree;
            inorder(tree.root, visit);
        });
        $('#ingredientSearch').click(function()
        {
            update();
        });
    });
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

});
// When the user clicks on the button, scroll to the top of the document
function topFunction() 
{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//end w3 schools

function update()
{
    var obj = {
        'drinkQueue': drinkQueue,
        'ingredientTree': binaryIngredientTree
    };

    $.ajax (
        {
            type: "PUT",
            url: '/api/userProfiles/' + loggedInId,
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(obj),
            dataType: 'json'
        }).done(window.open('/ingredientUser.html'));
}

function queuePrinter(queue)
{
    for(key in queue)
    {
        while(queue[key] && queue[key].root != null)
        {
            $('#ingredientCards').append('<ul class=\'cards' + key + '\'></ul>');
            inorder(queue[key].root, cardPrint);
            break;
        }
    }
}

function cardPrint(node)
{
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
        $('.cards' + node.remainingIngredients)
            .append('<ul><i class=\"far fa-star\"></i><img src=\'' + data.drinks[0].strDrinkThumb + '\'><li>' + drinkName + '</li>'
            + '<p> Only ' + node.remainingIngredients + " more ingredients!</p></ul/");
    }, 'json');   
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
    $.getJSON(url, function(data)
    {
        var IngredientsLength = data.drinks.length;
        
        for(i=0; i<IngredientsLength; i++){
            /*stored in new variable so the name can be adapted for 
            the search without changing the display name */
            var drinkName = data.drinks[i].strIngredient1;
            var searchName = drinkName;

            //replaces spaces in drink names to help find photo url
            if(drinkName.includes(" ", 0)){
                searchName = drinkName.replace(/ /g, "%20");
            }
            
            $('#ingredientCards').append('<ul class=\'cards\'><ul>');
            $('#ingredientCards ul:last').append('<li>' + drinkName + '</li>')
                .append('<img src=https://www.thecocktaildb.com/images/ingredients/' + searchName + '-Medium.png>');
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