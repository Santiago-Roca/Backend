import fs, { existsSync } from "fs";

export default class CartManager {
    constructor() {
        this.path = "../PrimerEntrega/files/carts.json";
    }

    //RETURN THE LIST OF CARTS
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(data);
                return carts;
            }
            return [];
        } catch (error) {
            console.log(error);
        }
    };

    //ADDING A CART
    addCart = async (cart) => {
        try {
            const carts = await this.getCarts();
            const lastPosition = carts.length - 1;
            carts.length == 0 ? (cart.id = 1) : (cart.id = carts[lastPosition].id + 1);
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
            return carts;
        } catch (error) {
            console.log(error);
        }
    };

    //ADD PRODUCT ON CART
    addProductCart = async (cartId, productId) => {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((item) => item.id === cartId);
            if (cartIndex != -1) {
                const productExists = carts[cartIndex].products.find((item) => item.product === productId);
                if (productExists) {
                    productExists.quantity += 1;
                } else {
                    carts[cartIndex].products.push({ product: productId, quantity: 1 })
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
                return true;
            }
            return false;
        } catch (error) {
            console.log(error)
        }
    }

    //RETURN THE PRODUCTS OF CARRITO BY ID
    getProductsCartById = async (id) => {
        const carts = await this.getCarts();
        const exists = carts.find((item) => item.id === id);
        if (exists != undefined) {
            return exists;
        }
        return null;
    };
}
