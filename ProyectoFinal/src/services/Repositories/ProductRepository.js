export default class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  getAllProducts = () => {
    return this.dao.get();
  };

  createProduct = (product) => {
    return this.dao.save(product);
  };

  getProductBy = (params) => {
    return this.dao.getBy(params);
  };

  updateProduct = (id, product) => {
    return this.dao.update(id, product)
  };

  deleteProduct = (id) => {
    return this.dao.delete(id)
  };

}
