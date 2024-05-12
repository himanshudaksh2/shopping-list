const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filterItem = document.querySelector('#filter');
const items = itemList.querySelectorAll('li');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;
    if( newItem === ''){
        alert('Please add an item');
        return;
    }

    //check edit-mode;
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkIfItemExist(newItem)){        
        return alert('Item Already Exsist');
        }
    }

    //create item DOM element
    addItemToDOM(newItem)

    //Add item to local storage
    addItemToStorage(newItem)

    clearUi()

    itemInput.value = '';
}

function addItemToDOM(item){
    const newli = document.createElement('li');
    const textLi = document.createTextNode(item);
    newli.appendChild(textLi);

    const newButton = document.createElement('button');
    newButton.className = 'remove-item btn-link text-red';

    const newI = document.createElement('i');
    newI.className = 'fa-solid fa-xmark';

    newButton.appendChild(newI);
    newli.appendChild(newButton);
    
    itemList.appendChild(newli);
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage()

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function displayContent(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    clearUi()
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeitem(e.target.parentElement.parentElement);
    } else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExist(item){
    let itemsFromStorage = getItemsFromStorage();
    
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item){
    isEditMode = true;

    const items = itemList.querySelectorAll('li');
    // let items = itemList.querySelector('li');

    items.forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

function removeitem(item){
    if(confirm('Are You Sure?')){
        //remove item from DOM
        item.remove();
        //remove item from Storage
        removeItemFromStorage(item.textContent)
    }
    clearUi()
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //filter out item to be remove
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // re-set the localstorage;
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    };

    //clear from localStorage;
    localStorage.removeItem('items');
    clearUi()
}


function clearUi(){
    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        filterItem.style.display = 'none';
        clearBtn.style.display = 'none';
        return;
    } else{
        filterItem.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    formBtn.style.backgroundColor = '#333';
    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';

    isEditMode = false;
}
clearUi();

function itemsFilter(){
    const items = itemList.querySelectorAll('li');
    const text = filterItem.value.toLowerCase();
    
    items.forEach((item)=>{
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) !== -1){
            item.style.display = 'flex'
        } else{
            item.style.display = 'none';
        }
    })
}

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
filterItem.addEventListener('input', itemsFilter);
document.addEventListener('DOMContentLoaded', displayContent);
