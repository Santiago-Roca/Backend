const form = document.getElementById('loginForm')

form.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value));
    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseData = await response.json();
    if (responseData.status === 'Logged in Admin') {
        window.location.replace('/menuAdmin');
    } else {
        window.location.replace('/products');
    }
}) 