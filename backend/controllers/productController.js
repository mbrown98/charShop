import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc  Fetch all products
// @route  GET /api/products
// @access  PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;

  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @desc  Create Product
// @route  POST /api/products
// @access  PRIVATE/ADMIN
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "sample category",
    countInStock: 0,
    size: "L",
    description: "Sample Description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc  Update Product
// @route  PUT /api/products/:id
// @access  PRIVATE/ADMIN
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  console.log(req.params.id);
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc  Get Top Products
// @route  GET /api/products/top
// @access  PUBLIC
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort().limit(3);
  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
};
