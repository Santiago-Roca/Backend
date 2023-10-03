let statusPurchase = document.getElementById("status")
const purchase = document.getElementById("completePurchase")
const emptyCart = document.getElementById("emptyCart")

//DELETE ITEM
document.addEventListener("click", async (event) => {
    if (event.target.className == "btnDelete") {
        let boxUser = event.target.parentElement
        let pid = boxUser.querySelector('.IDProduct').innerText.substring(3)
        const response = await fetch(`/api/carts/product/${pid}`, {
            method: 'DELETE',
        })
        const responseData = await response.json();
        if (responseData.status === 'success') {
            window.location.replace('/cart');
        } else {
            alert("Ocurrió un error al eliminar el producto")
        }
    }
});

//EMPTY CART
emptyCart.addEventListener("click", async () => {
    const response = await fetch(`/api/carts/`, {
        method: 'DELETE',
    })
    const responseData = await response.json();
    if (responseData.status === 'success') {
        window.location.replace('/cart');
    } else {
        alert("Ocurrió un error al eliminar el producto")
    }
})

//COMPLETE PURCHASE
purchase.addEventListener("click", async () => {
    statusPurchase.innerText = "Procesando compra..."
    const response = await fetch("/api/carts/purchase", {
        method: 'POST',
    })
    const responseData = await response.json();
    if (responseData.status === 'success') {
        alert("Compra finalizada con éxito")
        window.location.replace('/completePurchase');
    } else {
        alert("Algunos productos seleccionados no tienen stock suficiente para completar el proceso de compra. Corrobore stock!")
        window.location.replace('/products');
    }

})