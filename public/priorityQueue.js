$(document).ready(function()
{
    var drinkQueue = [];
    var storageTree = new BinarySearchTree;
    
    var ingredientUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
    $('#save').click(function()
    {
        drinkAdder();
    });

    function listMaker(bucket, val)
    {
        if(!drinkQueue[bucket])
        {
            drinkQueue[bucket] = new BinarySearchTree;
        }
        drinkQueue[bucket].insert(val);

        if(bucket > 0)
        {
            drinkQueue[bucket--].remove(val);
        }
    }

    function drinkAdder(name)
    {
        ingredientUrl += name;
        $.getJSON(ingredientUrl, function(result)
        {
            var drinkList = result.drinks;
            var length = drinkList.length;

            for(i=0; i<length; i++)
            {
                var searchedNode = storageTree.search(storageTree.getRootNode(), drinkList[i].strDrink)
                if(searchedNode == null)
                {
                    storageTree.insert(drinkList[i]);
                    listMaker(0, drinkList[i]);
                }
                else
                {
                    listMaker(searchedNode.value, drinkList[i]);
                }
            }
        });
    }
});


