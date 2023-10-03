export default class UserDTO {
    static getFrom = (user) => {
        return {
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
}