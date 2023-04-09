import ProductManager from "./managers/ProductManager.js"

const productManager = new ProductManager()

const context = async () => {
    try {

        console.log(await productManager.getProducts())

        const product1 = { title: "Jabon", description: "limpieza", price: 300, thumbnail: "sin imagen", code: "abc1", stock: 10 };
        const product2 = { title: "Atun", description: "alimento", price: 500, thumbnail: "sin imagen", code: "abc2", stock: 10 };
        await productManager.addProduct(product1)
        await productManager.addProduct(product2)

        console.log(await productManager.getProducts())

        console.log(await productManager.getProductsById(2))
        console.log(await productManager.updateProduct(1, 'title', 'Shampoo'))

        await productManager.deleteProduct(3)
        await productManager.deleteProduct(2)

        console.log(await productManager.getProducts())

    } catch (error) {
        console.log(error)
    }

}

context()