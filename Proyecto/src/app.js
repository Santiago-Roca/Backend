import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import ProductsRouter from "./routes/products.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionRouter from "./routes/session.router.js";
import CartRouter from "./routes/carts.router.js";
import UserRouter from "./routes/users.router.js";

import registerChatHandler from "./listeners/chatHandler.js";
import realTimeProducts from "./listeners/realTimeHandler.js";

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

const io = new Server(server);

const connection = mongoose.connect(config.mongo.URL);

app.use((req, res, next) => {
  req.io = io;
  next();
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: "Proyecto Backend",
      description: "Documentación para API principal del Proyecto de Backend"
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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

app.use("/loggertest", (req, res) => {
  req.logger.debug("Entrando en logger de debug");
  req.logger.http("Entrando en logger de http");
  req.logger.info("Entrando en logger de Info");
  req.logger.warning("Entrando en logger de warning");
  req.logger.error("Entrando en logger de error");
  req.logger.fatal("Entrando en logger de fatal");
  res.send({ status: "success" })
})

io.on("connection", async (socket) => {
  registerChatHandler(io, socket);
  realTimeProducts(io, socket);
});
