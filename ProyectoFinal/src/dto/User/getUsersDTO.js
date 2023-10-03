export default class getUsersDTO {
    static getFrom = (users) => {
        const arrayUsers = []
        users.forEach(item => {
            let user = {
                name: item.firstName,
                email: item.email,
                role: item.role
            }
            arrayUsers.push(user)
        });
        return arrayUsers;
    }
}