import { passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";
import productModel from "../dao/mongo/models/product.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    //GET PRODUCTS
    this.get('/products', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      try {
        const { page = 1 } = req.query;
        const { limit = 10 } = req.query;
        const { sort } = req.query;

        let ordenar = ''

        if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
          ordenar = { price: sort }
        }

        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
          page, limit, sort: ordenar, lean: true
        });

        const products = docs;
        res.render("home", {
          products,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          page: rest.page,
          limit: rest.limit,
          user: req.user
        });


      } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener productos" });
      }
    });

    //REGISTER
    this.get('/register', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      res.render('register')
    });

    //LOGIN
    this.get('/login', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      res.render('login')
    });

    //CURRENT
    this.get('/current', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      let user = req.user
      res.render('current', { user })
    });

    this.get('/logout', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      return res.redirect("/login")
    })

    //GET CART BY ID
    this.get('/cart/:cid', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      try {
        const { cid } = req.params
        const cartId = await cartManager.getCartById({ _id: cid })
        if (!cartId) return res.status(404).send({ status: "error", error: "Cart not found" });
        res.render("cart", cartId)
      } catch (error) {
        console.log(error)
      }
    });

    //Real Time Products
    this.get('/realtimeproducts', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      res.render("realtimeproducts");
    });

    // //CHAT
    this.get('/chat', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      res.render("chat");
    });

  }
}
