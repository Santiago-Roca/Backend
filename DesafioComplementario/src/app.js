import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import registerChatHandler from "./listeners/chatHandler.js";
import realTimeProducts from "./listeners/realTimeHandler.js";

import __dirname from "./utils.js";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = new Server(server);

const connection = mongoose.connect(
  "mongodb+srv://santiroca88:SANtiago88@cluster0.xhslwvl.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  registerChatHandler(io, socket);
  realTimeProducts(io, socket);
});
