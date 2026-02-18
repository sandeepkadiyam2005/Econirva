import * as productService from '../services/productService.js';

export const getProducts = async (req, res) => {
  const products = await productService.getProducts(req.tenant.id);
  res.status(200).json({ success: true, data: products });
};

export const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.tenant.id, req.params.id);
  res.status(200).json({ success: true, data: product });
};

export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.tenant.id, req.body);
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.tenant.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: product });
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.tenant.id, req.params.id);
  res.status(204).send();
};
