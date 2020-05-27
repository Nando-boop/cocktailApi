$(document).ready(function()
{
    printList();
});
function printList()
{
    $.getJSON('/api/userProfiles/' + loggedInId, function(data)
    {
        if(data.shoppingList){
            shoppingList = data.shoppingList;
            let length = shoppingList.length;
            for(i = 0; i < length; i++)
            {
                $('#shoppingList').append('<li>' + shoppingList[i] + '</li>');
            }
            listItemSelector();
        }
    });
}
function listItemSelector()
{
    let numSelected = 0;
    let tempCart = [];
    $('#shoppingList').find('li').click(function()
    {
        if(this.selected == true)
        {
            $(this).css('background-color', 'var(--text-color)');
            this.selected = false;

            numSelected--;
            if(numSelected == 0)
            {
                $('#mobileButton').css('background', 'var(--text-color2)');
                $('#mobileButton').html('<i class="fas fa-plus"></i>');

                if(window.innerWidth > 688)
                {
                    $('#mobileButton').css('display', 'none');
                }
            }

            shoppingList.push($(this).html());
            let index = tempCart.indexOf($(this).html());
            tempCart.splice(index, 1);
        }
        else
        {
            $(this).css('background-color', 'var(--text-color2)');

            $('#mobileButton').css('background', 'var(--text-color)');
            $('#mobileButton').html('<i class="fas fa-shopping-cart"></i>');

            showMobileBtn();

            this.selected = true;
            numSelected++;

            let index = shoppingList.indexOf($(this).html());
            shoppingList.splice(index, 1);

            tempCart.push($(this).html());
        }
        $('.fas.fa-shopping-cart').click(function()
        {
            for(i = 0; i < numSelected; i++)
            {
                storageTree.insert(tempCart[i]);
            }

            drinkQueue = [];
            binaryIngredientTree = new BinarySearchTree;

            inorder(storageTree.root, visit);
            setTimeout(function(){update();}, 1000);

            $('#shoppingList').empty();
            let length = shoppingList.length;
            for(i = 0; i < length; i++)
            {
                $('#shoppingList').append('<li>' + shoppingList[i] + '</li>');
            }
            listItemSelector();
        });
    });
}
function showMobileBtn()
{
    if(window.innerWidth > 688)
    {
        $('#mobileButton').css({'display': 'inherit'});
    }
}
