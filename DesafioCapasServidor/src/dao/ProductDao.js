import productModel from "../dao/models/product.model.js"

export default class ProductsManager {
  get = (params) => {
    return productModel.find(params).lean();
  };

  getBy = (params) => {
    return productModel.findOne(params).lean();
  };

  save = (product) => {
    return productModel.create(product);
  };

  update = (id, product) => {
    return productModel.findByIdAndUpdate(id, { $set: product });
  };

  delete = (id) => {
    return productModel.findByIdAndDelete(id);
  };

}
