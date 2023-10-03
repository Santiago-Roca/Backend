import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import ProductsRouter from "./routes/products.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionRouter from "./routes/session.router.js";
import CartRouter from "./routes/carts.router.js";
import UserRouter from "./routes/users.router.js";

import initializePassportStrategies from "./config/passport.config.js";
import __dirname from "./utils.js";
import config from "./config/config.js";
import errorHandler from "./middlewares/error.js"
import attachLogger from "./middlewares/logger.js";

const app = express();
const PORT = config.app.PORT;

app.use(attachLogger)
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
initializePassportStrategies();

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const connection = mongoose.connect(config.mongo.URL);

const sessionRouter = new SessionRouter()
const viewsRouter = new ViewsRouter()
const productsRouter = new ProductsRouter()
const cartRouter = new CartRouter()
const userRouter = new UserRouter()

app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/users", userRouter.getRouter());
app.use("/", viewsRouter.getRouter());
app.use(errorHandler)

