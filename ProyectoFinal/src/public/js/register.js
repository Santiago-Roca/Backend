const form = document.getElementById('registerForm')

const statusRegister = document.getElementById("statusRegister")

form.addEventListener('submit', async (evt) => {
    statusRegister.innerText = "Procesando Registro..."
    evt.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value));
    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseData = await response.json();
    if (responseData.status === 'success') {
        window.location.replace('/login');
    }
});