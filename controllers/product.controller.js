const formidable = require("formidable");
const _ = require("lodash");
//need import fs. js code module for access to file system to readFileSync
const fs = require("fs");
const Product = require("../models/product.model");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    //access Product model
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found", //if no err continue to product
      });
    }
    req.product = product; //product found in DB byId made avail in request object, called product
    next(); //MIDDLEWARE needs next() to keep app flowing
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined; //we send photo separately for efficiency due to size
  return res.json(req.product);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //so any img type extensions are there
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded", //if no err continue creating product
      });
    }
    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    console.log(fields, files);
    let product = new Product(fields);

    if (files.photo) {
      //.photo or .img must match model type name using
      //photo.data from model = access file system and read file synchronously
      console.log("FILES PHOTO:", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image must be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath); //path from client side files.photo
      product.photo.contentType = files.photo.mimetype;
    }
    // console.log(filepath);

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err), //from mongoose like category.controller
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      // deletedProduct,    //deletedProduct data not needed so don't need to return it, just message
      message: "Product successfully deleted",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //so any img type extensions are there
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded", //if no err continue creating product
      });
    }
    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    console.log(fields, files);
    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      //.photo or .img must match model type name using
      //photo.data from model = access file system and read file synchronously
      console.log("FILES PHOTO:", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image must be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath); //path from client side files.photo
      product.photo.contentType = files.photo.mimetype;
    }
    // console.log(filepath);

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err), //from mongoose like category.controller
        });
      }
      res.json(result);
    });
  });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 9;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.send(products);
    });
};
