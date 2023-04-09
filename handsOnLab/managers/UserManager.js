import fs, { existsSync } from "fs";

export default class UserManager {
  constructor() {
    this.path = "./files/Users.json";
  }

  getUsers = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const users = JSON.parse(data);
        return users;
      }
      return [];
    } catch (error) {
      console.log(error);
    }
  };

  createUser = async (user) => {
    try {
      const users = await this.getUsers();
      const lastPosition = users.length - 1;
      if (users.length == 0) {
        user.id = 1;
      } else {
        user.id = users[lastPosition].id + 1;
      }
      users.push(user);
      await fs.promises.writeFile(this.path, JSON.stringify(users, null, "\t"));
      return user;
      
    } catch (error) {
      console.log(error);
    }
  };
}
