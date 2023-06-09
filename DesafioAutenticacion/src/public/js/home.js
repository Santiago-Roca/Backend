const boton = document.getElementById('botonLogout')

boton.addEventListener("click", () => {
    window.location.replace('/api/session/logout');
});
