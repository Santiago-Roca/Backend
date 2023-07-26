import { faker } from "@faker-js/faker/locale/es";

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 1, max: 20 }),
        category: faker.commerce.department(),
        thumbnail: [],
        id: faker.database.mongodbObjectId()
    }
}