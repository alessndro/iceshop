import { menuArray } from '/data.js'

// list of objects, with product info 
let userCart = [
]
let finalMessage = ''
    
const foodListEl = document.getElementById('food-list')
const orderListEl = document.getElementById('order-list')
const payForm = document.getElementById('pay-form')
const thanksMessageEl = document.getElementById('thanks-message')
const discountH2 = document.getElementById('discount-h2')
const modal = document.getElementById('modal')
let isTransaction = true


document.addEventListener('click', function(event)
{
    if (event.target.dataset.buy)
    {
        handleProductBuy(event.target.dataset.buy)
    }
    if (event.target.dataset.remove)
    {
        removeOrderItem(event.target.dataset.remove)
    }
    if (event.target.id === 'complete-btn')
    {
        console.log('complete order click')
        modal.classList.remove('hidden')
    }
})

payForm.addEventListener('submit', function(event)
{
        event.preventDefault()
        console.log('payForm submit')
        const finalizeOrderData = new FormData(payForm)
        modal.classList.add('hidden')
        finalizeOrder(finalizeOrderData)
})

function handleProductBuy(productId)
{
    // Toggle product information, if there is no product in product list
    
    const productToBuyObject = menuArray.filter(function(item)
    {
        return item.id == productId
    })[0]
    
    
    // Remember if product previously added to order
    let newItem = false
    
    // Check if already product in cart
    userCart.forEach(function(cartItem)
    {
        if (cartItem.id === productToBuyObject.id)
        {
            cartItem.quantity++
            cartItem.totalPrice = cartItem.totalPrice + cartItem.price
            newItem = true
        }
    })
    
    if (!newItem)
    {
        const newObject = {
            name: productToBuyObject.name,
            id: productToBuyObject.id,
            quantity: 1,
            price: productToBuyObject.price,
            totalPrice: productToBuyObject.price,
        }
        
        userCart.push(newObject)
    }
    render()
}

function getFoodHtml()
{
    let foodHtml = ''
    
    menuArray.forEach(function(food)
    {
        foodHtml += `<li class='row-li'>
            <p class='emoji-icon'>${food.emoji}</p>
            <div class="column-div">
                <p>${food.name}</p>
                <p>${food.ingredients}</p>
                <p>€${food.price}</p>
            </div>
            <button data-buy=${food.id} class='add-btn'>+</button>
            </div>
        </li>`
    })
    return foodHtml
}

function getOrderHtml()
{
    let orderHtml = ''
    userCart.forEach(function(item)
    {
        orderHtml += `<li class='row-order'>
                <div class='order-name'>
                    <p>${item.name} </p>
                </div>
                <div class='order-remove'>
                    <p data-remove=${item.id}>remove</p>
                </div>
                <div class='order-quantity'>
                    <p>${item.quantity}</p>
                </div>
                <div class='order-totalprice'>
                    <p>€${item.totalPrice}</p>
                </div>
        </li>`
    })
    orderHtml += `<li class="row-order border-top">
                        <div class="order-name"><p>Transaction costs</p></div> 
                        <div class='order-totalprice fullorder-total-price' id='transaction-costs'><p></p></div>
                    </li>`
    orderHtml += `<li class="row-order border-top">
        <div class="order-name"><p>Total</p></div> 
        <div id="order-totals-el" class='order-totalprice fullorder-total-price'><p></p></div>
    </li>`
    return orderHtml
}

function getOrderTotalHtml()
{
    // Initialize order totals
    let orderTotals = 0
    
    // Loop through all cart items, calculate order totals 
    userCart.forEach(function(item)
     {
         orderTotals += item.totalPrice
     })

    if (orderTotals > 10)
    {
        isTransaction = false
    }
    else
    {
        isTransaction = true
        orderTotals = orderTotals + 3.5
    }
     
     return `${orderTotals}`
}

function removeOrderItem(removeOrderId)
{
    // Get list without specific item to delete
    const toKeepItemslist = userCart.filter(function(item)
    {
        return item.id != removeOrderId
    })
    
    // Assign userCart list this new list
    userCart = toKeepItemslist
    
    // Render page with new userCart values
    render()
}

function finalizeOrder(formData)
{
    
    const name = formData.get('name')
    console.log(name)
    finalMessage = `Thank you, ${name}. Your order is on the way!`
    userCart = []
    render()
}

function render()
{
    foodListEl.innerHTML = getFoodHtml()
    orderListEl.innerHTML = getOrderHtml()


    const orderTotalsEl = document.getElementById("order-totals-el")
    const orderTotals = getOrderTotalHtml() 
    orderTotalsEl.innerHTML = orderTotals

    const transactionCostsEl = document.getElementById("transaction-costs")
    if (isTransaction)
    {
        transactionCostsEl.innerHTML = 3.5
    }
    else
    {
        transactionCostsEl.innerHTML = 0
    }
    console.log(finalMessage)
    
    if (finalMessage)
    {
        discountH2.innerHTML = finalMessage
    }
}

render()