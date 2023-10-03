const btnLogout = document.getElementById('botonLogout')

//ADD PRODUCT
document.addEventListener("click", async (event) => {
    if (event.target.className == "btnDelete") {
        let boxUser = event.target.parentElement
        let pid = boxUser.querySelector('.IDProduct').innerText.substring(3)
        const response = await fetch(`/api/products/${pid}`, {
            method: 'DELETE',
        })
        const responseData = await response.json();
        if (responseData.status === 'success') {
            window.location.replace('/productsAdmin');
        }else{
            alert("No se ha podido eliminar el producto seleccionado")
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
