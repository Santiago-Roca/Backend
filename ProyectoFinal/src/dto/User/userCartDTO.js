export default class userCartDTO {
    static getFrom = (user) => {
        return {
            name: user.name,
            email: user.email,
            role: user.role,
            cart: user.cart
        }
    }
}