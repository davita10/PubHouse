const formidable = require("formidable");
const _ = require("lodash");
//need import fs. js code module for access to file system to readFileSync
const fs = require("fs");

const Product = require("../models/product.model");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //so any img type extensions are there
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded", //if no err continue creating product
      });
    }
    console.log(fields, files);
    let product = new Product(fields);

    if (files.photo) {
      console.log("files.photo", files.photo);
      //.photo or .img must match model type name using
      //photo.data from model = access file system and read file synchronously
      product.photo.data = fs.readFileSync(files.photo.path); //path from client side files.photo
      product.photo.contentType = files.photo.type;
    }

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
