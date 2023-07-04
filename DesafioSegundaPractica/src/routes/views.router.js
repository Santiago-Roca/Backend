import { passportCall } from "../services/auth.js";
import BaseRouter from "./Router.js";
import productModel from "../dao/mongo/models/product.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    // this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'locals' }), (req, res) => {
    //     res.sendSuccess("Register success")
    // })
    // this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'locals' }), (req, res) => {
    //     const token = generateToken(req.user)
    //     res.cookie('authToken', token, { maxAge: 1000 * 3600 * 24, httpOnly: true }).sendSuccess("Logged in")
    // })

    // this.get('/', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), (req, res) => {
    //     if (!req.user) return res.sendUnauthorized("User not logged in")
    //     res.send(req.user)
    // })


    //GET
    // this.get('/products', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
    //   // router.get("/products", async (req, res) => {
    //   try {
    //     const { page = 1 } = req.query;
    //     const { limit = 10 } = req.query;
    //     const { sort } = req.query;

    //     let ordenar = ''

    //     if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
    //       ordenar = { price: sort }
    //     }

    //     const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
    //       page, limit, sort: ordenar, lean: true
    //     });

    //     const products = docs;
    //     res.render("home", {
    //       products,
    //       hasPrevPage,
    //       hasNextPage,
    //       prevPage,
    //       nextPage,
    //       page: rest.page,
    //       limit: rest.limit,
    //       user: req.session.user
    //     });

    //   } catch (error) {
    //     res.status(500).send({ status: "error", message: "Error al obtener productos" });
    //   }
    // });

    //GET
    this.get('/products', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      // router.get("/products", async (req, res) => {
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
          // user: req.session.user
        });

        console.log(req.user)

      } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener productos" });
      }
    });


    //   }
    // }


    //GET
    this.get('/oso', ['PUBLIC'], passportCall('jwt', { strategyType: 'jwt', session: false }), async (req, res) => {
      // router.get("/products", async (req, res) => {
      try {
        res.render("cart");

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






  }
}




//     //GET CART BY ID
//     router.get("/cart/:cid", async (req, res) => {
//       try {
//         const { cid } = req.params
//         const cartId = await cartManager.getCartById({ _id: cid })
//         if (!cartId) return res.status(404).send({ status: "error", error: "Cart not found" });
//         res.render("cart", cartId)
//       } catch (error) {
//         console.log(error)
//       }
//     });




// import { Router } from "express";
// import ProductsManager from "../dao/mongo/managers/ProductManager.js";
// import productModel from "../dao/mongo/models/product.js";
// import CartsManager from "../dao/mongo/managers/cartsManager.js";
// // import { privacy } from "../middleware/auth.js";

// const router = new Router();

// const productManager = new ProductsManager();
// const cartManager = new CartsManager()

// //GET PRODUCTS
// // router.get("/products", privacy("PRIVATE"), async (req, res) => {
// router.get("/products", async (req, res) => {
//   try {
//     const { page = 1 } = req.query;
//     const { limit = 10 } = req.query;
//     const { sort } = req.query;

//     let ordenar = ''

//     if (sort == 1 || sort == -1 || sort == 'asc' || sort == 'desc') {
//       ordenar = { price: sort }
//     }

//     const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({}, {
//       page, limit, sort: ordenar, lean: true
//     });

//     const products = docs;
//     res.render("home", {
//       products,
//       hasPrevPage,
//       hasNextPage,
//       prevPage,
//       nextPage,
//       page: rest.page,
//       limit: rest.limit,
//       user: req.session.user
//     });

//   } catch (error) {
//     res.status(500).send({ status: "error", message: "Error al obtener productos" });
//   }
// });

// //GET CART BY ID
// router.get("/cart/:cid", async (req, res) => {
//   try {
//     const { cid } = req.params
//     const cartId = await cartManager.getCartById({ _id: cid })
//     if (!cartId) return res.status(404).send({ status: "error", error: "Cart not found" });
//     res.render("cart", cartId)
//   } catch (error) {
//     console.log(error)
//   }
// });

// //Real Time Products
// router.get("/realtimeproducts", async (req, res) => {
//   res.render("realtimeproducts");
// });

// //CHAT
// router.get("/chat", (req, res) => {
//   res.render("chat");
// });

// //REGISTER
// // router.get('/register', privacy("NO_AUTHENTICATED"), (req, res) => {
// router.get('/register', (req, res) => {
//   res.render('register')
// })




// //LOGIN
// // router.get('/login', privacy("NO_AUTHENTICATED"), (req, res) => {
// router.get('/login', (req, res) => {
//   res.render('login')
// })

// export default router;
