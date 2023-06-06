const form = document.getElementById('loginForm')

form.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value));
    const response = await fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseData = await response.json();
    console.log(responseData);
    if (responseData.status === 'login success') {
        window.location.replace('/products');
    }
}) 