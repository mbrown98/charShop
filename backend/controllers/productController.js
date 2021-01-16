import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc  Fetch all products
// @route  GET /api/products
// @access  PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc  Fetch product by id
// @route  GET /api/products/:id
// @access  PUBLIC
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc  Delete product by id
// @route  DELETE /api/products/:id
// @access  PRIVATE/ADMIN
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export { getProductById, getProducts, deleteProduct };
