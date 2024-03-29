import dotenv from "dotenv";

dotenv.config();

export default {
    app: {
        PORT: process.env.PORT || 8080,
        SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
        SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD
    },
    mongo: {
        URL: process.env.MONGO_URL || "localhost:27017",
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },
    mailer: {
        USER: process.env.MAILER_USER,
        PASSWORD: process.env.MAILER_PASSWORD
    }
};
