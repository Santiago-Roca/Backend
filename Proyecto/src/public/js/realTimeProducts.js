const socket = io();

socket.on("products", (data) => {
    const content = document.getElementById("productsContent")
    let products = "";
    data.forEach((product) => {
        products += `${product.title} <br/> Precio: $${product.price} <br/> Cat: ${product.category} <br/> Stock: ${product.stock} unidades <br/> ID: ${product._id} <br/><br/>`;
    });
    content.innerHTML = products;
});

