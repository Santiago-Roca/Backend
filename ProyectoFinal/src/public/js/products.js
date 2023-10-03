let cart = document.getElementById("cart")
const btnLogout = document.getElementById('botonLogout')

//ADD PRODUCT
document.addEventListener("click", async (event) => {
    if (event.target.className == "btnAdd") {
        let boxUser = event.target.parentElement
        let pid = boxUser.querySelector('.IDProduct').innerText.substring(3)
        const response = await fetch(`/api/carts/product/${pid}`, {
            method: 'POST',
        })
        const responseData = await response.json();
        if (responseData.status === 'success') {
            alert("Producto agregado")
            window.location.replace('/products');
        }
    }
});

//LOGOUT
btnLogout.addEventListener("click", async () => {
    const response = await fetch('/api/sessions/logout', {
        method: 'POST',
    })
    const responseData = await response.json();
    if (responseData.status === 'Logout') {
        window.location.replace('/login');
    }
});
