const btnUsers = document.getElementById('btnUsers')
const btnProducts = document.getElementById('btnProducts')

btnUsers.addEventListener("click", ()=>{
    window.location.replace('/users');
})

btnProducts.addEventListener("click", ()=>{
    window.location.replace('/productsAdmin');
})