let products = [
    {srcImg:'Images/Album%201.png',title:'Album 1',price:'1'},
    {srcImg:'Images/Album%202.png',title:'Album 2',price:'2'},
    {srcImg:'Images/Album%203.png',title:'Album 3',price:'3'},
    {srcImg:'Images/Chair.jpg',title:'Chair',price:'4'},
    {srcImg:'Images/Dairy.jpg',title:'Dairy',price:'5'},
    {srcImg:'Images/Handbag.webp',title:'Handbag',price:'6'},
    {srcImg:'Images/laptop.jpg',title:'Laptop',price:'7'},
    {srcImg:'Images/mouse.jpg',title:'Mouse',price:'8'},
    {srcImg:'Images/Pillow.jpg',title:'Pillow',price:'9'},
    {srcImg:'Images/Sandal.jpg',title:'Sandal',price:'10'},
    {srcImg:'Images/Shoe.jpg',title:'Shoe',price:'11'},
]
let sectionPagination = document.querySelector('.section-pagination')
let sectionProduct = document.querySelector('.section-product')
let cartTotalPrice = document.querySelector('.cart-total-price')
let cartItems = document.querySelector('.cart-items')
let modal = document.querySelector('.modal')
let productNumber,paginationBtnNumber,endTarget,startTarget,currentPaginationBtnActive,index
let newBtn,targetBtnId,btns,newDiv,inputNumber,targetSrc,flag,savedCartArray,savedTotalPrice
let pageNumber,selectedItemPrice,selectedItemTitle,selectedItemSrc
let cartItemsFragment = document.createDocumentFragment()
let sectionProductsFragment = document.createDocumentFragment()
let paginationBtnsFragment = document.createDocumentFragment()
let totalPrice = 0
let selectedProducts = []
let cartArray = []
let newLine = {}
function setCartArrayInLocal(array){
    localStorage.setItem('localCartArray',JSON.stringify(array))
}
function changeInputHandler(event){
    inputNumber = event.target.value
    inputNumber = Number(inputNumber)
    targetSrc = event.target.parentElement.parentElement.firstElementChild.firstElementChild.getAttribute('src')
    index = cartArray.findIndex(function (line){
        return line['srcImg'] == targetSrc
    })
    cartArray[index]['number'] = inputNumber
    setCartArrayInLocal(cartArray)
    calculateTotalPrice(cartArray)
}
function removeLineHandler(event){
    targetSrc = event.target.parentElement.parentElement.firstElementChild.firstElementChild.getAttribute('src')
    index = cartArray.findIndex(function (line){
        return line['srcImg'] == targetSrc
    })
    cartArray.splice(index,1)
    calculateTotalPrice(cartArray)
    event.target.parentElement.parentElement.remove()
    setCartArrayInLocal(cartArray)
}
function addToCart(src,title,price,number){
    newDiv = document.createElement('div')
    newDiv.className = 'cart-row'
    newDiv.innerHTML = `
        <div class="cart-item cart-column">
          <img class="cart-item-image" src=${src} width="100" height="100">
          <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">$${price}</span>
        <div class="cart-quantity cart-column">
          <input class="cart-quantity-input" type="number" value=${number} onchange="changeInputHandler(event)">
          <button class="btn btn-danger" type="button" onclick="removeLineHandler(event)">REMOVE</button>
        </div>
    `
    cartItemsFragment.appendChild(newDiv)
    newLine = {
        srcImg : src,
        title : title,
        price : price,
        number : number
    }
    cartArray.push(newLine)
    calculateTotalPrice(cartArray)
    setCartArrayInLocal(cartArray)

    return cartItemsFragment
}
function calculateTotalPrice(cartArray){
    totalPrice = 0
    cartArray.forEach(function (line){
        totalPrice = totalPrice + (line['price'] * line['number'])
    })
    cartTotalPrice.innerHTML = ''
    cartTotalPrice.innerHTML = `$${totalPrice}`
    localStorage.setItem('localTotalPrice',totalPrice)
}
function addToCartBtnHandler(event){
    selectedItemSrc = event.target.parentElement.parentElement.children[1].getAttribute('src')
    flag = cartArray.some(function (line){
        return line['srcImg'] == selectedItemSrc
    })
    if (!flag){
        selectedItemPrice = event.target.parentElement.firstElementChild.innerText
        selectedItemPrice = selectedItemPrice.substring(1)
        selectedItemPrice = Number(selectedItemPrice)
        selectedItemTitle = event.target.parentElement.parentElement.children[0].innerText
        cartItems.appendChild(addToCart(selectedItemSrc,selectedItemTitle,selectedItemPrice,1))
    }else {
        modal.classList.add('modal--show')
        setTimeout(function (){
            modal.classList.remove('modal--show')
        },3000)
    }
}
function showProductsInPage(activePaginationBtnId){
    btns = document.querySelectorAll('.btn-pagination')
    btns = Object.values(btns)
    btns.forEach(function (btn){
        btn.classList.remove('btn-pagination--active')
    })
    document.getElementById(activePaginationBtnId).classList.add('btn-pagination--active')
    endTarget = Number(activePaginationBtnId) * pageNumber
    startTarget = endTarget - pageNumber
    selectedProducts = products.slice(startTarget,endTarget)
    selectedProducts.forEach(function (line){
        newDiv = document.createElement('div')
        newDiv.className = 'shop-item'
        newDiv.innerHTML = (`
            <span class="shop-item-title">${line['title']}</span>
            <img class="shop-item-image" src=${line['srcImg']} />
            <div class="shop-item-details">
                <span class="shop-item-price">$${line['price']}</span>
                <button onclick="addToCartBtnHandler(event)" class="btn btn-primary shop-item-button" type="button" >
                    ADD TO CART
                </button>
            </div>
        `)
        sectionProductsFragment.appendChild(newDiv)
    })
    sectionProduct.appendChild(sectionProductsFragment)
}
function paginationBtnHandler(event){
    sectionProduct.innerHTML = ''
    targetBtnId = event.target.getAttribute('id')
    showProductsInPage(targetBtnId)
    localStorage.setItem('localPaginationBtnActive',targetBtnId)
}

function creatPaginationBtns(n){
    for (let i = 1; i <= n ; i++) {
        newBtn = document.createElement('button')
        newBtn.innerHTML = `${String(i)}`
        newBtn.setAttribute('onclick','paginationBtnHandler(event)')
        newBtn.setAttribute('id',`${i}`)
        newBtn.className = 'btn-pagination'
        paginationBtnsFragment.appendChild(newBtn)
    }
    sectionPagination.appendChild(paginationBtnsFragment)
}
let purchaseBtn = document.querySelector('.btn-purchase')
purchaseBtn.addEventListener('click',function (){
    cartArray = []
    setCartArrayInLocal(cartArray)
    cartItems.innerHTML = ''
    calculateTotalPrice(cartArray)
})
window.onload = function (){
    pageNumber = 4
    productNumber = products.length
    paginationBtnNumber = Math.floor(productNumber / pageNumber)
    if (productNumber % pageNumber > 0){
        paginationBtnNumber+=1
    }
    creatPaginationBtns(paginationBtnNumber)
    currentPaginationBtnActive = localStorage.getItem('localPaginationBtnActive')
    if (currentPaginationBtnActive == null){
        currentPaginationBtnActive = 1
    }
    showProductsInPage(currentPaginationBtnActive)
    savedCartArray = JSON.parse(localStorage.getItem('localCartArray'))
    if (savedCartArray != null){
        let resultFragment = document.createDocumentFragment()
        savedCartArray.forEach(function (line){
            resultFragment.appendChild(addToCart(line['srcImg'],line['title'],line['price'],line['number']))
        })
        cartItems.appendChild(resultFragment)
    }
    savedTotalPrice = localStorage.getItem('localTotalPrice')
    if (savedTotalPrice != null){
        cartTotalPrice.innerHTML = ''
        cartTotalPrice.innerHTML = `$${totalPrice}`
    }
}