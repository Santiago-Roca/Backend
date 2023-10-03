const btnLogout = document.getElementById('botonLogout')

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

//CHANGE ROL
document.addEventListener("click", async (event) => {
    if (event.target.className == "btnChange") {
        let boxUser = event.target.parentElement
        let email = boxUser.querySelector('.emailUser').innerText
        const response = await fetch(`/api/users/role/${email}`, {
            method: 'POST',
        })
        const responseData = await response.json();
        if (responseData.status === 'success') {
            window.location.replace('/users');
        }
    }
});

//DELETE USER
document.addEventListener("click", async (event) => {
    if (event.target.className == "btnDelete") {
        let boxUser = event.target.parentElement
        let email = boxUser.querySelector('.emailUser').innerText
        const response = await fetch(`/api/users/${email}`, {
            method: 'DELETE',
        })
        const responseData = await response.json();
        if (responseData.status === 'success') {
            window.location.replace('/users');
        }
    }
});
