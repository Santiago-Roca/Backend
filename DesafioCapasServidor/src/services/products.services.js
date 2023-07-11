export default class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  getAllProducts = () => {
    return this.dao.getProducts();
  };

  createProduct = (product) => {
    return this.dao.createProduct(product);
  };

  getProductBy = (params) => {
    return this.dao.getProductBy(params);
  };

  updateProduct = (id, product) => {
    return this.dao.updateProduct(id, product)
  };

  deleteProduct = (id) => {
    return this.dao.deleteProduct(id)
  };

}
