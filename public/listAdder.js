$(document).ready(function()
{
    printList();
});
function printList()
{
    if(shoppingList){
        let length = shoppingList.length;
        for(i = 0; i < length; i++)
        {
            $('#shoppingList').append('<li>' + shoppingList[i] + '</li>');
        }
        listItemSelector();
    }
}
function listItemSelector()
{
    let numSelected = 0;
    
    $('#shoppingList').find('li').click(function()
    {
        let val = $(this).html();

        if(this.selected == true)
        {
            tempTree.remove(val);
            storageTree.remove(val);

            $(this).css('background-color', 'var(--text-color2)');
            this.selected = false;

            numSelected--;

            if(numSelected == 0)
            {
                $('#mobileButton').css('background', 'var(--text-color2)');
                $('#mobileButton').html('<i class="fas fa-plus"></i>');

                hideMobileBtn()
            }

            shoppingList.push(val);
        }
        else
        {
            tempTree.insert(val);
            storageTree.insert(val);

            $(this).css('background-color', 'var(--head-color)');

            $('#mobileButton').css('background', 'var(--text-color)');
            $('#mobileButton').html('<i class="fas fa-shopping-cart"></i>');

            showMobileBtn();

            this.selected = true;
            numSelected++;

            let index = shoppingList.indexOf(val);
            shoppingList.splice(index, 1);
        }
        $('.fas.fa-shopping-cart').click(function()
        {
            $('#shoppingList').empty();
            hideMobileBtn();
            let length = shoppingList.length;
            for(i = 0; i < length; i++)
            {
                $('#shoppingList').append('<li>' + shoppingList[i] + '</li>');
            }
            $(document.body).append('<div id=\'loader\'><p>Updating...</p></div>');
            listItemSelector();
            inorderAsync(tempTree.root, visit, drinkAdder);
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
function hideMobileBtn()
{
    if(window.innerWidth > 688)
    {
        $('#mobileButton').css({'display': 'none'});
    }
}